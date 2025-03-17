import mongoose, { Schema } from "mongoose";
import { IRole } from "../../interfaces/IEntities";

const roleSchema = new Schema({
    roleId: {
        type: Number,
        require: false,
        unique: true,
    },
    roleName: {
        type: String,
        unique: true
    }
})
const Role = mongoose.model<IRole>('Role', roleSchema);
export default Role