const Bootcamp = require('../models/Bootcamp');

/*
  @desc         Get all bootcamps
  @route        GET /api/v1/bootcamps
  @acces        Public
*/
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps
    });
  } catch (err) {
    res.status(400).json({ sucess: false });
  }
};

/*
  @desc         Get single bootcamp
  @route        GET /api/v1/bootcamps/:id
  @acces        Public
*/
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/*
  @desc         Create new bootcamp
  @route        POST /api/v1/bootcamps
  @acces        Private
*/
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/*
  @desc         Update bootcamp
  @route        PUT /api/v1/bootcamps/:id
  @acces        Private
*/
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
      new :true,
      runValidators: true
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      sucess: true,
      data: bootcamp
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

/*
  @desc         Delete bootcamp
  @route        DELETe /api/v1/bootcamps/:id
  @acces        Private
*/
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({
      sucess: true
    });
  } catch (err) {
    res.status(400).json({ success: false, data:{} });
  }
};
