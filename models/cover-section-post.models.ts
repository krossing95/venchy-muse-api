import mongoose, { Document, Schema } from "mongoose";

export interface ICoverSectionPost extends Document {
  articleId: mongoose.Types.ObjectId;
  imageUrl: string;
  tocId: string;
  coverText: string;
  createdAt: Date;
  updatedAt: Date;
}

const CoverSectionPostSchema = new Schema<ICoverSectionPost>(
  {
    tocId: {
      type: String,
      required: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    coverText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CoverSectionPost =
  mongoose.models.CoverSectionPost ||
  mongoose.model<ICoverSectionPost>("CoverSectionPost", CoverSectionPostSchema);
