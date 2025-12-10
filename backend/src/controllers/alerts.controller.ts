import { RequestHandler } from "express";
import { prisma } from "../lib/prisma";

export const listAlerts: RequestHandler = async (req, res) => {
  const ownerId = req.user?.id;

  if (!ownerId) return res.unauthorized();

  const list = await prisma.alert.findMany({
    where: {
      userId: ownerId,
    },
  });

  return res.json(list);
};

export const deleteAlert: RequestHandler = async (req, res) => {
  const ownerId = req.user?.id;

  if (!ownerId) return res.unauthorized();

  const { alertId } = req.params;

  await prisma.alert.delete({
    where: {
      id: alertId,
      userId: ownerId,
    },
  });

  return res.status(204).json();
};
