import mongoose, { Document, Schema } from "mongoose";

export interface IPostPiece extends Document {
  articleId: mongoose.Types.ObjectId;
  title: string;
  tocId: string;
  imageUrl: string;
  contentTexts: string[];
  decoratedContent: {
    strongText: string;
    elaboratedText: string;
  };
  subIndexText: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostPieceSchema = new Schema<IPostPiece>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    tocId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    contentTexts: {
      type: [String],
      required: true,
      default: [],
    },
    decoratedContent: {
      strongText: {
        type: String,
        required: true,
      },
      elaboratedText: {
        type: String,
        required: true,
      },
    },
    subIndexText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PostPiece =
  mongoose.models.PostPiece ||
  mongoose.model<IPostPiece>("PostPiece", PostPieceSchema);
