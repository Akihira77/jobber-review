export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            ENABLE_APM: string;
            GATEWAY_JWT_TOKEN: string;
            POSTGRES_DB: string;
            JWT_TOKEN: string;
            NODE_ENV: string;
            CLIENT_URL: string;
            API_GATEWAY_URL: string;
            RABBITMQ_ENDPOINT: string;
            ELASTIC_SEARCH_URL: string;
            ELASTIC_APM_SERVER_URL: string;
            ELASTIC_APM_SECRET_TOKEN: string;
            ELASTIC_APM_SERVICE_NAME: string;
            NEW_RELIC_AI_MONITORING_ENABLED: string;
            NEW_RELIC_CUSTOM_INSIGHTS_EVENTS_MAX_SAMPLES_STORED: string;
            NEW_RELIC_SPAN_EVENTS_MAX_SAMPLES_STORED: string;
            NEW_RELIC_APP_NAME: string;
            NEW_RELIC_LICENSE_KEY: string;
        }
    }
}
