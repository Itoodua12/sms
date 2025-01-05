import { RequestHandler } from 'express';
import Salon from '../model/salonModel';
import Service from '../model/serviceModel';
import Employee from '../model/employeeModel';
import { CreateSalonDto, SalonFilterDto } from '../dtos/salon';

export const createSalon: RequestHandler<{},{}, CreateSalonDto> = async (req, res) => {
    try {
        const salonData: CreateSalonDto = req.body;
        const { services, employees, ...salonDetails } = salonData;
        
        const salon = new Salon(salonDetails);
        await salon.save();

        const createdServices = new Map();
        if (services && services.length > 0) {
            try {
                for (const service of services) {
                    let existingService = await Service.findOne({ name: service.name });

                    if (existingService) {
                        createdServices.set(service.name, existingService._id);
                    } else {
                        const newService = await new Service({
                            ...service,
                            salonId: salon._id
                        }).save();
                        createdServices.set(service.name, newService._id);
                    }
                }
            } catch (error) {
                await Salon.findByIdAndDelete(salon._id);
                res.status(400).json({ 
                    message: "Error processing services"
                });
                return;
            }
        }

        if (employees && employees.length > 0 && createdServices.size > 0) {
            const employeePromises = employees.map(async employee => {
                const employeeServices = employee.services.map(service => ({
                    serviceId: createdServices.get(service.serviceName),
                    duration: service.duration,
                    price: service.price
                }));

                return new Employee({
                    salonId: salon._id,
                    name: employee.name,
                    position: employee.position,
                    schedule: employee.schedule,
                    services: employeeServices
                }).save();
            });

            await Promise.all(employeePromises);
        }

        res.status(201).json({
            message: "Salon created successfully",
            salonId: salon._id
        });
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