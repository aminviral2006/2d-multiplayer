var index = function (req, res) {
  return res.sendfile(__dirname + "/../../../../dist/index.html");
};

module.exports = index;