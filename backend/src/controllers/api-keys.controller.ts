import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";
import { createApiToken } from "../lib/tokens";
import { CreateApiKeyBody } from "../validators/api-keys.validator";

export const listApiKeys: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) return res.unauthorized();

  const apiKeys = await prisma.apiToken.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      name: true,
      scopes: true,
      createdAt: true,
    },
  });

  return res.status(200).json({ apiKeys });
};

export const createApiKey: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) return res.unauthorized();

  const { name, scopes } = req.body as CreateApiKeyBody;

  const data = await createApiToken(user.id, name, scopes);

  return res.status(201).json(data);
};

export const deleteApiKey: RequestHandler = async (req, res) => {
  const user = req.user;

  if (!user) return res.unauthorized();

  const { id } = req.params;

  await prisma.apiToken.delete({
    where: {
      userId: user.id,
      id,
    },
  });

  return res.status(204).json();
};
