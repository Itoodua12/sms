import { RequestHandler } from 'express';
import Salon from '../model/salonModel';
import Service from '../model/serviceModel';
import Employee from '../model/employeeModel';
import { CreateSalonDto, SalonFilterDto } from '../dtos/salon';
import mongoose from 'mongoose';

export const createSalon: RequestHandler<{},{}, CreateSalonDto> = async (req, res) => {
    try {
        const userId = req.user.id;
        const salonData: CreateSalonDto = req.body;
        const { services, employees, ...salonDetails } = salonData;
        
        let existing = await Salon.findOne({name: salonDetails.name});
        if (existing) {
            res.status(409).json({ message: "Salon with this name already exists" });
            return;
        }

        if (employees) {
            const employeePhones = employees.map(emp => emp.phone);
            const uniquePhones = new Set(employeePhones);
            if (employeePhones.length !== uniquePhones.size) {
                res.status(400).json({ message: "Duplicate employee phone numbers are not allowed" });
                return;
            }

            for (const employee of employees) {
                const existingEmployee = await Employee.findOne({ phone: employee.phone });
                if (existingEmployee) {
                    res.status(409).json({ 
                        message: `Employee with phone number ${employee.phone} already exists` 
                    });
                    return;
                }
            }
        }

        const salon = new Salon({
            ...salonDetails,
            userId,
            employees: [],
            services: []
        });
        await salon.save();

        const createdServices = new Map();
        if (services && services.length > 0) {
            const serviceIds = await Promise.all(services.map(async service => {
                let existingService = await Service.findOne({ name: service.name });
                if (existingService) {
                    createdServices.set(service.name, existingService._id);
                    return existingService._id;
                } else {
                    const newService = await new Service({
                        ...service,
                        salonId: salon._id
                    }).save();
                    createdServices.set(service.name, newService._id);
                    return newService._id;
                }
            })) as mongoose.Types.ObjectId[];

            salon.services = serviceIds;
            await salon.save();
        }

        if (employees && employees.length > 0 && createdServices.size > 0) {
            const createdEmployees = await Promise.all(employees.map(async employee => {
                const employeeServices = employee.services.map(service => ({
                    serviceId: createdServices.get(service.serviceName),
                    duration: service.duration,
                    price: service.price
                }));

                const newEmployee = await new Employee({
                    salonId: salon._id,
                    name: employee.name,
                    position: employee.position,
                    phone: employee.phone,
                    schedule: employee.schedule,
                    services: employeeServices
                }).save();

                return newEmployee._id;
            })) as mongoose.Types.ObjectId[];

            // Update salon with employee IDs
            salon.employees = createdEmployees;
            await salon.save();
        }

        res.status(201).json(salon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating salon" });
    }
};

export const filterSalons: RequestHandler<{}, {}, {}, SalonFilterDto> = async (req, res) => {
    try {
        const { name, location, serviceId } = req.query;
        let query: any = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (location) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    },
                    $maxDistance: (location.maxDistance || 10) * 1000
                }
            };
        }

        if (serviceId) {
            const employeesWithService = await Employee.distinct('salonId', {
                'services.serviceId': serviceId
            });
            query._id = { $in: employeesWithService };
        }

        const salons = await Salon.find(query);
        
        if (serviceId && salons.length > 0) {
            const enhancedSalons = await Promise.all(salons.map(async salon => {
                const employees = await Employee.find({
                    salonId: salon._id,
                    'services.serviceId': serviceId
                }).select('name services');
                
                return {
                    ...salon.toObject(),
                    employees: employees.map(emp => ({
                        name: emp.name,
                        service: emp.services.find(s => s.serviceId.toString() === serviceId)
                    }))
                };
            }));
            
            res.json(enhancedSalons);
            return;
        }

        res.json(salons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error filtering salons" });
    }
};
