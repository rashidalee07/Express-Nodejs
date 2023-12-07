// /* eslint-disable no-console */
// //const fs = require('fs');

// const Tour = require('../models/tourModel');

// // No longer required because we now import data from DB not from file.

// // const tours = JSON.parse(
// //   fs.readFileSync(
// //     `${__dirname}/../dev-data/data/tours-simple.json`
// //   )
// // );

// exports.aliasTopTours = (req, res, next) => {
//   req.query.limit = '3';
//   // eslint-disable-next-line no-unused-expressions
//   (req.query.sort = '-averageRatings,price'),
//     (req.query.fields =
//       'name,price,ratingsAverage,summary,difficulty');
//   next();
// };

// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter() {
//     // 1A) Filtering Query
//     const queryObject = { ...this.queryString };
//     const excludedFields = [
//       'page',
//       'sort',
//       'limit',
//       'fields',
//     ];
//     excludedFields.forEach((el) => delete queryObject[el]);

//     // 1B) Advanced Filtering

//     let queryStr = JSON.stringify(queryObject);

//     queryStr = queryStr.replace(
//       /\b(gte|gt|lte|lt)\b/g,
//       (match) => `$${match}`
//     );
//     // console.log(JSON.parse(queryStr));

//     //console.log(req.query, queryObject);
//     // 1st solution to filter data

//     this.query.find(JSON.parse(queryStr));
//     //let query = Tour.find(JSON.parse(queryStr));
//   }
// }

// exports.getAllTours = async (req, res) => {
//   try {
//     // BUILD QUERY
//     // // 1A) Filtering Query
//     // const queryObject = { ...req.query };
//     // const excludedFields = [
//     //   'page',
//     //   'sort',
//     //   'limit',
//     //   'fields',
//     // ];
//     // excludedFields.forEach((el) => delete queryObject[el]);

//     // // 1B) Advanced Filtering

//     // let queryStr = JSON.stringify(queryObject);

//     // queryStr = queryStr.replace(
//     //   /\b(gte|gt|lte|lt)\b/g,
//     //   (match) => `$${match}`
//     // );
//     // // console.log(JSON.parse(queryStr));

//     // console.log(req.query, queryObject);
//     // // 1st solution to filter data
//     // let query = Tour.find(JSON.parse(queryStr));

//     // 2) SORTING

//     if (req.query.sort) {
//       const sortBy = req.query.sort.split(',').join(' ');

//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     // 3) FIELD LIMITING

//     if (req.query.fields) {
//       const fields = req.query.fields.split(',').join(' ');
//       query = query.select(fields);
//     } else {
//       query = query.select('-__v');
//     }

//     // 4) PAGINATION

//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 100;
//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     if (req.query.page) {
//       const numOfTours = await Tour.countDocuments();
//       if (skip >= numOfTours)
//         throw new Error('This page does not exist');
//     }

//     // EXECUTE QUERY
//     const features = new APIFeatures(
//       Tour.find(),
//       req.query
//     ).filter();
//     const tours = await features.query;
//     // query looks like
//     // query.sort().select().skip().limit()

//     // 2nd solution for filtering data using mongoose method and also called chaining

//     // const tours = Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');

//     //SEND RESPONSE

//     res.status(200).json({
//       status: 'Success',
//       results: tours.length,
//       data: {
//         tours,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.getTour = async (req, res) => {
//   try {
//     //findById is shorthand method of findOne()
//     const tour = await Tour.findById(req.params.id);
//     // Tour.findOne({_id:req.params.id}) in this way we have to pass object with field _id
//     res.status(200).json({
//       status: 'Success',

//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.createTour = async (req, res) => {
//   try {
//     //1st Method to create tours [Creating documents]
//     // const newTour = new Tour({});
//     // newTour.save();

//     //2nd Method to create Tours [Directly Creating Documents on Tour]

//     const newTour = await Tour.create(req.body);

//     res.status(201).json({
//       status: 'Success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({
//       status: 'Success!!!',
//       data: {
//         tour,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };

// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'Success!!!',
//       data: null,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail to delete',
//       message: err,
//     });
//   }
// };

// // Old Exports

// // Create Tour
// // exports.createTour = (req, res) => {
// //   const newId = tours[tours.length - 1].id + 1;

// //   // eslint-disable-next-line prefer-object-spread
// //   const newTour = Object.assign({ id: newId }, req.body);

// //   tours.push(newTour);

// //   fs.writeFile(
// //     `${__dirname}/dev-data/data/tours-simple.json`,
// //     JSON.stringify(tours),
// //     // eslint-disable-next-line no-unused-vars
// //     (err) => {
// //       res.status(201).json({
// //         status: 'Success',
// //         data: {
// //           tour: newTour,
// //         },
// //       });
// //     }
// //   );
// // };

// // exports.checkID = (req, res, next, val) => {
// //   console.log(`Tour id is: ${val}`);

// //   if (req.params.id * 1 > tours.length) {
// //     return res.status(404).json({
// //       status: 'fail',
// //       message: 'Invalid ID',
// //     });
// //   }
// //   next();
// // };

// // exports.checkBody = (req, res, next) => {
// //   if (!req.body.price || !req.body.name) {
// //     return res.status(400).json({
// //       status: 'Fail',
// //       message: 'Bad Request',
// //     });
// //   }
// //   next();
// // };
