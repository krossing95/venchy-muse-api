import mongoose, { Document, Schema } from "mongoose";

export type TOC = {
  tocId: string;
  toc: string;
};

export interface ITableOfContent extends Document {
  articleId: mongoose.Types.ObjectId;
  tocs: TOC[];
  createdAt: Date;
  updatedAt: Date;
}

const TableOfContentSchema = new Schema<ITableOfContent>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    tocs: {
      type: [
        {
          tocId: String,
          toc: String,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const TableOfContent =
  mongoose.models.TableOfContent ||
  mongoose.model<ITableOfContent>("TableOfContent", TableOfContentSchema);
