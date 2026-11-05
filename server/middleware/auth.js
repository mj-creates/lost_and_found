module.exports = (req, res, next) => {
  // TEMPORARY: Fakes a logged-in user so Person 2 can test POST /api/items
  // Replace this file when Person 1 finishes their auth task!
  req.user = '123456789012345678901234'; 
  next();
};