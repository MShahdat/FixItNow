
import express, { Application, NextFunction, Request, Response } from 'express'
import { rootResponse } from './utility/sendResponse';
import cookieParser from 'cookie-parser';
import { authRouter } from './modules/auth/auth.route';

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



export default app;