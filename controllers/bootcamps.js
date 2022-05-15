const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlerware/async');
// const geocoder = require ('../utils/geocoder')
const Bootcamp = require('../models/Bootcamp');
const { geoSearch } = require('../models/Bootcamp');
const Geocoder = require('node-geocoder/lib/geocoder');

/*
  @desc         Get all bootcamps
  @route        GET /api/v1/bootcamps
  @acces        Public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
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
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    sucess: true
  });
});

/*
  @desc         Get bootcamps within a radius
  @route        GET /api/v1/bootcamps/radius/:zipcode/:distance
  @acces        Private
*/
exports.getBootcampsInradius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocoder(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longtitude;

  /* calc radius using radians
     Divide dist by radius of Earth
     Earth Radius = 3, 963 mi / 6,378 km
  */
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerShere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    sucess: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
