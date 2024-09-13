import { Channel, ConsumeMessage } from 'amqplib';
import { logger } from '../config/logger';
import { PackagePayloadType } from '../enums/package-payload-type.enum';
import { addPackageHandler } from '../handlers/add-package.handler';
import { updatePackageHandler } from '../handlers/update-package.handler';

export const packageNotificationQueueConsumer = async (
  message: ConsumeMessage | null,
  channel: Channel
): Promise<void> => {
  if (!message) {
    logger.warn('Received message is null.');
    return;
  }

  try {
    const jsonPayload = message.content.toString();
    const payload = JSON.parse(jsonPayload);

    if (!('type' in payload)) {
      throw new Error('`type` is missing from payload object.');
    }

    switch (payload.type) {
      case PackagePayloadType.AddPackage:
        await addPackageHandler(payload);
        break;
      case PackagePayloadType.UpdatePackage:
        await updatePackageHandler(payload);
        break;
      default:
        throw new Error(`Handler for type \`${payload.type}\` is not implemented.`);
    }

    channel.ack(message);
  } catch (e: unknown) {
    const error = e as Error;
    logger.error(
      {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      'An unknown error occurred.'
    );
  }
};
