"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.exchangeNamesAndRoutingKeys = exports.ENABLE_APM = exports.ELASTIC_APM_USE_PATH_AS_TRANSACTION_NAME = exports.ELASTIC_APM_SERVICE_NAME = exports.ELASTIC_APM_SERVER_URL = exports.ELASTIC_APM_SECRET_TOKEN = exports.POSTGRES_DB = exports.RABBITMQ_ENDPOINT = exports.NODE_ENV = exports.JWT_TOKEN = exports.API_GATEWAY_URL = exports.GATEWAY_JWT_TOKEN = exports.ELASTIC_SEARCH_URL = exports.CLIENT_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV !== "production") {
    dotenv_1.default.config({ path: "./.env" });
}
else {
    dotenv_1.default.config();
}
_a = process.env, exports.PORT = _a.PORT, exports.CLIENT_URL = _a.CLIENT_URL, exports.ELASTIC_SEARCH_URL = _a.ELASTIC_SEARCH_URL, exports.GATEWAY_JWT_TOKEN = _a.GATEWAY_JWT_TOKEN, exports.API_GATEWAY_URL = _a.API_GATEWAY_URL, exports.JWT_TOKEN = _a.JWT_TOKEN, exports.NODE_ENV = _a.NODE_ENV, exports.RABBITMQ_ENDPOINT = _a.RABBITMQ_ENDPOINT, exports.POSTGRES_DB = _a.POSTGRES_DB, exports.ELASTIC_APM_SECRET_TOKEN = _a.ELASTIC_APM_SECRET_TOKEN, exports.ELASTIC_APM_SERVER_URL = _a.ELASTIC_APM_SERVER_URL, exports.ELASTIC_APM_SERVICE_NAME = _a.ELASTIC_APM_SERVICE_NAME, exports.ELASTIC_APM_USE_PATH_AS_TRANSACTION_NAME = _a.ELASTIC_APM_USE_PATH_AS_TRANSACTION_NAME, exports.ENABLE_APM = _a.ENABLE_APM;
// if (NODE_ENV === "production" && ENABLE_APM == "1") {
//     require("elastic-apm-node").start({
//         serviceName: `${ELASTIC_APM_SERVICE_NAME}`,
//         serverUrl: ELASTIC_APM_SERVER_URL,
//         secretToken: ELASTIC_APM_SECRET_TOKEN,
//         enironment: NODE_ENV,
//         active: true,
//         captureBody: "all",
//         errorOnAbortedRequests: true,
//         captureErrorLogStackTraces: "always"
//     });
// }
exports.exchangeNamesAndRoutingKeys = {
    notificationService: {
        email: {
            exchangeName: "jobber-email-notification",
            routingKey: "auth-email"
        },
        order: {
            exchangeName: "jobber-order-notification",
            routingKey: "order-email"
        }
    },
    buyerService: {
        buyer: {
            exchangeName: "jobber-buyer-update",
            routingKey: "user-buyer"
        },
        seller: {
            exchangeName: "jobber-seller-update",
            routingKey: "user-seller"
        }
    },
    reviewService: {
        review: {
            exchangeName: "jobber-review"
        }
    },
    gigService: {
        updateGig: {
            exchangeName: "jobber-update-gig",
            routingKey: "update-gig"
        },
        getSellers: {
            exchangeName: "jobber-gig",
            routingKey: "get-sellers"
        },
        seed: {
            exchangeName: "jobber-seed-gig",
            routingKey: "receive-sellers"
        }
    }
};
//# sourceMappingURL=config.js.map