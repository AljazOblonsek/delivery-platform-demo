import { Channel, ConsumeMessage } from 'amqplib';
import { afterEach, beforeAll, describe, expect, it, jest, mock, spyOn } from 'bun:test';
import { logger } from '../config/logger';
import { PackagePayloadType } from '../enums/package-payload-type.enum';
import * as addPackageHandlerModule from '../handlers/add-package.handler';
import * as updatePackageHandlerModule from '../handlers/update-package.handler';
import { packageNotificationQueueConsumer } from './package-notification-queue.consumer';

describe('packageNotificationQueueConsumer', () => {
  beforeAll(() => {
    logger.level = 'silent';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log a warn if message is null', async () => {
    const warnSpy = spyOn(logger, 'warn');

    await packageNotificationQueueConsumer(null, mock() as unknown as Channel);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('Received message is null.');
  });

  it('should log an error if parsing the message content as json fails', async () => {
    const messageStub: ConsumeMessage = {
      content: Buffer.from('not-a-json', 'utf8'),
      fields: {},
      properties: {},
    } as ConsumeMessage;
    const errorSpy = spyOn(logger, 'error');

    await packageNotificationQueueConsumer(messageStub, mock() as unknown as Channel);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      { error: expect.objectContaining({ message: expect.stringContaining('JSON Parse error') }) },
      'An unknown error occurred.'
    );
  });

  it('should log an error if type is missing from payload', async () => {
    const payloadStub = {
      id: 1,
    };

    const messageStub: ConsumeMessage = {
      content: Buffer.from(JSON.stringify(payloadStub), 'utf8'),
      fields: {},
      properties: {},
    } as ConsumeMessage;
    const errorSpy = spyOn(logger, 'error');

    await packageNotificationQueueConsumer(messageStub, mock() as unknown as Channel);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      {
        error: expect.objectContaining({
          message: expect.stringContaining('`type` is missing from payload object.'),
        }),
      },
      'An unknown error occurred.'
    );
  });

  it('should log an error if handler does not exist for provided type', async () => {
    const payloadStub = {
      id: 1,
      type: 'some-random-type',
    };

    const messageStub: ConsumeMessage = {
      content: Buffer.from(JSON.stringify(payloadStub), 'utf8'),
      fields: {},
      properties: {},
    } as ConsumeMessage;
    const errorSpy = spyOn(logger, 'error');

    await packageNotificationQueueConsumer(messageStub, mock() as unknown as Channel);

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      {
        error: expect.objectContaining({
          message: expect.stringContaining(
            `Handler for type \`${payloadStub.type}\` is not implemented.`
          ),
        }),
      },
      'An unknown error occurred.'
    );
  });

  it('should call `addPackageHandler` if payload has type `add-package` and acknowledge message on success', async () => {
    const payloadStub = {
      id: 1,
      type: PackagePayloadType.AddPackage,
    };
    const messageStub: ConsumeMessage = {
      content: Buffer.from(JSON.stringify(payloadStub), 'utf8'),
      fields: {},
      properties: {},
    } as ConsumeMessage;
    const channelAckSpy = mock();
    const addPackageHandlerSpy = spyOn(
      addPackageHandlerModule,
      'addPackageHandler'
    ).mockResolvedValueOnce();

    await packageNotificationQueueConsumer(messageStub, {
      ack: channelAckSpy,
    } as unknown as Channel);

    expect(addPackageHandlerSpy).toHaveBeenCalledTimes(1);
    expect(addPackageHandlerSpy).toHaveBeenCalledWith(payloadStub);
    expect(channelAckSpy).toHaveBeenCalledTimes(1);
    expect(channelAckSpy).toHaveBeenCalledWith(messageStub);
  });

  it('should call `updatePackageHandler` if payload has type `update-package` and acknowledge message on success', async () => {
    const payloadStub = {
      id: 1,
      type: PackagePayloadType.UpdatePackage,
    };
    const messageStub: ConsumeMessage = {
      content: Buffer.from(JSON.stringify(payloadStub), 'utf8'),
      fields: {},
      properties: {},
    } as ConsumeMessage;
    const channelAckSpy = mock();
    const updatePackageHandlerSpy = spyOn(
      updatePackageHandlerModule,
      'updatePackageHandler'
    ).mockResolvedValueOnce();

    await packageNotificationQueueConsumer(messageStub, {
      ack: channelAckSpy,
    } as unknown as Channel);

    expect(updatePackageHandlerSpy).toHaveBeenCalledTimes(1);
    expect(updatePackageHandlerSpy).toHaveBeenCalledWith(payloadStub);
    expect(channelAckSpy).toHaveBeenCalledTimes(1);
    expect(channelAckSpy).toHaveBeenCalledWith(messageStub);
  });
});
