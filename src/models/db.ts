import { Sequelize } from 'sequelize';
import multer from 'multer';
import { initModels } from '../models/init-models';

//calculatorul meu 
export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  username: 'root',
  password: 'root',
  database: 'mydb',
  port: 3306,
});

//docker
// export const sequelize = new Sequelize({
//     dialect: 'mysql',
//     host: '172.23.0.2',
//     username: 'root',
//     password: 'root',
//     database: 'mydb',
//     port: 3306,
//   });



export async function connectDb() {
  try {
    await sequelize.authenticate();
    initModels(sequelize);
    console.log("Conexiunea la baza de date realizata cu succes");
  } catch (error) {
    console.log(error);
  };
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 4 // limitează dimensiunea fișierului la 5 MB
  },
  fileFilter: (req, file, cb) => {
    // verificarea tipului fisierului
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
      cb(null, true);
    } else {
      cb(new Error('Tipul de fișier nu este acceptat'));
    }
  }
});




