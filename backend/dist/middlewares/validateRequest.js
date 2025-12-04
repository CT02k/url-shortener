"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const validateRequest = (schema) => (req, res, next) => {
    try {
        if (schema.body) {
            req.body = schema.body.parse(req.body);
        }
        if (schema.params) {
            req.params = schema.params.parse(req.params);
        }
        if (schema.query) {
            req.query = schema.query.parse(req.query);
        }
        next();
    }
    catch (err) {
        if (err instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: "Validation error",
                issues: err.issues,
            });
        }
        next(err);
    }
};
exports.validateRequest = validateRequest;
