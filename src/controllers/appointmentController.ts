import { RequestHandler } from 'express';
import Appointment from '../model/appointmentModel';
import Employee, { IEmployee } from '../model/employeeModel';
import { BookAppointmentDto } from '../dtos/appointment';

const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const bookAppointment: RequestHandler<{salonId: string}, {}, BookAppointmentDto> = async (req, res) => {
    try {
        const { employeeId, serviceId, salonId, startTime } = req.body;
        const userId = req.user.id;
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            res.status(404).json({ message: "Employee not found" });
            return;
        } 

        const employeeService = employee.services.find(
            s => s.serviceId.toString() === serviceId
        );

        if (!employeeService) {
            res.status(400).json({ message: "Employee doesn't provide this service" });
            return;
        }
        
        const requestedStart = new Date(startTime);
        console.log(requestedStart);
        const requestedEnd = new Date(requestedStart.getTime() + employeeService.duration * 60000);

        const workingHoursCheck = await isEmployeeWorkingOnDate(employee, requestedStart);
        if (!workingHoursCheck.isWorking) {
            res.status(409).json({ message: workingHoursCheck.reason });
            return;
        }

        const availabilityCheck = await isReservedAppointment(employee, requestedStart, requestedEnd);
        if (!availabilityCheck.isAvailable) {
            res.status(409).json({ message: availabilityCheck.reason });
            return;
        }

        const appointment = new Appointment({
            salonId,
            userId,
            employeeId,
            serviceId,
            price: employeeService.price,
            startTime: requestedStart,
            endTime: requestedEnd,
            status: 'booked'
        });

        await appointment.save();

        res.status(201).json({
            message: "Appointment created successfully",
            appointmentId: appointment._id,
            startTime: requestedStart,
            endTime: requestedEnd
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating appointment" });
    }
};

const isEmployeeWorkingOnDate = (employee: IEmployee, date: Date): any => {
    const dayOfWeek = days[date.getDay()];

    const scheduleObj = employee.schedule instanceof Map ? 
        Object.fromEntries(employee.schedule) : 
        employee.schedule;

    if (!scheduleObj || !scheduleObj[dayOfWeek]) {
        return {
            isWorking: false,
            reason: `User does not work on ${dayOfWeek}`
        };
    }
    /* 
        todo : Check
        If an employee is absent, 
        the reason could be a public holiday, sick leave, day off, or vacation.
    */
    const schedule = scheduleObj[dayOfWeek];
    
    const [startTime, endTime] = schedule.split('-');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const appointmentHour = date.getHours();
    const appointmentMinute = date.getMinutes();

    const appointmentTime = appointmentHour * 60 + appointmentMinute;
    const workStartTime = startHour * 60 + startMinute;
    const workEndTime = endHour * 60 + endMinute;

    if (appointmentTime < workStartTime || appointmentTime > workEndTime) {
        return {
            isWorking: false,
            reason: `Employee's working ours : ${startTime} to ${endTime}`
        };
    }

    return {
        isWorking: true
    };
};

const isReservedAppointment = async (employee: IEmployee, startDate: Date, endDate: Date): Promise<any> => {
    const employeeAppointments = await Appointment.find({
        employeeId: employee._id,
        status: { $ne: 'cancelled' }
    });

    for (const appointment of employeeAppointments) {
        const existingStart = appointment.startTime;
        const existingEnd = appointment.endTime;

        if ((startDate >= existingStart && startDate < existingEnd)
        || (endDate > existingStart && endDate <= existingEnd)
        || (startDate <= existingStart && endDate >= existingEnd)) {
            return {
                isAvailable: false,
                reason: `Employee has another appointment from ${existingStart.toLocaleTimeString()} to ${existingEnd.toLocaleTimeString()}`
            };
        }
    }

    return {
        isAvailable: true
    };
};

export const cancelAppointment: RequestHandler<{ appointmentId: string }> = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;

        const appointment = await Appointment.findById(appointmentId);
        
        if (!appointment) {
            res.status(404).json({ message: "Appointment not found" });
            return;
        }

        if (appointment.userId.toString() !== userId) {
            res.status(403).json({ message: "Not authorized to cancel this appointment" });
            return;
        }

        if (appointment.status === 'cancelled') {
            res.status(400).json({ message: "Appointment is already cancelled" });
            return;
        }

        const now = new Date();
        const hoursDifference = (appointment.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        
        if (hoursDifference < 4) {
            res.status(400).json({ 
                message: "Cannot cancel appointment less than 4 hours before start time" 
            });
            return;
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ 
            message: "Appointment cancelled successfully",
            appointmentId: appointment._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error cancelling appointment" });
    }
};