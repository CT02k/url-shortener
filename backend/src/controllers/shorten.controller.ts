import { RequestHandler } from "express";
import getVisitorId from "../lib/hashVisitor";
import { prisma } from "../lib/prisma";
import {
  CreateShortenBody,
  ShortenParams,
} from "../validators/shorten.validator";

export const getShorten: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params as ShortenParams;

    const data = await prisma.shortenedUrl.findUnique({
      where: { slug },
    });

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const redirectShorten: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params as ShortenParams;

    const data = await prisma.shortenedUrl.findUnique({
      where: { slug },
    });

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    await prisma.shortenedUrlStats.upsert({
      where: { slug },
      create: {
        slug,
        clicks: 1,
        uniqueClicks: 0,
        lastClickAt: new Date(),
      },
      update: {
        clicks: { increment: 1 },
        lastClickAt: new Date(),
      },
    });

    const visitorId = await getVisitorId(req);

    try {
      await prisma.shortenedUrlVisitor.create({
        data: { slug, visitorId },
      });

      await prisma.shortenedUrlStats.update({
        where: { slug },
        data: { uniqueClicks: { increment: 1 } },
      });
    } catch (err) {}

    return res.redirect(data.redirect);
  } catch (err) {
    next(err);
  }
};

export const getShortenStats: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params as ShortenParams;

    const data = await prisma.shortenedUrlStats.findUnique({
      where: { slug },
    });

    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

export const createShorten: RequestHandler = async (req, res, next) => {
  try {
    const { redirect } = req.body as CreateShortenBody;

    const user = req.user;

    if (user) {
      const userData = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!userData) return req.unauthorized();

      const data = await prisma.shortenedUrl.create({
        data: {
          redirect,
          userId: userData.id,
          stats: {
            create: {},
          },
        },
      });

      return res.json(data);
    }

    const data = await prisma.shortenedUrl.create({
      data: {
        redirect,
        stats: {
          create: {},
        },
      },
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
};
