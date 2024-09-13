import { connect } from 'amqplib';
import { env } from './config/env';
import { logger } from './config/logger';
import { packageNotificationQueueConsumer } from './consumers/package-notification-queue.consumer';

const boostrap = async (): Promise<void> => {
  const connection = await connect({
    protocol: env.RABBITMQ_PROTOCOL,
    hostname: env.RABBITMQ_HOSTNAME,
    port: env.RABBITMQ_PORT,
  });
  const channel = await connection.createChannel();

  await channel.consume(
    env.PACKAGE_NOTIFICATION_QUEUE_NAME,
    async (message) => await packageNotificationQueueConsumer(message, channel)
  );

  logger.info('Blockchain Service is listening.');
};

boostrap();
