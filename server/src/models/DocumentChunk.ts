import mongoose, { Document as MongoDocument } from "mongoose";

export interface IDocumentChunk extends MongoDocument {
  documentId: mongoose.Types.ObjectId;
  chunkText: string;
  chunkIndex: number;
}

const documentChunkSchema = new mongoose.Schema<IDocumentChunk>(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    chunkText: {
      type: String,
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IDocumentChunk>(
  "DocumentChunk",
  documentChunkSchema
);