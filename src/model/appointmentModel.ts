import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    salonId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    employeeId: mongoose.Types.ObjectId;
    serviceId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
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
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema); 