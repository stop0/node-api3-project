const server = require("../server");

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      'Origin'
    )}`
  );

  next();
}

function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  req.user.findById(req.params.id)
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  })
  next()
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (!req.user){
    res.status(400).json({ message: "missing user data" });
  }
  if (req.user === ""){
    res.status(400).json({ message: "missing required name field"});

  }
  next()
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (!req.post){
    res.status(400).json({ message: "missing post data" });
  }
  if (req.user === ""){
    res.status(400).json({ message: "missing required text field"});

  }
  next()
}

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
}