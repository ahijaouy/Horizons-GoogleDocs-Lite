// NPM Packages
const express = require('express');
const router = express.Router();

// Local Imports
const User = require('./models/user');
const Document = require('./models/document');

router.post('/register', function (req, res) {
  User.register(req.body.name, req.body.username, req.body.password, function(error, user) {
    if (error) {
      res.send({error});
    } else {
      res.send({user});
    }
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.send('logout');
});
router.post('/document', function (req, res) {
  console.log('user', req.user);
  const newDocument = new Document({
    name: req.body.name,
    body: req.body.body,
    owner: req.user,
    collaborators: [req.user]
  });
  newDocument.save((err) => {
    if(err){
      res.send('Error creating Document', err);
    }
  });
  res.json(newDocument);
});

router.get('/document', function (req, res) {
  Document.find({},function(err, result){
    res.send(result);
  });
});

router.post('/document/update', function (req, res) {
  console.log('find me here', req.body.body);
  const history = req.body.history.concat({content: req.body.body, date: new Date()});
  Document.findOneAndUpdate({_id: req.body.id},{ body: req.body.body, history: history },function(err, result){
    console.log('in here now ifnally', result);
    res.send(result);
  });
});

router.get('/user', function(req,res){
  console.log(req.user);
  res.send(req.user);
});

router.post('/user', function(req,res){
  const currentDocument = req.body.id;
  const addUserName = req.body.name ? req.body.name : req.user.name;
  let collaborators = [];
  Document.find({_id: currentDocument}, function(err,result){
    User.find({name: addUserName}, function(error, result2){
      collaborators = result[0].collaborators;
      if(!result2[0]){
        console.log('not found');
        res.send('User not found');
      }else{
        console.log('user found');
        let found = false;
        collaborators.forEach((user) => {
          console.log(' here', String(user._id) ,String(result2[0]._id));
          console.log(' also here', String(user._id) === String(result2[0]._id));
          if(String(user._id) === String(result2[0]._id)){
            found = true;
          }
        });
        console.log('found, ', found);
        if(found === false){
          const newCollab = collaborators.concat([result2[0]]);
          Document.findOneAndUpdate({_id: currentDocument},{ collaborators: newCollab },function(err, result){
            res.send(result);
          });
        }
      }
    });
  });
});


// router.post('/user', function(req,res){
//   const currentDocument = req.body.id
//   const addUserName = req.body.name ?
//   let collaborators = []
//   if(!addUserName){
//     Document.find({_id: currentDocument}, function(err,result){
//       collaborators = result[0].collaborators
//       const newCollab = collaborators.concat([req.user]);
//       Document.findOneAndUpdate({_id: currentDocument},{ collaborators: newCollab },function(err, result){
//         res.send(result);
//       });
//     })
//   }else{
//     Document.find({_id: currentDocument}, function(err,result){
//       User.find({name: addUserName}, function(error, result2){
//         collaborators = result[0].collaborators
//         if(!result2[0]){
//           console.log('not found');
//           res.send('User not found');
//         }else{
//           console.log('user found');
//           let found = false
//           collaborators.forEach((user) => {
//             console.log(' here', String(user._id) ,String(result2[0]._id));
//             console.log(' also here', String(user._id) === String(result2[0]._id));
//             if(String(user._id) === String(result2[0]._id)){
//               found = true
//             }
//           })
//           console.log('found, ', found);
//           if(found === false){
//             const newCollab = collaborators.concat([result2[0]]);
//             Document.findOneAndUpdate({_id: currentDocument},{ collaborators: newCollab },function(err, result){
//               res.send(result);
//             });
//           }
//         }
//       })
//     })
//   }
// })

// router.post('/collab', function(req,res){
//   const currentDocument = req.body.id
//   const
//   let collaborators = []
//
//
//   Document.find({_id: currentDocument}, function(err,result){
//     collaborators = result[0].collaborators
//     const newCollab = collaborators.concat([req.user]);
//     Document.findOneAndUpdate({_id: currentDocument},{ collaborators: newCollab },function(err, result){
//       res.send(result);
//     });
//   })
// })

router.get('/success', function(req, res) {
  res.json({authenticated: true, user: req.user});
});

router.get('/failed', function(req, res) {
  res.json({authenticated: false});
});

module.exports = router;
