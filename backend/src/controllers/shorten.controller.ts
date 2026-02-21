import { Prisma } from "@prisma/client";
import { RequestHandler } from "express";
import getVisitorId from "../lib/hashVisitor";
import { lookupCountryByIp } from "../lib/ipapi";
import {
  getBrowserFromUserAgent,
  getClientIp,
  getReferrer,
  getUserAgent,
} from "../lib/requestInfo";
import { prisma } from "../lib/prisma";
import {
  CreateShortenBody,
  ShortenParams,
  ShortenStatsQuery,
} from "../validators/shorten.validator";

type TimeRange = ShortenStatsQuery["range"];
type ClickWhere = Prisma.shortenedUrlClickWhereInput;

const resolveDateRange = (range?: TimeRange, from?: Date, to?: Date) => {
  if (range) {
    const now = new Date();
    switch (range) {
      case "hour":
        return { from: new Date(now.getTime() - 60 * 60 * 1000), to: now };
      case "day":
        return { from: new Date(now.getTime() - 24 * 60 * 60 * 1000), to: now };
      case "week":
        return {
          from: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          to: now,
        };
      case "month": {
        const next = new Date(now);
        const monthAgo = new Date(next.setMonth(next.getMonth() - 1));
        return { from: monthAgo, to: now };
      }
      default:
        return { from, to };
    }
  }

  return { from, to };
};

const buildClicksWhere = (
  slug: string,
  range?: TimeRange,
  from?: Date,
  to?: Date,
): ClickWhere => {
  const { from: gte, to: lte } = resolveDateRange(range, from, to);

  const clickedAt =
    gte || lte
      ? {
          ...(gte ? { gte } : {}),
          ...(lte ? { lte } : {}),
        }
      : undefined;

  return {
    slug,
    ...(clickedAt ? { clickedAt } : {}),
  };
};

export const getShorten: RequestHandler = async (req, res, next) => {
  try {
    const { slug } = req.params as ShortenParams;

    const data = await prisma.shortenedUrl.findUnique({
      where: { slug },
    });

    if (!data) {
      return res.notFound();
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
      return res.notFound();
    }

    const ip = getClientIp(req);
    const userAgent = getUserAgent(req);
    const referrer = getReferrer(req);
    const browser = getBrowserFromUserAgent(userAgent);

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
    const location = await lookupCountryByIp(ip);
    const country = location?.country ?? null;

    try {
      await prisma.shortenedUrlVisitor.create({
        data: { slug, visitorId },
      });

      await prisma.shortenedUrlStats.update({
        where: { slug },
        data: { uniqueClicks: { increment: 1 } },
      });
    } catch {}

    try {
      await prisma.shortenedUrlClick.create({
        data: {
          slug,
          visitorId,
          referrer,
          userAgent,
          browser,
          country,
          clickedAt: new Date(),
        },
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
    const { range, from, to } = req.query as ShortenStatsQuery;

    const data = await prisma.shortenedUrlStats.findUnique({
      where: { slug },
    });

    if (!data) {
      return res.notFound();
    }

    const resolvedRange = resolveDateRange(range, from, to);

    const where = buildClicksWhere(
      slug,
      range,
      resolvedRange.from,
      resolvedRange.to,
    );

    let rangedStats = null as null | {
      from: Date | null;
      to: Date | null;
      clicks: number;
      uniqueVisitors: number;
      topReferrers: { referrer: string; count: number }[];
      topBrowsers: { browser: string; count: number }[];
      topCountries: { country: string; count: number }[];
    };

    if (resolvedRange.from || resolvedRange.to) {
      const [clicks, uniqueVisitorsCount, referrers, browsers, countries] =
        await Promise.all([
          prisma.shortenedUrlClick.count({ where }),
          prisma.shortenedUrlClick
            .findMany({
              where: { ...where, visitorId: { not: null } },
              distinct: ["visitorId"],
              select: { visitorId: true },
            })
            .then((rows) => rows.length),
          prisma.shortenedUrlClick.groupBy({
            by: ["referrer"],
            where: { ...where, referrer: { not: null } },
            _count: { referrer: true },
            orderBy: { _count: { referrer: "desc" } },
            take: 5,
          }),
          prisma.shortenedUrlClick.groupBy({
            by: ["browser"],
            where: { ...where, browser: { not: null } },
            _count: { browser: true },
            orderBy: { _count: { browser: "desc" } },
            take: 5,
          }),
          prisma.shortenedUrlClick.groupBy({
            by: ["country"],
            where: { ...where, country: { not: null } },
            _count: { country: true },
            orderBy: { _count: { country: "desc" } },
            take: 5,
          }),
        ]);

      rangedStats = {
        from: resolvedRange.from ?? null,
        to: resolvedRange.to ?? null,
        clicks,
        uniqueVisitors: uniqueVisitorsCount,
        topReferrers: referrers.map((item) => ({
          referrer: item.referrer as string,
          count: (item._count?.referrer as number | undefined) ?? 0,
        })),
        topBrowsers: browsers.map((item) => ({
          browser: item.browser as string,
          count: (item._count?.browser as number | undefined) ?? 0,
        })),
        topCountries: countries.map((item) => ({
          country: item.country as string,
          count: (item._count?.country as number | undefined) ?? 0,
        })),
      };
    }

    res.json({
      slug,
      total: {
        clicks: data.clicks,
        uniqueClicks: data.uniqueClicks,
        lastClickAt: data.lastClickAt,
      },
      range: rangedStats,
    });
  } catch (err) {
    next(err);
  }
};

export const createShorten: RequestHandler = async (req, res, next) => {
  try {
    const { redirect } = req.body as CreateShortenBody;

    const ownerId = req.user?.id ?? req.apiKey?.userId;

    const userData = await prisma.user.findUnique({
      where: {
        id: ownerId,
      },
    });

    const data = await prisma.shortenedUrl.create({
      data: {
        redirect,
        userId: userData ? userData.id : undefined,
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
