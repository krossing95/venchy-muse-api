import { connection } from "@/config/db.config";
import { HeroSection, IHeroSection } from "@/models/hero-section.models";
import {
  IRelatedArticle,
  RelatedArticle,
} from "@/models/related-article.models";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
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
    const payload: IRelatedArticle = await req.json();
    const articleData = await HeroSection.findById<IHeroSection>(
      payload.articleId,
    );

    if (!articleData) {
      return NextResponse.json(
        {
          message: "Article not found",
          code: "404",
          data: {},
        },
        { status: 404 },
      );
    }

    const relatedPost = new RelatedArticle(payload);

    const createdRelatedPost = await relatedPost.save();

    return NextResponse.json(
      {
        message: "Related article created successfully",
        code: "201",
        data: createdRelatedPost,
      },
      { status: 201 },
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
