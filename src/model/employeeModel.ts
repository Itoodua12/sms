import mongoose, { Schema, Document } from 'mongoose';

interface IEmployeeService {
    serviceId: mongoose.Types.ObjectId;
    duration: number;
    price: number;
}

export interface IEmployee extends Document {
    salonId: mongoose.Types.ObjectId;
    name: string;
    position: string;
    services: IEmployeeService[];
    schedule?: {
        [key: string]: string;  // day: working hours
    };
}

const employeeServiceSchema = new Schema({
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
});

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
    services: [employeeServiceSchema],
    schedule: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
}); 

export default mongoose.model<IEmployee>('Employee', employeeSchema); 