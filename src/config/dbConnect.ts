import mongoose from "mongoose";

export const dbConnect = async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error("DATABASE_URL is not defined in environment variables");
    }
    try {
        const connect = await mongoose.connect(databaseUrl);
        console.log(`Databae connected: ${connect.connection.host}, ${connect.connection.name} `);
    }catch(err) {
        console.log(err);
        process.exit(1)
    }
};