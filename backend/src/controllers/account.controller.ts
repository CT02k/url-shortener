import { RequestHandler } from "express";
import { AccountLinksQuery } from "../validators/account.validator";
import { ShortenParams } from "../validators/shorten.validator";
import { prisma } from "../lib/prisma";

export const getProfile: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json(user);
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

    if (!user) return req.unauthorized();

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
    const _user = req.user;

    res.status(501).json({
      message: `Delete link ${slug} not implemented yet`,
    });
  } catch (err) {
    next(err);
  }
};
