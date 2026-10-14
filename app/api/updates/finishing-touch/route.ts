import { connection } from "@/config/db.config";
import {
  FinishingTouch,
  IFinishingTouch,
} from "@/models/finishing-touch.models";
import { HeroSection, IHeroSection } from "@/models/hero-section.models";
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
    const payload: IFinishingTouch = await req.json();
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

    const finishingTouch = new FinishingTouch(payload);

    const createdFinishingTouch = await finishingTouch.save();

    return NextResponse.json(
      {
        message: "Finishing touch created successfully",
        code: "201",
        data: createdFinishingTouch,
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
