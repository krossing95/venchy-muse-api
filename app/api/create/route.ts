import { connection } from "@/config/db.config";
import { StringUtil } from "@/helpers/string.helpers";
import { HeroSection, IHeroSection } from "@/models/hero-section.models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
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
    const payload: IHeroSection = await req.json();

    const title = `${payload.postTitle.title} ${payload.postTitle.decoratedTitle}`;

    const slug = StringUtil.slugify(title);

    const newArticle = new HeroSection({
      ...payload,
      slug,
    });
    const createArticle = await newArticle.save();

    return NextResponse.json(
      {
        message: "Article created successfully",
        code: "201",
        data: createArticle,
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
