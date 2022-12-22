import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

//Build a complete image path for a given name, supports any image extension
export const getImage = (imageName: string): string => {
  //get images directory
  const imageDir = path.join(__dirname, '..', 'images');

  let imageArray: string[] = [];
  let imageFile: string | undefined = '';

  //get all images in directory
  imageArray = fs.readdirSync(imageDir);

  //find the image requested in the array
  imageFile = imageArray.find((e) => e.includes(imageName + '.'));

  //build complete path
  let imagePath = '';

  if (imageFile) {
    imagePath = path.join(__dirname, '..', 'images', imageFile as string);
  }

  return imagePath;
};

//Find image required, resize if width or height exist in params
export const findImage = async (imageName: string, width?: number, height?: number): Promise<string> => {
  const baseImage = getImage(imageName);
  if (width || height) {
    //If width and height exist then resize with both parameters
    if (width && height) {
      const resizedImage = await resizeImage(baseImage, width, height);
      return resizedImage;
      //If only width exists then resize with width
    } else if (width) {
      const resizedImage = await resizeImage(baseImage, width);
      return resizedImage;
      //If only height exists then resize with height
    } else if (height) {
      const resizedImage = await resizeImage(baseImage, undefined, height);
      return resizedImage;
    }
  }
  return baseImage;
};

//Resize image based on input parameters
const resizeImage = async (imagePath: string, width?: number, height?: number): Promise<string> => {
  //Failsafe incase any error happens with previous checks
  const widthNum = parseInt(width as unknown as string);
  const heightNum = parseInt(height as unknown as string);

  if (width || height) {
    //Check if both width and height exist
    if (width && height) {
      if (widthNum <= 0 || heightNum <= 0) {
        return imagePath;
      }

      const outputPath = path.join(
        imagePath,
        '..',
        'thumb',
        'resized' + 'W' + width + 'H' + height + path.basename(imagePath)
      );
      //If image exists return it without resizing again
      if (fs.existsSync(outputPath)) {
        return outputPath;
      }

      const img = sharp(imagePath);
      await img.resize({ width, height }).toFile(outputPath);

      return outputPath;
      //Check if only width exists
    } else if (width) {
      if (widthNum <= 0) {
        return imagePath;
      }
      const outputPath = path.join(imagePath, '..', 'thumb', 'resized' + 'W' + width + path.basename(imagePath));
      //If image exists return it without resizing again
      if (fs.existsSync(outputPath)) {
        return outputPath;
      }

      const img = sharp(imagePath);
      await img.resize({ width }).toFile(outputPath);

      return outputPath;
      //Check if only height exists
    } else if (height) {
      if (heightNum <= 0) {
        return imagePath;
      }
      const outputPath = path.join(imagePath, '..', 'thumb', 'resized' + 'H' + height + path.basename(imagePath));

      //If image exists return it without resizing again
      if (fs.existsSync(outputPath)) {
        return outputPath;
      }

      const img = sharp(imagePath);
      await img.resize({ height }).toFile(outputPath);

      return outputPath;
    }
  }
  return '';
};
