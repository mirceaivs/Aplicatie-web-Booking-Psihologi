import express, { Request, Response } from 'express';
import { connectDb, upload } from './models/db';
import userRoutes from './routes/user_r';
import bodyParser from 'body-parser';
import adminRoutes from './routes/admin_r';
import cookieParser from 'cookie-parser';

//utils
connectDb();
const app = express();
app.use(upload.single('poza'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//routes

//CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

//random
app.get('/', (req: Request, res: Response) => {
  res.send('ceva!');
});


//server port
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});




// import https from 'https';
// import fs from 'fs';
// const httpOptions = {
  //   key:fs.readFileSync('./certs/server.key'),
  //   cert:fs.readFileSync('./certs/server.crt')
  // };
// const server = https.createServer(httpOptions, app);
