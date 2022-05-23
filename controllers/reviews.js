const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlerware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

/*
  @desc         Get reviews
  @route        GET /api/v1/reviews
  @route        GET /api/v1/bootcamps/:bootcampId/reviews
  @acces        Public
*/
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      sucess: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

/*
  @desc         Get a single review
  @route        GET /api/v1/reviews/:id
  @acces        Public
*/
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    sucess: true,
    data: review
  });
});

/*
  @desc         Add review
  @route        POST /api/v1/bootcamps/:bootcampId/reviews
  @acces        Private
*/
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
  }
  // you need some logic ||
  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

/*
  @desc         Update review
  @route        PUT /api/v1/review/:id
  @acces        Private
*/
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  // Make sure review belongs to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`No authorized to update review`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: review
  });
});

/*
  @desc         Delete review
  @route        DELETE /api/v1/review/:id
  @acces        Private
*/
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
  }

  // Make sure review belongs to user or admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`No authorized to update review`, 401));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: []
  });
});
