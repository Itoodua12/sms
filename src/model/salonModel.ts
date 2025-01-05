import mongoose, { Schema, Document } from 'mongoose';

interface ILocation {
    type: string;
    coordinates: number[];
}

interface IOpeningHours {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
}

export interface ISalon extends Document {
    name: string;
    address: string;
    location: ILocation;
    phone: string;
    description?: string;
    coverImage: string;
    openingHours: IOpeningHours;
    createdAt: Date;
    updatedAt: Date;
}

const salonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    phone: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    coverImage: {
        type: String,
        required: true
    },
    openingHours: {
        monday: { type: String, required: true },    // Format: "09:00-18:00"
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday: { type: String, required: true },
        friday: { type: String, required: true },
        saturday: { type: String, required: true },
        sunday: { type: String, required: true }
    }
}, {
    timestamps: true
});

salonSchema.index({ location: '2dsphere' });

export default mongoose.model<ISalon>('Salon', salonSchema);