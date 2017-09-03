exports.getUserId = function(req) {
  if (req.query && req.query.USERID) {
    return req.query.USERID;
  }
}
