
import express, { Application, NextFunction, Request, Response } from 'express'
import { rootResponse } from './utility/sendResponse';
import cookieParser from 'cookie-parser';
import { authRouter } from './modules/auth/auth.route';
import { serviceRouter } from './modules/service/service.route';
import { categoryRouter } from './modules/category/category.route';
import { globalError } from './middleware/globalError';

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

app.use('/api/auth', authRouter)

app.use('/api/admin/categories', categoryRouter)

app.use('/api/services', serviceRouter)


app.use(globalError)

export default app;