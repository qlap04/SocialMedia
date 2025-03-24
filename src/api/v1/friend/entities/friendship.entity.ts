import { IFriendship } from '../../interfaces/IEntities';

import mongoose, { Schema, Document } from 'mongoose';

const FriendshipSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    friendList: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
}, { timestamps: true });

const Friendship = mongoose.model<IFriendship>('Friendship', FriendshipSchema);
export default Friendship