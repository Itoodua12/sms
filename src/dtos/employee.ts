export interface CreateEmployeeDto {
    name: string;
    position: string;
    schedule?: { [key: string]: string };
    services: {
        serviceName: string;
        category: string;
        duration: number;
        price: number;
    }[];
} 