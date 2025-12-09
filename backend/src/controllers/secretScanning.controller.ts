import { RequestHandler } from "express";
import { GithubRequestBody } from "../lib/github";
import { prisma } from "../lib/prisma";
import { alertTypes } from "@prisma/client";

export const secretScanning: RequestHandler = async (req, res, next) => {
  const validate = await req.verifyWebhook();

  if (validate) {
    const response: GithubRequestBody = JSON.parse(req.body);

    response.forEach(async (data) => {
      const token = await prisma.apiToken.delete({
        where: {
          hash: data.token,
        },
      });

      if (token) {
        await prisma.alert.create({
          data: {
            type: alertTypes.TOKEN_LEAK,
            title: "Your API token was leaked",
            content: data.source,
            userId: token.userId,
          },
        });
      }

      return res.status(204).json();
    });
  }

  return res.unauthorized();
};
