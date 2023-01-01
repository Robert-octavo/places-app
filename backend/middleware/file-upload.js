const multer = require('multer');
const { v1: uuid } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const fileUpload = multer({ 
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images'); // cb(error, destination)
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype]; // get the extension from the MIME_TYPE_MAP
      cb(null, uuid() + '.' + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! converts to boolean value (true or false)
    let error = isValid ? null : new Error('Invalid mime type!'); // if isValid is true, error is null, otherwise error is new Error
    cb(error, isValid); // cb(error, true) or cb(error, false)
  }
});

module.exports = fileUpload;