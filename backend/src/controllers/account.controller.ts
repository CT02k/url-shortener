import { RequestHandler } from "express";
import { AccountLinksQuery } from "../validators/account.validator";
import { ShortenParams } from "../validators/shorten.validator";
import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) return res.unauthorized();

    const { id } = user;

    const userData = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
      },
    });

    res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
};

export const listMyLinks: RequestHandler = async (req, res, next) => {
  try {
    const query = req.query as any as AccountLinksQuery;

    const { page, limit } = {
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    };

    const user = req.user;

    if (!user) return res.unauthorized();

    const list = await prisma.shortenedUrl.findMany({
      where: {
        userId: user.id,
      },
      select: {
        slug: true,
        redirect: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const listCount = await prisma.shortenedUrl.count();

    const total = listCount;
    const totalPages = Math.floor(listCount / limit);

    res.status(200).json({ list, page, total, totalPages, limit });
  } catch (err) {
    next(err);
  }
};

export const deleteMyLink: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params as ShortenParams;
    const user = req.user;

    if (!user) return res.unauthorized();

    try {
      await prisma.shortenedUrl.delete({
        where: {
          slug,
        },
      });

      return res.status(204).json();
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          return res.notFound();
        }
      }
      next(err);
    }
  } catch (err) {
    next(err);
  }
};
