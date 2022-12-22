import path from 'path';
import supertest from 'supertest';
import app from '../index';
import { getImage } from '../utils/utils';
import { promises as fs } from 'fs';
import fsp from 'fs';

const request = supertest(app);

const testImgName = 'fjord';
const imagePath = getImage(testImgName);
const thumbnailPath = path.join(getImage(testImgName), '..', 'thumb');

describe('Test endpoint responses', () => {
  //Before all specs, remove any resized image
  beforeAll(async () => {
    for (const file of await fs.readdir(thumbnailPath)) {
      await fs.unlink(path.join(thumbnailPath, file));
    }
  });
  it('Gets the api endpoint', async (done) => {
    const response = await request.get('/api');
    expect(response.status).toBe(200);
    expect(response.text).toBe('main api route');
    done();
  });
  it('Gets the image endpoint with no query', async (done) => {
    const response = await request.get('/api/image/');
    expect(response.status).toBe(400);
    expect(response.text).toBe('Use a filename query');
    done();
  });

  //Every possible case where the parameters are invalid
  describe('All cases with invalid parameters', () => {
    it('Gets the image endpoint with bad filename query', async (done) => {
      const response = await request.get('/api/image/').query({ filename: 'qweqweqwe' });
      expect(response.status).toBe(404);
      expect(response.text).toBe('File does not exist, do not use name with extensions');
      done();
    });

    it('Gets the image endpoint with filename query and NaN width', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, width: 'asdasd' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Width must be a number');
      done();
    });

    it('Gets the image endpoint with filename query and negative width', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, width: '-200' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Width must be greater than 0');

      done();
    });

    it('Gets the image endpoint with filename query and NaN width but valid height', async (done) => {
      const response = await request
        .get('/api/image/')
        .query({ filename: testImgName, width: 'asdasd', height: '201' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Width must be a number');
      done();
    });

    it('Gets the image endpoint with filename query and negative width but valid height', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, width: '-200', height: '202' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Width must be greater than 0');
      done();
    });

    it('Gets the image endpoint with filename query and NaN height', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, height: 'asdasd' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Height must be a number');
      done();
    });

    it('Gets the image endpoint with filename query and negative height', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, height: '-200' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Height must be greater than 0');
      done();
    });

    it('Gets the image endpoint with filename query and NaN height but valid width', async (done) => {
      const response = await request
        .get('/api/image/')
        .query({ filename: testImgName, width: '501', height: 'asdasd' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Height must be a number');
      done();
    });

    it('Gets the image endpoint with filename query and negative height but valid width', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, height: '-200', width: '502' });
      expect(response.status).toBe(400);
      expect(response.text).toBe('Height must be greater than 0');
      done();
    });
  });

  //Every possible case with valid parameters
  describe('All cases with valid parameters', () => {
    it('Gets the image endpoint with filename query', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName });
      expect(response.status).toBe(200);
      expect(fsp.existsSync(imagePath)).toBeTrue();
      done();
    });

    it('Gets the image endpoint with filename query and 500 width, 50 height', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, width: '500', height: '50' });
      const resizedImagePath = path.join(thumbnailPath, `resizedW500H50${path.basename(imagePath)}`);
      expect(response.status).toBe(200);
      expect(fsp.existsSync(resizedImagePath)).toBeTrue();
      done();
    });
    it('Gets the image endpoint with filename query and 300 width', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, width: '300' });
      const resizedImagePath = path.join(thumbnailPath, `resizedW300${path.basename(imagePath)}`);
      expect(response.status).toBe(200);
      expect(fsp.existsSync(resizedImagePath)).toBeTrue();
      done();
    });
    it('Gets the image endpoint with filename query and 30 height', async (done) => {
      const response = await request.get('/api/image/').query({ filename: testImgName, height: '30' });
      const resizedImagePath = path.join(thumbnailPath, `resizedH30${path.basename(imagePath)}`);
      expect(response.status).toBe(200);
      expect(fsp.existsSync(resizedImagePath)).toBeTrue();
      done();
    });
  });
});
