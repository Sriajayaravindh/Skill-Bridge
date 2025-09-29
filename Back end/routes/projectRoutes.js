const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { multiUpload } = require('../middleware/uploadMiddleware'); 
const { submitProject, getAllProjects } = require('../controllers/projectController');

router.post('/submit', protect, multiUpload, submitProject);
router.get('/', getAllProjects);

module.exports = router;
