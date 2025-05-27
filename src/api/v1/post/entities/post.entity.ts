import mongoose, { Schema } from 'mongoose';
import { IPost } from '../../interfaces/IEntities';

const PostSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
        media: [{ type: String }], 
        status: { type: String, enum: ['private', 'friends', 'public'], default: 'public' }, 
        likesCount: { type: Number, default: 0 },
        commentsCount: { type: Number, default: 0 }, 
    },
    { timestamps: true }
);

PostSchema.index({ userId: 1, createdAt: -1 }); // Index để tối ưu truy vấn theo user và thời gian

const Post = mongoose.model<IPost>('Post', PostSchema);
export default Post;