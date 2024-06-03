import { start } from "@review/server";
import { databaseConnection } from "@review/database";
import { winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL } from "@review/config";
import { Logger } from "winston";
import { Hono } from "hono";

async function main(): Promise<void> {
    const logger = (moduleName?: string): Logger =>
        winstonLogger(
            `${ELASTIC_SEARCH_URL}`,
            moduleName ?? "Review Service",
            "debug"
        );

    try {
        const pool = await databaseConnection(logger);
        logger("app.ts - main()").info(
            "ReviewService PostgreSQL DB is connected"
        );

        const app = new Hono();
        await start(app, pool, logger);
    } catch (error) {
        logger("app.ts - main()").error(error);
        process.exit(1);
    }
}

main();
