"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingRouter = void 0;
const express_1 = require("express");
const ping_controller_1 = require("../controllers/ping.controller");
const ping_docs_1 = require("../docs/ping.docs");
exports.pingRouter = (0, express_1.Router)();
(0, ping_docs_1.registerPingDocs)();
exports.pingRouter.get("/", ping_controller_1.ping);
