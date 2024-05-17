import { Channel } from "amqplib";
import { createConnection } from "@review/queues/connection";
import { logger } from "@review/config";

export async function publishFanoutMessage(
    channel: Channel,
    exchangeName: string,
    message: string,
    logMessage: string
): Promise<void> {
    try {
        if (!channel) {
            channel = await createConnection();
        }

        await channel.assertExchange(exchangeName, "fanout");

        channel.publish(exchangeName, "", Buffer.from(message));
        logger("queues/review.producer.ts - publishFanoutMessage()").info(
            logMessage
        );
    } catch (error) {
        logger("queues/review.producer.ts - publishFanoutMessage()").error(
            error
        );
    }
}
