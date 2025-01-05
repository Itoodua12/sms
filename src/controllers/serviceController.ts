import { RequestHandler } from 'express';
import Service from '../model/serviceModel';

export const getAllServices: RequestHandler<{}, {}, {}> = async (req, res) => {
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