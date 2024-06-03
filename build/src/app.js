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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("newrelic");
const express_1 = __importDefault(require("express"));
const server_1 = require("./server");
const database_1 = require("./database");
const jobber_shared_1 = require("@Akihira77/jobber-shared");
const config_1 = require("./config");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const logger = (moduleName) => (0, jobber_shared_1.winstonLogger)(`${config_1.ELASTIC_SEARCH_URL}`, moduleName !== null && moduleName !== void 0 ? moduleName : "Review Service", "debug");
        try {
            const pool = yield (0, database_1.databaseConnection)(logger);
            logger("app.ts - main()").info("ReviewService PostgreSQL DB is connected");
            const app = (0, express_1.default)();
            yield (0, server_1.start)(app, pool, logger);
        }
        catch (error) {
            logger("app.ts - main()").error(error);
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=app.js.map