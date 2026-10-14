import mongoose, { Document, Schema } from "mongoose";

export interface IFinalThought extends Document {
  articleId: mongoose.Types.ObjectId;
  eyebrow: string;
  thoughtHeader: string;
  texts: string[];
  decoratedContent: {
    strongText: string;
    elaboratedText: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FinalThoughtSchema = new Schema<IFinalThought>(
  {
    articleId: {
      type: Schema.Types.ObjectId,
      ref: "HeroSection",
      required: true,
      index: true,
    },
    eyebrow: {
      type: String,
      required: true,
    },
    thoughtHeader: {
      type: String,
      required: true,
    },
    texts: {
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
  },
  {
    timestamps: true,
  },
);

export const FinalThought =
  mongoose.models.FinalThought ||
  mongoose.model<IFinalThought>("FinalThought", FinalThoughtSchema);
