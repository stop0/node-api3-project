const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Model = require('./users-model')
const Posts = require("../posts/posts-model")
const mw = require("../middleware/middleware")

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Model.get()
  .then(model => {
    console.log(model)
    res.status(200).json(model)
  })
  .catch(()  => {
    res.status(500).json({ message: "The users information could not be retrieved"  })
  })
});

router.get('/:id',mw.validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  res.status(200).json(req.hub)
});

router.post('/', (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  Model.add(req.body)
  .then(hub => {
    res.status(201).json(hub);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the hub',
    });
  });
});

router.put('/:id',mw.validateUserId, (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Model.update(req.params.id, req.body)
  .then(hub => {
    res.status(200).json(hub)
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  });
});

router.delete('/:id', mw.validateUserId, (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  Model.remove(req.params.id)
    .then(count => {
      res.status(200).json({message: "The hub has been nuked"})
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: 'Error removing the hub',
      });
    });
});

router.get('/:id/posts', mw.validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  Posts.findHubMessages(req.params.id)
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error getting the messages for the hub',
    });
  });
});

router.post('/:id/posts', mw.validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Posts.add(messageInfo)
    .then(message => {
      res.status(210).json(message);
    })
    .catch(error => {
      next(error)
    });
});

router.use((err,req,res,next)=>{
  res.status(500).json({
    message: "Something blew up",
    error:err.message
  })
});

// do not forget to export the router

module.export = router