import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({
    limit:'20kb'
}))

app.use(express.urlencoded({
    extended : true,
    limit : '20kb'
}))

app.use(cookieParser())


import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.route.js'
import leadRoutes from './routes/lead.route.js' 

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/leads', leadRoutes);

export default app;