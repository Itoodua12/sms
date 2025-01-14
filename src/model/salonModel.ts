import mongoose, { Schema, Document } from 'mongoose';

export interface ISalon extends Document {
    name: string;
    address: string;
    location: {
        type: string;
        coordinates: number[];
    };
    userId: mongoose.Types.ObjectId;
    phone: string;
    description?: string;
    coverImage?: string;
    openingHours: { [key: string]: string };
    employees: mongoose.Types.ObjectId[];
    services: mongoose.Types.ObjectId[];
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
            default: 'Point',
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
    description: String,
    coverImage: String,
    openingHours: {
        type: Map,
        of: String
    },
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

salonSchema.index({ location: '2dsphere' });

export default mongoose.model<ISalon>('Salon', salonSchema);