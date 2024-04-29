const multer = require('multer');
const { v1: uuidv1 } = require('uuid');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

const fileUpload = multer({
  limits: {
    fileSize: 500000000, 
  },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const isImage = file.mimetype.startsWith('image/');
      const isDocument = file.mimetype.startsWith('application/pdf') ||
                         file.mimetype.startsWith('application/msword') ||
                         file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      let subfolder = 'other'; // Default subfolder for other types of files
      
      if (isImage) {
        subfolder = 'images';
      } else if (isDocument) {
        subfolder = 'documents';
      }
      
      cb(null, `uploads/${subfolder}`);
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv1() + '.' + ext);
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  },
});

module.exports = fileUpload;