import mongoose, { Schema } from "mongoose";
import { IContactRequest } from "../../interfaces/IEntities";

const ContactSchema: Schema = new Schema({
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Contact = mongoose.model<IContactRequest>('Contact', ContactSchema);

export default Contact