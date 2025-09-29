const multer = require('multer');

// Use memory storage instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10, 
  },
});

module.exports = {
  singleUpload: upload.single('file'),
  multiUpload: upload.array('files', 10),
};
