var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploadpictures');
    },
    filename: function(req, file, cb) {
        var str = file.originalname.split('.');
        cb(null, Date.now()+str[0]+'.'+str[1]);
    }
})

var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '2222', login_is_correct: true });
});
router.get('/index', function(req, res, next) {
    res.render('index', { title: '2222', login_is_correct: true });
});

/* GET home page. */
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: '44444', login_is_correct: true });
});
router.get('/eventdetail', function(req, res, next) {
    res.render('eventdetail', { title: '44444', login_is_correct: true });
});

/* POST from form. */
router.post('/event', function(req, res, next) {
    var login_name= req.body.login_name;
    var login_password= req.body.login_password;

    if (login_name=='qqq' && login_password=='123'){
        res.render('event', { title: login_name,  login_is_correct: true });
    } else {
        res.render('index', { title: 'My Class', login_is_correct: false });
    }
});

router.get('/event', function(req, res, next) {
    var login_name= req.body.login_name;
    res.render('event', { title: 'login_name', login_is_correct: true });
});
router.get('/story', function(req, res, next) {
    res.render('story', { title: 'hahahah', login_is_correct: true });
});
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'hahahah', login_is_correct: true });
});
router.get('/createevent', function(req, res, next) {
    var login_name= req.body.login_name;
    res.render('createevent', { title: 'login_name', login_is_correct: true });
});
router.get('/createstory', function(req, res, next) {
    var login_name= req.body.login_name;
    res.render('createstory', { title: 'login_name', login_is_correct: true });
});

router.post('/uploadimg', upload.array("file",9),function(req,res,next){
    //alert("arrive post!");
    var arr = [];
    for(var i in req.files){
        arr.push(req.files[i].path);
    }
    res.send({
        code:200,
        data:arr
    });

});

/* POST from form. */
// router.post('/event', function(req, res, next) {
//
//     res.render('signup', { title: 'My Class', login_is_correct: false });
//
// });
// router.post('/event', function(req, res, next) {
//
//     res.render('story', { title: 'My Class', login_is_correct: false });
//
// });
//
//
// router.post('/story', function(req, res, next) {
//
//     res.render('signup', { title: 'My Class', login_is_correct: false });
//
// });


module.exports = router;
