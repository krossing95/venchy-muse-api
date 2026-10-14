import mongoose, { Document, Schema } from "mongoose";

export interface IFinishingTouch extends Document {
  articleId: mongoose.Types.ObjectId;
  title: string;
  introdutoryText: string;
  categorizedTexts: {
    header: string;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FinishingTouchSchema = new Schema<IFinishingTouch>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    introdutoryText: {
      type: String,
      required: true,
    },
    categorizedTexts: [
      {
        header: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const FinishingTouch =
  mongoose.models.FinishingTouch ||
  mongoose.model<IFinishingTouch>("FinishingTouch", FinishingTouchSchema);
