import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    salonId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    price: number;
    startTime: Date;
    endTime: Date;
    status: 'booked' | 'cancelled';
}

const appointmentSchema = new Schema({
    salonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    price: {
        type: Number,
        require: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['booked','cancelled'],
        default: 'booked'
    }
}, {
    timestamps: true
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema); 