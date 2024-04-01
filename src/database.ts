import { POSTGRES_DB } from "@review/config";
import { Pool } from "pg";

export let pool: Pool = new Pool({
    connectionString: `${POSTGRES_DB}`
});

pool.on("error", (error: Error) => {
    console.log(error);
    process.exit(-1);
});

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

export async function databaseConnection(): Promise<void> {
    try {
        await pool.connect();
        await pool.query(createTableText);
    } catch (error) {
        console.log(error);
    }
}
