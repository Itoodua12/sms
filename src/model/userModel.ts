import mongoose, { Document } from "mongoose";

interface IUser extends Document {
    firstName: string;
    lastName: string;
    password: string;
    role: "manager" | "customer";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ["manager", "customer"]
    },
},{
    timestamps: true
});

export default mongoose.model<IUser>("User", userSchema);