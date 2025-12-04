"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shortenRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../lib/prisma");
const swagger_1 = require("../lib/swagger");
const validateRequest_1 = require("../middlewares/validateRequest");
const zod_1 = require("../lib/zod");
exports.shortenRouter = (0, express_1.Router)();
const ShortenedUrlSchema = zod_1.z.object({
    slug: zod_1.z.string(),
    redirect: zod_1.z.string().url(),
});
const CreateShortenBodySchema = zod_1.z.object({
    redirect: zod_1.z.string().url(),
});
const ShortenParamsSchema = zod_1.z.object({
    slug: zod_1.z.string(),
});
swagger_1.registry.register("ShortenedUrl", ShortenedUrlSchema);
swagger_1.registry.registerPath({
    method: "get",
    path: "/shorten/{slug}",
    summary: "Get shorten URL data by slug",
    tags: ["Shortener"],
    request: {
        params: ShortenParamsSchema,
    },
    responses: {
        200: {
            description: "URL Data",
            content: {
                "application/json": {
                    schema: ShortenedUrlSchema,
                },
            },
        },
        404: {
            description: "Not found",
        },
    },
});
swagger_1.registry.registerPath({
    method: "post",
    path: "/shorten",
    summary: "Create a new shortened URL",
    tags: ["Shortener"],
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreateShortenBodySchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: "Shortened URL created",
            content: {
                "application/json": {
                    schema: ShortenedUrlSchema,
                },
            },
        },
        400: {
            description: "Missing or invalid redirect",
        },
    },
});
exports.shortenRouter.get("/:slug", (0, validateRequest_1.validateRequest)({ params: ShortenParamsSchema }), async (req, res, next) => {
    try {
        const { slug } = req.params;
        const data = await prisma_1.prisma.shortenedUrl.findUnique({
            where: {
                slug: slug,
            },
        });
        if (!data) {
            return res.status(404).json({
                message: "Not found",
            });
        }
        res.json(data);
    }
    catch (err) {
        next(err);
    }
});
exports.shortenRouter.post("/", (0, validateRequest_1.validateRequest)({ body: CreateShortenBodySchema }), async (req, res, next) => {
    try {
        const { redirect } = req.body;
        const data = await prisma_1.prisma.shortenedUrl.create({
            data: {
                redirect,
            },
        });
        res.json(data);
    }
    catch (err) {
        next(err);
    }
});
