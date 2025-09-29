const express = require('express');
const cloudinary = require('../utils/cloudinary');
const { multiUpload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/', multiUpload, async (req, res) => {
  console.log('✅ /api/uploads route hit');
  try {
    const uploadedFiles = await Promise.all(
      req.files.map(async (file) => {
        const safeFileName = file.originalname.replace(/[\/\\?%*:|"<>]/g, '_');
        const base64String = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(base64String, {
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
          folder: 'uploads',
          resource_type: 'auto',
        });

        return {
          fileName: file.originalname,
          fileUrl: result.secure_url,
          fileType: file.mimetype,
          fileSize: file.size,
        };
      })
    );

    res.status(200).json({ files: uploadedFiles });
  } catch (err) {
    console.error('🔥 Cloudinary upload error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
