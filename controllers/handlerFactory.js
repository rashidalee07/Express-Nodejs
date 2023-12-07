const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(
      req.params.id
    );
    if (!doc)
      return next(
        new AppError('No document find with this ID', 404)
      );
    res.status(204).json({
      status: 'Success!!!',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc)
      return next(
        new AppError('No document find with this ID', 404)
      );

    res.status(200).json({
      status: 'Success!!!',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'Success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    //findById is shorthand method of findOne()
    // const doc = await Model.findById(
    //   req.params.id
    // ).populate('reviews');
    // Tour.findOne({_id:req.params.id}) in this way we have to pass object with field _id

    if (!doc)
      return next(
        new AppError('No document find with this ID', 404)
      );
    res.status(200).json({
      status: 'Success',

      data: {
        data: doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    // To allow for nested GET reviews on tour [hack]

    if (req.params.tourId)
      filter = { tour: req.params.tourId };
    const features = new APIFeatures(
      Model.find(filter),
      req.query
    )
      .filter()
      .sort()
      .limitingFields()
      .paginate();
    // const doc = await features.query.explain();

    const doc = await features.query;

    //SEND RESPONSE

    res.status(200).json({
      status: 'Success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
