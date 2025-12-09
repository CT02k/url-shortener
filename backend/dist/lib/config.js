"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const required = (value, name) => {
    if (!value) {
        throw new Error(`❌ Missing "${name}" env variable.`);
    }
    return value;
};
exports.env = {
    NODE_ENV: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development",
    PORT: Number((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 3000),
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    GITHUB_SEARCH_TOKEN: process.env.GITHUB_SEARCH_TOKEN,
    JWT_SECRET: required(process.env.JWT_SECRET, "JWT_SECRET"),
    HMAC_SECRET: required(process.env.HMAC_SECRET, "HMAC_SECRET"),
    DATABASE_URL: required(process.env.DATABASE_URL, "DATABASE_URL"),
};
