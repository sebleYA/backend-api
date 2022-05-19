
const advancedResults = (model, populate) =>
    async (req, res, next) =>{
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
  query = model.find(JSON.parse(queryStr));

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
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if(populate){
    query = query.populate(populate);
  }

  //Excuting query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

    

    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results
    }

    next();
};


module.exports = advancedResults;