
import express, { Application, NextFunction, Request, Response } from 'express'
import { rootResponse } from './utility/sendResponse';
import cookieParser from 'cookie-parser';
import { authRouter } from './modules/auth/auth.route';
import { serviceRouter } from './modules/service/service.route';
import { globalError } from './middleware/globalError';
import { userRouter } from './modules/user/user.route';
import { notFound } from './middleware/notFound';
import { categoryController } from './modules/category/category.controller';
import { categoryRouter } from './modules/category/category.route';
import { technicianRouter } from './modules/technicial/technician.route';

const app: Application = express();

app.get('/', (req: Request, res: Response)=> {
  return rootResponse(res)
})


app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(req.url, '=====', Date.now())
  next()
})


//& auth
app.use('/api/auth', authRouter)



//& users
app.use('/api/users', userRouter)


//& technician
app.use('/api/technicians', technicianRouter)


//& categorie
app.use('/api/categories', categoryRouter)



//& service
app.use('/api/services', serviceRouter)



app.use(notFound)
app.use(globalError)

export default app;