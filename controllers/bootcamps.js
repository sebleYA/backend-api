const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlerware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');

/*
  @desc         Get all bootcamps
  @route        GET /api/v1/bootcamps
  @acces        Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  
  res.status(200).json(res.advancedResults);
});

/*
  @desc         Get single bootcamp
  @route        GET /api/v1/bootcamps/:id
  @acces        Public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: bootcamp
  });
});

/*
  @desc         Create new bootcamp
  @route        POST /api/v1/bootcamps
  @acces        Private
*/
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

/*
  @desc         Update bootcamp
  @route        PUT /api/v1/bootcamps/:id
  @acces        Private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    sucess: true,
    data: bootcamp
  });
});

/*
  @desc         Delete bootcamp
  @route        DELETe /api/v1/bootcamps/:id
  @acces        Private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
  bootcamp.remove();

  res.status(200).json({
    sucess: true,
    data: {}
  });
});

/*
  @desc         Get bootcamps within a radius
  @route        GET /api/v1/bootcamps/radius/:zipcode/:distance
  @acces        Private
*/
exports.getBootcampsInradius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  console.log(zipcode, distance);
  // //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  /* calc radius using radians
     Divide dist by radius of Earth
     Earth Radius = 3, 963 mi / 6,378 km
  */
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lat, lng], radius] } }
  });
  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

/*
  @desc         Upload phot for bootcamp
  @route        PUT /api/v1/bootcamps/:id/photo
  @acces        Private
*/
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  console.log(file);

  // Make sure the image is photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  //Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
  }

  // Create custom file name

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return new ErrorResponse(`Problem with file upload`, 500);
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      sucess: true,
      data: file.name
    })
  });
});
