# Image Processing API

## About

Scalable project that displays images to front-end through API and resizes images if required

### Scripts

run `npm run build` for initial build

run `npm run nextbuild` for subsequent builds if needed

### Endpoints

Image API endpoint

Parameters required: filename

Optional parameters for resizing: width, height

## GET

`/api/image?filename=&width=&height=`

# Example Usage

```
http://localhost:3000/api/image?filename=fjord&width=300&height=200
```

## Testing

Testing is done using jasmine
To run the tests, run

```
npm run test
```
