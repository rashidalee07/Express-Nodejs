const mongoose = require('mongoose');

const slugify = require('slugify');

const validator = require('validator');

//const User = require('./userModel');

const tourschema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour name must have less or equal to 40 characters',
      ],
      minLength: [
        10,
        'A tour name must have more or equal to 10 characters',
      ],
      //   validate: [
      //     validator.isAlpha,
      //     'Tour name must contain alphabets on only',
      //   ],
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message:
          'Difficulty is either: easy, medium, difficulty',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Tour must have rating above 1'],
      max: [5, 'Tour must have rating below 5'],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this points to current document on New Document Creation
          return val < this.price; //100<200
        },
        message:
          'The discount price ({VALUE}) should be less than regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    startDates: [Date],
    secretTour: { type: Boolean, default: false },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    // CHILD REFERENCING
    // reviews: [
    //   {
    //     type: mongoose.Schema.ObjectId,
    //     ref: 'Review',
    //   }
    // ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// For single field
//tourschema.index({ price: 1 });

// For compound fields
tourschema.index({ price: 1, ratingsAverage: -1 });

tourschema.index({ slug: 1 });

tourschema.index({ startLocation: '2dsphere' });

// VIRTUAL PROPERTIES
tourschema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate
tourschema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: Runs before.save() and .create() but does not work for insert many
// tourschema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

tourschema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });

  //console.log('will save the document'),
  next();
});

// tourschema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map((id) =>
//     User.findById(id)
//   );
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourschema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLWARE

// tourschema.pre('find', function (next) {
tourschema.pre(/^find/, function (next) {
  // this keyword is query object and we can chain all methods for query
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourschema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourschema.post(/^find/, function (docs, next) {
  console.log(
    `Query took ${Date.now() - this.start} milliseconds!`
  );
  //console.log(docs);
  next();
});

//AGGREGATION MIDDLEWARE
// Aggregate hook
// this points to current aggregation object
// tourschema.pre('aggregate', function (next) {
//   this.pipeline().unshift({
//     $match: { secretTour: { $ne: true } },
//   });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model('Tour', tourschema);

module.exports = Tour;
