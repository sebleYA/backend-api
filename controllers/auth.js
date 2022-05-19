const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlerware/async');
const User = require('../models/User');

/*
  @desc         Register user
  @route        GET /api/v1/auth/register
  @acces        Public
*/
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
console.log(req.body);
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });
console.log(user,'test');
  res.status(200).json({sucess: true });
});
