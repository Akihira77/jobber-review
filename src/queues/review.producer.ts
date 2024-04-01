import { Channel } from "amqplib";
import { createConnection } from "@review/queues/connection";

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
        console.log(logMessage);
    } catch (error) {
        console.log(error);
    }
}
