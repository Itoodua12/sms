import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    salonId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
    category?: string;
}

const serviceSchema = new Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    category: String
}, {
    timestamps: true
});

export default mongoose.model<IService>('Service', serviceSchema); 