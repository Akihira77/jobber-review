import express, { Express } from "express";
import { start } from "@review/server";
import { databaseConnection } from "@review/database";
import { winstonLogger } from "@Akihira77/jobber-shared";
import { ELASTIC_SEARCH_URL } from "@review/config";
import { Logger } from "winston";

async function initialize(): Promise<void> {
    const logger = (moduleName?: string): Logger =>
        winstonLogger(
            `${ELASTIC_SEARCH_URL}`,
            moduleName ?? "Review Service",
            "debug"
        );
    const db = await databaseConnection(logger);
    const app: Express = express();
    await start(app, db, logger);
}

initialize();
