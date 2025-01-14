import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
    salonId: mongoose.Types.ObjectId;
    name: string;
    position: string;
    phone: string;
    schedule?: { [key: string]: string };
    services: {
        serviceId: mongoose.Types.ObjectId;
        duration: number;
        price: number;
    }[];
}

const employeeSchema = new Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    schedule: {
        type: Map,
        of: String
    },
    services: [{
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    phone: {
        type: String,
        required: true,
        unique: true
    }
});

employeeSchema.index({ salonId: 1 });

export default mongoose.model<IEmployee>('Employee', employeeSchema); 