import express from 'express';
import { checkFileExist, checkParams } from '../../middleware/middlewares';
import { findImage } from '../../utils/utils';

const image = express.Router();

//List of middlewares to use for endpoints
image.use([checkFileExist, checkParams]);

//Image processing endpoint
image.get('/', async (req, res) => {
  const imageName = req.query.filename as string;
  const width = parseInt(req.query.width as string);
  const height = parseInt(req.query.height as string);

  res.sendFile(await findImage(imageName, width, height));
});

export default image;
