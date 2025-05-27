import mongoose, { Schema } from 'mongoose';
import { IComment } from '../../interfaces/IEntities';

const CommentSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;