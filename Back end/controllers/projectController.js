const Project = require('../models/Project');
const cloudinary = require('../utils/cloudinary');

const submitProject = async (req, res) => {
  try {
    const { name, batch, title, description, link, files, email } = req.body;

    // Validate email
    if (!email) {
      return res.status(401).json({ message: 'Unauthorized: Email missing' });
    }

    // Validate required fields
    if (!name || !batch || !title || !description || description.length < 10) {
      return res.status(400).json({ message: 'Invalid submission. Please check all required fields.' });
    }

    // Validate files
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ message: 'No files provided' });
    }

    // Create new project
    const newProject = new Project({
      name,
      batch,
      title,
      description,
      link: link || '',
      email,
      files,
      visible: true,
    });

    await newProject.save();

    res.status(201).json({
      message: 'Project submitted successfully',
      projectId: newProject._id,
    });
  } catch (err) {
  console.error('🔥 Error in submitProject:', err);
  res.status(500).json({
    message: 'Submission failed',
    error: err.message || 'Unknown error',
    stack: err.stack,
    payload: req.body
  });
}
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error in getAllProjects:', err);
    res.status(500).json({
      message: 'Failed to fetch projects',
      error: err.message || 'Unknown error',
    });
  }
};

module.exports = {
  submitProject,
  getAllProjects,
};
