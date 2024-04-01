import express, { Express } from "express";
import { start } from "@review/server";
import { databaseConnection } from "@review/database";

export const app: Express = express();
databaseConnection();
start(app);
