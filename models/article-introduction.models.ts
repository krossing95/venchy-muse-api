import mongoose, { Document, Schema } from "mongoose";

export interface IArticleIntroduction extends Document {
  articleId: mongoose.Types.ObjectId;
  eyebrowText: string;
  introLead: string;
  subTexts: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleIntroductionSchema = new Schema<IArticleIntroduction>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    eyebrowText: {
      type: String,
      required: true,
    },
    introLead: {
      type: String,
      required: true,
    },
    subTexts: {
      type: [String],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const ArticleIntroduction =
  mongoose.models.ArticleIntroduction ||
  mongoose.model<IArticleIntroduction>(
    "ArticleIntroduction",
    ArticleIntroductionSchema,
  );
