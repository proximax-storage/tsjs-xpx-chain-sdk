import express from 'express';
import cors from 'cors';

const app = express();

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server port number:', process.env.SERVER_PORT);
});
