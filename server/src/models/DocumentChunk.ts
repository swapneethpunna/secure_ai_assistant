import mongoose, { Document as MongoDocument } from "mongoose";

export interface IDocumentChunk extends MongoDocument {
  documentId: mongoose.Types.ObjectId;
  chunkText: string;
  chunkIndex: number;
  embedding?: number[];
}

const documentChunkSchema = new mongoose.Schema<IDocumentChunk>(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    chunkText: {
      type: String,
      required: true,
    },
    chunkIndex: {
      type: Number,
      required: true,
    },

    embedding: {
      type: [Number],
      default: null,
    },
  },
  { timestamps: true }
);

documentChunkSchema.index({ documentId: 1, chunkIndex: 1 });

export default mongoose.model<IDocumentChunk>("DocumentChunk", documentChunkSchema);