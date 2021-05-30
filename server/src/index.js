const express = require('express');
const cors = require('cors');
// const path = require('path');
// const enforce = require('express-sslify')

// Route
const downloadPrivateKeyRoute = require('./Route/DownloadPrivateKey');
const createAcc = require('./Route/CreateAcc');
const getUserInfo = require('./Route/GetUserInfo');

const app = express();

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use('/api', downloadPrivateKeyRoute);
app.use('/api', createAcc);
app.use('/api', getUserInfo);

app.use('/', (req, res, next) => {
  res.send('MassCheck API');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Local server port number:', port);
});
