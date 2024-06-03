"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConnection = void 0;
const config_1 = require("./config");
const pg_1 = require("pg");
const createTableText = `
    CREATE TABLE IF NOT EXISTS public.reviews (
        "id" SERIAL UNIQUE,
        "gigId" TEXT NOT NULL,
        "reviewerId" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "sellerId" TEXT NOT NULL,
        "review" TEXT NOT NULL,
        "reviewerImage" TEXT NOT NULL,
        "reviewerUsername" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "reviewType" TEXT NOT NULL,
        "rating" INT DEFAULT 0 NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_DATE,
        PRIMARY KEY(id)
    );

    CREATE INDEX IF NOT EXISTS "gigId_idx" ON public.reviews ("gigId");

    CREATE INDEX IF NOT EXISTS "sellerId_idx" ON public.reviews ("sellerId");
`;
function databaseConnection(logger) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pool = new pg_1.Pool({
                host: "localhost",
                user: "jobber",
                connectionString: `${config_1.POSTGRES_DB}`,
                max: 50,
                idleTimeoutMillis: 10000 // 10 seconds
            });
            yield pool.query(createTableText);
            // await pool.end();
            return pool;
        }
        catch (error) {
            logger("database.ts - databaseConnection()").error("ReviewService PostgreSQL connection error.", error);
            process.exit(1);
        }
    });
}
exports.databaseConnection = databaseConnection;
//# sourceMappingURL=database.js.map