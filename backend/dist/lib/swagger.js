"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOpenAPIDocument = exports.registry = void 0;
const zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
exports.registry = new zod_to_openapi_1.OpenAPIRegistry();
const generateOpenAPIDocument = () => {
    const generator = new zod_to_openapi_1.OpenApiGeneratorV3(exports.registry.definitions);
    return generator.generateDocument({
        openapi: "3.0.3",
        info: {
            title: "URL Shortener API",
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
            },
        ],
    });
};
exports.generateOpenAPIDocument = generateOpenAPIDocument;
