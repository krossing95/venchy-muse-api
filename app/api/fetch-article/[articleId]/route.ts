import { connection } from "@/config/db.config";
import {
  ArticleIntroduction,
  IArticleIntroduction,
} from "@/models/article-introduction.models";
import {
  CoverSectionPost,
  ICoverSectionPost,
} from "@/models/cover-section-post.models";
import { FinalThought, IFinalThought } from "@/models/final-thought.models";
import {
  FinishingTouch,
  IFinishingTouch,
} from "@/models/finishing-touch.models";
import { HeroSection, IHeroSection } from "@/models/hero-section.models";
import { IPostPiece, PostPiece } from "@/models/post-piece.models";
import {
  IRelatedArticle,
  RelatedArticle,
} from "@/models/related-article.models";
import { ITableOfContent, TableOfContent } from "@/models/toc.models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ articleId: string }> },
) {
  const { articleId } = await context.params;
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

  try {
    await connection();

    const articleData = await HeroSection.findOne<IHeroSection>({
      slug: articleId,
      isPublished: true,
    });

    if (!articleData) {
      return NextResponse.json(
        {
          message: "Article not found",
          code: "404",
          data: {},
        },
        {
          status: 404,
        },
      );
    }

    // Fetch cover sections belonging to the article
    const coverSectionPosts = await CoverSectionPost.find<ICoverSectionPost>({
      articleId: articleData._id,
    }).exec();

    // Fetch article introduction
    const articleIntroduction =
      await ArticleIntroduction.findOne<IArticleIntroduction>({
        articleId: articleData._id,
      });
    // Fetch final thought
    const finalThought = await FinalThought.findOne<IFinalThought>({
      articleId: articleData._id,
    });
    // Fetch finishing touch
    const finishingTouch = await FinishingTouch.findOne<IFinishingTouch>({
      articleId: articleData._id,
    });
    // Fetch post pieces
    const postPieces = await PostPiece.find<IPostPiece>({
      articleId: articleData._id,
    });
    // Fetch related article
    const relatedArticle = await RelatedArticle.findOne<IRelatedArticle>({
      articleId: articleData._id,
    });
    // Fetch table of content
    const toc = await TableOfContent.findOne<ITableOfContent>({
      articleId: articleData._id,
    });

    const data = {
      articleData,
      coverSectionPosts,
      articleIntroduction,
      finalThought,
      finishingTouch,
      postPieces,
      relatedArticle,
      toc,
    };

    return NextResponse.json(
      {
        message: "",
        code: "200",
        data,
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
