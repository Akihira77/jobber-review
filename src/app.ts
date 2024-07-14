import { start } from "@review/server"
import { databaseConnection } from "@review/database"
import { winstonLogger } from "@Akihira77/jobber-shared"
import { ELASTIC_SEARCH_URL } from "@review/config"
import { Logger } from "winston"
import { Hono } from "hono"

// import os from "node:os"
// import cluster from "node:cluster"
import { EventEmitter } from "events"

EventEmitter.setMaxListeners(20)

process.once("SIGINT", () => {
    process.exit(1)
})

process.once("SIGTERM", () => {
    process.exit(1)
})

async function main(): Promise<void> {
    const logger = (moduleName?: string): Logger =>
        winstonLogger(
            `${ELASTIC_SEARCH_URL}`,
            moduleName ?? "Review Service",
            "debug"
        )

    try {
        const pool = await databaseConnection()
        logger("app.ts - main()").info(
            "ReviewService PostgreSQL DB is connected"
        )

        const app = new Hono()
        start(app, pool, logger)
    } catch (error) {
        logger("app.ts - main()").error(error)
        process.exit(1)
    }
}

// const numCPUs = os.availableParallelism()

// if (cluster.isPrimary) {
//     for (let i = 0; i < numCPUs; i++) {
//         cluster.fork()
//     }

//     cluster.on("exit", (worker, code: number, signal: string) => {
//         console.log(
//             `worker process ${worker.process.pid} died, Restarting...`,
//             code,
//             signal
//         )
//         cluster.fork()
//     })
// } else {
//     main()
// }

main()
