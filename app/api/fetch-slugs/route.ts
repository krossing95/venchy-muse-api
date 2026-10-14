import { connection } from "@/config/db.config";
import { HeroSection } from "@/models/hero-section.models";
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
  try {
    await connection();

    const articles = await HeroSection.find<{ slug: string }>().select({
      slug: 1,
    });

    const slugs = articles.map((a) => a.slug);

    return NextResponse.json(
      {
        message: "",
        code: "200",
        data: { slugs },
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
