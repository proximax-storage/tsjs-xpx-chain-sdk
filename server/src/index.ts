import express from 'express';
import cors from 'cors';
// import path from 'path';
// import enforce from 'express-sslify';

// Route
import downloadPrivateKeyRoute from './Route/DownloadPrivateKey';

const app = express();

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// if (process.env.NODE_ENV === 'production') {
//   app.use(enforce.HTTPS({ trustProtoHeader: true }));
//   app.use(express.static(path.join(__dirname, 'client/build')));

//   app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
//   });
// }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(downloadPrivateKeyRoute);

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server port number:', process.env.SERVER_PORT);
});
