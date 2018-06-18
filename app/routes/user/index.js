var express = require('express');
var router = express.Router();
let app = express();
var assert = require('assert');
let path = require('path');

var multer = require('multer');

const Sequelize = require('sequelize')
const sequelize = new Sequelize('myproject', 'root', '',{
dialect: 'mysql'
})

const MyModel = sequelize.define('myModel', {
  filePath: Sequelize.STRING,
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({storage: storage});

console.log('index.js loaded');

router.get('/', function(req, res){
res.sendFile('views/index.html', { root: 'public' });
})

router.post('/fileUpload', upload.single('image'), (req, res, next) => {
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

    sequelize.sync();

    const filePath = `${req.file.destination}/${req.file.filename}`

    const myModel = MyModel.create({ filePath });

    res.json(req.file);
});



module.exports = router;

var insertDocuments = function(db, filePath, callback) {
    var collection = db.collection('user');
    collection.insertOne({'imagePath' : filePath }, (err, result) => {
        assert.equal(err, null);
        callback(result);
    });
}
