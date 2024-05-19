import { logger, RABBITMQ_ENDPOINT } from "@review/config";
import client, { Connection, Channel } from "amqplib";

export async function createConnection(): Promise<Channel> {
    try {
        const connection: Connection = await client.connect(
            `${RABBITMQ_ENDPOINT}`
        );
        const channel: Channel = await connection.createChannel();
        closeConnection(channel, connection);

        logger("queues/connection.ts - createConnection()").info(
            "ReviewService connected to RabbitMQ successfully..."
        );

        return channel;
    } catch (error) {
        logger("queues/connection.ts - createConnection()").error(error);
        process.exit(1);
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
    });
}
