const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlerware/async');
const Course = require('../models/Course');
const express = require('express');

/*
  @desc         Get coursed
  @route        GET /api/v1/courses
  @route        GET /api/v1/bootcamps/:bootcampId/coures
  @acces        Public
*/

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description'
    });
  }

  const courses = await query;

  res.status(200).json({
    sucess: true,
    count: courses.length,
    data: courses
  });
});
