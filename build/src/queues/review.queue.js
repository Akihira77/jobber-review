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
exports.ReviewQueue = void 0;
const config_1 = require("../config");
const amqplib_1 = __importDefault(require("amqplib"));
class ReviewQueue {
    constructor(ch, logger) {
        this.ch = ch;
        this.logger = logger;
    }
    createConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield amqplib_1.default.connect(`${config_1.RABBITMQ_ENDPOINT}`);
                const channel = yield connection.createChannel();
                this.closeConnection(channel, connection);
                this.logger("queues/connection.ts - createConnection()").info("ReviewService connected to RabbitMQ successfully...");
                return channel;
            }
            catch (error) {
                this.logger("queues/connection.ts - createConnection()").error(error);
                process.exit(1);
            }
        });
    }
    publishFanoutMessage(exchangeName, message, logMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.ch) {
                    this.ch = yield this.createConnection();
                }
                yield this.ch.assertExchange(exchangeName, "fanout");
                this.ch.publish(exchangeName, "", Buffer.from(message));
                this.logger("queues/review.producer.ts - publishFanoutMessage()").info(logMessage);
            }
            catch (error) {
                this.logger("queues/review.producer.ts - publishFanoutMessage()").error(error);
            }
        });
    }
    closeConnection(channel, connection) {
        process.once("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
            yield channel.close();
            yield connection.close();
        }));
    }
}
exports.ReviewQueue = ReviewQueue;
//# sourceMappingURL=review.queue.js.map