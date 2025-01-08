import express from 'express';
import 'dotenv/config';
import { dbConnect } from './config/dbConnect';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import salonRoutes from './routes/salonRoutes'
import employeeRoutes from './routes/employeeRoutes'
import serviceRoutes from './routes/serviceRoutes'
import appoinmtmentRoutes from './routes/appointmentRoutes'

dbConnect()

const app = express();

app.use(express.json())

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/salon", salonRoutes);
app.use("/api/v1/employee", employeeRoutes);
app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/appointment", appoinmtmentRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})