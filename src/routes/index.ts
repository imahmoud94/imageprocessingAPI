import express from 'express';
import image from './api/image';
const routes = express.Router();

//main route
routes.get('/', (req, res) => {
  res.send('main api route');
});

//image api route
routes.use('/image', image);

export default routes;
