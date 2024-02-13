import { winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL } from "@review/config";
import { Channel } from "amqplib";
import { Logger } from "winston";
import { createConnection } from "@review/queues/connection";

const log: Logger = winstonLogger(
    `${ELASTIC_SEARCH_URL}`,
    "reviewServiceProducer",
    "debug"
);

export async function publishFanoutMessage(
    channel: Channel,
    exchangeName: string,
    message: string,
    logMessage: string
): Promise<void> {
    try {
        if (!channel) {
            channel = (await createConnection()) as Channel;
        }

        await channel.assertExchange(exchangeName, "fanout");

        channel.publish(exchangeName, "", Buffer.from(message));

        log.info(logMessage);
    } catch (error) {
        log.error(
            "ReviewService QueueProducer publishFanoutMessage() method error:",
            error
        );
    }
}
