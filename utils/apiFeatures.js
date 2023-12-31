class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering Query
    const queryObject = { ...this.queryString };
    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
    ];
    excludedFields.forEach((el) => delete queryObject[el]);

    // 1B) Advanced Filtering

    let queryStr = JSON.stringify(queryObject);

    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log(JSON.parse(queryStr));

    //console.log(req.query, queryObject);
    // 1st solution to filter data

    this.query = this.query.find(JSON.parse(queryStr));
    //let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort
        .split(',')
        .join(' ');

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitingFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields
        .split(',')
        .join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const numOfTours = await Tour.countDocuments();
    //   if (skip >= numOfTours)
    //     throw new Error('This page does not exist');
    // }
    return this;
  }
}

module.exports = APIFeatures;
