import mongoose, { Document, Schema } from "mongoose";

export interface IRelatedArticle extends Document {
  articleId: mongoose.Types.ObjectId;
  url: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const RelatedArticleSchema = new Schema<IRelatedArticle>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const RelatedArticle =
  mongoose.models.RelatedArticle ||
  mongoose.model<IRelatedArticle>("RelatedArticle", RelatedArticleSchema);
