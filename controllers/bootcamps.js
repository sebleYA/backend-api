/*
  @desc         Get all bootcamps
  @route        GET /api/v1/bootcamps
  @acces        Public
*/
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
};

/*
  @desc         Get single bootcamp
  @route        GET /api/v1/bootcamps/:id
  @acces        Public
*/
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Show bootcamp ${req.params.id}` });
};

/*
  @desc         Create new bootcamp
  @route        POST /api/v1/bootcamps
  @acces        Private
*/
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'Create a new bootcamp' });
};

/*
  @desc         Update bootcamp
  @route        PUT /api/v1/bootcamps/:id
  @acces        Private
*/
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

/*
  @desc         Delete bootcamp
  @route        DELETe /api/v1/bootcamps/:id
  @acces        Private
*/
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
