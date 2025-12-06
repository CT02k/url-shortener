"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const discord_1 = __importDefault(require("../lib/discord"));
const errorHandler = (err, _req, res, _next) => {
    const alert = new discord_1.default();
    console.error(err);
    alert.sendAlert(err);
    res.status(500).json({
        message: "Internal server error",
    });
};
exports.errorHandler = errorHandler;
