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

```
/api/image?filename=&width=&height=
```

## Testing

Testing is done using jasmine
To run the tests, run

```
npm run test
```
