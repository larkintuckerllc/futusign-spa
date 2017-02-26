import config from 'config';
import express from 'express';
import api from './api';
import { performMigrations } from './migrations';

const port = config.get('port');
const app = express();
const allowCors = true;
function allowCrossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}
if (allowCors) {
  app.use(allowCrossDomain);
}
app.use('/api', api);
performMigrations().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line
    console.log(`Server running on port ${port}`);
  });
});
