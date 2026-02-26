import { prisma } from "../../lib/prisma";

type TrackAnalyticsInput = {
  slug: string;
  visitorId: string;
  referrer: string;
  userAgent: string;
  browser: string;
  country: string | null;
};

export const trackAnalytics = async (
  input: TrackAnalyticsInput,
): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    await tx.shortenedUrlStats.upsert({
      where: { slug: input.slug },
      create: {
        slug: input.slug,
        clicks: 1,
        uniqueClicks: 0,
        lastClickAt: new Date(),
      },
      update: {
        clicks: { increment: 1 },
        lastClickAt: new Date(),
      },
    });

    const uniqueInsert = await tx.shortenedUrlVisitor.createMany({
      data: [
        {
          slug: input.slug,
          visitorId: input.visitorId,
        },
      ],
      skipDuplicates: true,
    });

    if (uniqueInsert.count === 1) {
      await tx.shortenedUrlStats.update({
        where: { slug: input.slug },
        data: { uniqueClicks: { increment: 1 } },
      });
    }

    await tx.shortenedUrlClick.create({
      data: {
        slug: input.slug,
        visitorId: input.visitorId,
        referrer: input.referrer,
        userAgent: input.userAgent,
        browser: input.browser,
        country: input.country,
        clickedAt: new Date(),
      },
    });
  });
};
