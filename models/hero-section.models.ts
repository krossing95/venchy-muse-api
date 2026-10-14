import { PostCategoryEnum } from "@/enum";
import mongoose, { Document, Schema } from "mongoose";

export interface IHeroSection extends Document {
  slug: string;
  category: PostCategoryEnum;
  isPublished: boolean;
  postTitle: {
    title: string;
    decoratedTitle: string;
    subTitle: string;
    brokenSubTitle: string;
  };
  readTime: number;
  coverCaption?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSectionSchema = new Schema<IHeroSection>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: PostCategoryEnum,
      required: true,
    },
    postTitle: {
      title: { type: String, required: true },
      decoratedTitle: { type: String, required: true },
      subTitle: { type: String, required: true },
      brokenSubTitle: { type: String, required: true },
    },
    readTime: {
      type: Number,
      required: true,
    },
    coverCaption: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const HeroSection =
  mongoose.models.HeroSection ||
  mongoose.model<IHeroSection>("HeroSection", HeroSectionSchema);
