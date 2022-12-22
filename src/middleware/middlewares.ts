import { Request, Response, NextFunction } from 'express';
import { getImage } from '../utils/utils';
import fs from 'fs';

//Checks if the file from request query exists in the system
export const checkFileExist = (req: Request, res: Response, next: NextFunction): void => {
  const fileName = req.query.filename as string;
  if (fileName) {
    //If it exists, go to next middleware, else ask for appropriate query
    if (fs.existsSync(getImage(fileName))) {
      next();
    } else {
      res.status(404).send('File does not exist, do not use name with extensions');
    }
  } else {
    res.status(400).send('Use a filename query');
  }
};

//Checks that query params are valid
export const checkParams = (req: Request, res: Response, next: NextFunction): void => {
  //Parse width and height as numbers
  const width = parseInt(req.query.width as string);
  const height = parseInt(req.query.height as string);

  //If width exists in query, validate that its a number and greater than 0
  if (req.query.width) {
    if (Number.isNaN(width)) {
      res.status(400).send('Width must be a number');
    }
    if (width <= 0) {
      res.status(400).send('Width must be greater than 0');
    }
  }

  //if height exists in query, validate that its a number and greater than 0
  if (req.query.height) {
    if (Number.isNaN(height)) {
      res.status(400).send('Height must be a number');
    }
    if (height <= 0) {
      res.status(400).send('Height must be greater than 0');
    }
  }
  next();
};
