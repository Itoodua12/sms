import { RequestHandler } from 'express';
import Employee from '../model/employeeModel';
import Service from '../model/serviceModel';
import Salon from '../model/salonModel';
import { CreateEmployeeDto } from '../dtos/employee';

export const createEmployee: RequestHandler<{salonId: string}, {}, CreateEmployeeDto> = async (req, res) => {
    try {
        const { salonId } = req.params;
        const employeeData = req.body;

        const salon = await Salon.findById(salonId);
        if (!salon) {
            res.status(404).json({ message: "Salon not found" });
            return;
        }

        const employeeServices = await Promise.all(
            employeeData.services.map(async service => {
                let existingService = await Service.findOne({ name: service.serviceName });

                if (!existingService) {
                    existingService = await new Service({
                        name: service.serviceName,
                        salonId,
                        category: service.category 
                    }).save();
                }

                return {
                    serviceId: existingService._id,
                    duration: service.duration,
                    price: service.price
                };
            })
        );

        const employee = new Employee({
            salonId,
            name: employeeData.name,
            position: employeeData.position,
            schedule: employeeData.schedule,
            services: employeeServices
        });

        await employee.save();

        res.status(201).json({
            message: "Employee created successfully",
            employeeId: employee._id
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            message: error instanceof Error ? error.message : "Error creating employee"
        });
    }
}; 