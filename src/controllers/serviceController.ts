import { RequestHandler } from 'express';
import Service from '../model/serviceModel';
import Salon from '../model/salonModel';
import { CreateServiceDto } from '../dtos/service';

export const getAllServices: RequestHandler<{}, {}, {}> = async (_, res) => {
    try {
        const services = await Service.find()
            .select('name category')
            .sort({ category: 1, name: 1 });

        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching services" });
    }
};

export const createService: RequestHandler<{salonId: string}, {}, CreateServiceDto> = async (req, res) => {
    try {
        const { salonId } = req.params;
        const serviceData = req.body;

        const salon = await Salon.findById(salonId);
        if (!salon) {
            res.status(404).json({ message: "Salon not found" });
            return;
        }

        const existingService = await Service.findOne({ name: serviceData.name });
        if (existingService) {
            res.status(409).json({ message: `Service ${serviceData.name} already exists` });
            return;
        }

        const service = new Service({
            ...serviceData,
            salonId
        });

        await service.save();

        res.status(201).json({
            message: "Service created successfully",
            serviceId: service._id
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ 
            message: error instanceof Error ? error.message : "Error creating service"
        });
    }
}; 