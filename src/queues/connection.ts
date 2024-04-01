import {  RABBITMQ_ENDPOINT } from "@review/config";
import client, { Connection, Channel } from "amqplib";

export async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(
            `${RABBITMQ_ENDPOINT}`
        );
        const channel: Channel = await connection.createChannel();
        closeConnection(channel, connection);

        return channel;
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
    });
}
