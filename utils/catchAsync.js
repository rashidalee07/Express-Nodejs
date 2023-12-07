module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// const catchAsync = (fn) => (req, res, next) => {
//   return fn(req, res, next).catch(next);
// };
