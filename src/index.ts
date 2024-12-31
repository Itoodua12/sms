import express from 'express';
import 'dotenv/config';
import { dbConnect } from './config/dbConnect';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dbConnect()

const app = express();

app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`)
})