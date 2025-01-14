export interface CreateSalonDto {
    name: string;
    address: string;
    location: {
        type: string;
        coordinates: number[];
    };
    phone: string;
    description?: string;
    coverImage: string;
    openingHours: {
        monday: string;
        tuesday: string;
        wednesday: string;
        thursday: string;
        friday: string;
        saturday: string;
        sunday: string;
    };
    services?: {
        name: string;
        description?: string;
        category?: string;
    }[];
    employees?: {
        name: string;
        position: string;
        phone: string;
        schedule?: { [key: string]: string };
        services: {
            serviceName: string;
            duration: number;
            price: number;
        }[];
    }[];
}

export interface SalonFilterDto {
    name?: string;
    location?: {
        longitude: number;
        latitude: number;
        maxDistance?: number;
    };
    serviceId?: string;
}