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
    // retrieve the latest article
    const latestArticle = await HeroSection.findOne<IHeroSection>({
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .exec();

    if (!latestArticle) {
      return NextResponse.json(
        {
          message: "No record found",
          code: "404",
          data: {},
        },
        { status: 404 },
      );
    }

    const articleId = latestArticle._id;

    // fetch the cover section posts
    const coverSectionPosts = await CoverSectionPost.find<ICoverSectionPost>({
      articleId,
    })
      .limit(3)
      .exec();

    const data = {
      article: latestArticle,
      coverSection: coverSectionPosts,
    };

    return NextResponse.json(
      {
        message: "",
        code: "200",
        data,
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
