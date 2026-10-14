import { connection } from "@/config/db.config";
import {
  CoverSectionPost,
  ICoverSectionPost,
} from "@/models/cover-section-post.models";
import { HeroSection, IHeroSection } from "@/models/hero-section.models";
import { NextRequest, NextResponse } from "next/server";

const LIMIT = 9;

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> },
) {
  const { categoryId } = await context.params;
  // Authenticate request
  const apiKey = req.headers.get("api-key");

  if (!apiKey || apiKey !== process.env.SESSION_TOKEN) {
    return NextResponse.json(
      {
        message: "Authentication is required",
        code: "401",
        data: {},
      },
      { status: 401 },
    );
  }

  const categories: ("all" | "style-journal" | "lifestyle")[] = [
    "lifestyle",
    "all",
    "style-journal",
  ];

  const resolvedCategoryId = !categoryId
    ? "all"
    : !categories.includes(categoryId as (typeof categories)[number])
      ? "all"
      : categoryId;

  try {
    await connection();

    // Get pagination cursor
    const cursor = req.nextUrl.searchParams.get("cursor");

    const query: any = {
      isPublished: true,
      ...(resolvedCategoryId === "all" ? {} : { category: resolvedCategoryId }),
    };

    // If cursor exists, fetch articles older than it
    if (cursor) {
      const cursorDate = new Date(cursor);

      if (Number.isNaN(cursorDate.getTime())) {
        return NextResponse.json(
          {
            message: "Invalid pagination cursor",
            code: "400",
            data: {},
          },
          { status: 400 },
        );
      }

      query.createdAt = {
        $lt: cursorDate,
      };
    }

    // Fetch one extra article so we can determine
    // whether another page exists.
    const recentlyAdded = await HeroSection.find<IHeroSection>(query)
      .sort({
        createdAt: -1,
      })
      .limit(LIMIT + 1)
      .exec();

    /*
     * If we received more than LIMIT,
     * another page exists.
     */
    const hasMore = recentlyAdded.length > LIMIT;

    // Only return 9
    const articles = recentlyAdded.slice(0, LIMIT);

    const articleIds = articles.map((article) => article._id);

    // Fetch cover sections belonging to these articles
    const coverSectionPosts = await CoverSectionPost.find<ICoverSectionPost>({
      articleId: {
        $in: articleIds,
      },
    }).exec();

    const returnableArticles: {
      article: IHeroSection;
      coverSections: ICoverSectionPost[];
    }[] = [];

    for (const article of articles) {
      const coverPosts = coverSectionPosts.filter(
        (post) => post.articleId?.toString() === article._id?.toString(),
      );

      returnableArticles.push({
        article,
        coverSections: coverPosts,
      });
    }

    /*
     * The last returned article becomes the cursor
     * for the next request.
     */
    const lastArticle = articles.at(-1);

    const nextCursor = hasMore && lastArticle ? lastArticle.createdAt : null;

    return NextResponse.json(
      {
        message: "",
        code: "200",
        data: returnableArticles,
        pagination: {
          nextCursor,
          hasMore,
          limit: LIMIT,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Fetch articles error:", error);

    return NextResponse.json(
      {
        message: "Whoops! Something went wrong",
        code: "500",
        data: {},
      },
      {
        status: 500,
      },
    );
  }
}
