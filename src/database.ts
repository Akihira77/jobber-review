import { POSTGRES_DB } from "@review/config";
import { Pool } from "pg";
import { Logger } from "winston";

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

export async function databaseConnection(
    logger: (moduleName: string) => Logger
): Promise<Pool> {
    try {
        const pool: Pool = new Pool({
            host: "localhost",
            user: "jobber",
            connectionString: `${POSTGRES_DB}`,
            max: 50,
            idleTimeoutMillis: 10_000 // 10 seconds
        });

        await pool.query(createTableText);

        // await pool.end();
        return pool;
    } catch (error) {
        logger("database.ts - databaseConnection()").error(
            "ReviewService PostgreSQL connection error.",
            error
        );

        process.exit(1);
    }
}
