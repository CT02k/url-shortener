import { RequestHandler } from "express";
import { GithubRequestBody, verifyWebhook } from "../lib/github";
import { prisma } from "../lib/prisma";
import { alertTypes } from "@prisma/client";

export const secretScanning: RequestHandler = async (req, res, next) => {
  const validate = await verifyWebhook(
    req.body,
    req.headers["github-public-key-signature"]?.toString() ?? "",
    req.headers["github-public-key-identifier"]?.toString() ?? "",
  );

  if (validate) {
    const response: GithubRequestBody = JSON.parse(req.body);

    response.forEach(async (data) => {
      const token = await prisma.apiToken.findUnique({
        where: {
          hash: data.token,
        },
      });

      if (token) {
        await prisma.apiToken.delete({
          where: {
            id: token.id,
          },
        });

        await prisma.alert.create({
          data: {
            type: alertTypes.TOKEN_LEAK,
            title: "Your token has been compromised",
            content: data.source,
            userId: token.userId,
          },
        });
      }

      return res.status(204).json();
    });
  } else {
    return res.unauthorized();
  }
};
