import { connection } from "@/config/db.config";
import {
  CoverSectionPost,
  ICoverSectionPost,
} from "@/models/cover-section-post.models";
import { HeroSection, IHeroSection } from "@/models/hero-section.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("api-key");
  if (!apiKey) {
    return NextResponse.json(
      {
        message: "Authentication is required",
        code: "401",
        data: {},
      },
      { status: 401 },
    );
  }

  if (apiKey !== process.env.SESSION_TOKEN) {
    return NextResponse.json(
      {
        message: "Authentication is required",
        code: "401",
        data: {},
      },
      { status: 401 },
    );
  }

  await connection();

  try {
    const recentlyAdded = await HeroSection.find<IHeroSection>({
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(9)
      .exec();

    const articleIds = recentlyAdded.map((article) => article._id);

    // fetch the cover section posts
    const coverSectionPosts = await CoverSectionPost.find<ICoverSectionPost>({
      articleId: { $in: articleIds },
    });

    const returnableArticles: {
      article: IHeroSection;
      coverSections: ICoverSectionPost[];
    }[] = [];

    for (const article of recentlyAdded) {
      const coverPosts = coverSectionPosts.filter(
        (post) => post.articleId?.toString() === article._id?.toString(),
      );

      returnableArticles.push({
        article,
        coverSections: coverPosts,
      });
    }

    return NextResponse.json(
      {
        message: "",
        code: "200",
        data: returnableArticles,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Whoops! Something went wrong",
        code: "500",
        data: {},
      },
      { status: 500 },
    );
  }
}
