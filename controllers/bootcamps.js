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
  let query;

  // Copy of req.query
  const reqQuery = { ...req.query };

  // Create an array of fields to exclude form matching
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over remove field and delte them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);


  // Create query sting
  let queryStr = JSON.stringify(req.query);

  // Create operators ($gt. $lt..)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  //Excuting query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if(endIndex < total){
    pagination.next = {
      page: page + 1,
      limit
    }
  }
  if(startIndex > 0){
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    pagination,
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
