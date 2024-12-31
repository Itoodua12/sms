export interface RegisterRequestBody {
    email: string
    firstName: string;
    lastName: string;
    password: string;
    role: "manager" | "customer"; // other fields should be adjusted
}

export interface LoginRequestBody {
    email: string;
    password: string;
}