import mongoose, { Document, Schema } from 'mongoose';
import { IPost } from '../../interfaces/IEntities';

const postSchema = new Schema<IPost>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        media_url: { type: [String], default: [] },
        commentList: { type: [Schema.Types.ObjectId], ref: 'Comment', default: [] },
        likeList: { type: [Schema.Types.ObjectId], ref: 'User', default: [] },
    },
    { timestamps: true }
);

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;