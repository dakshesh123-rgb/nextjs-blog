import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  authorId?: mongoose.Types.ObjectId;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
