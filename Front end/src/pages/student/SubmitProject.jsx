import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SubmitProject = () => {
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    title: '',
    description: '',
    link: '',
    email: '',
  });

  const [files, setFiles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setFormData((prev) => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'name' && !value) error = 'Name is required';
    if (name === 'batch' && !value) error = 'Batch timing is required';
    if (name === 'title' && !value) error = 'Project title is required';
    if (name === 'description' && value.length < 10) error = 'Description must be at least 10 characters';

    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.batch) errors.batch = 'Batch timing is required';
    if (!formData.title) errors.title = 'Project title is required';
    if (formData.description.length < 10) errors.description = 'Description must be at least 10 characters';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setIsSubmitting(true);

      // ✅ Batch upload all files under field name 'files'
      const fileData = new FormData();
      files.forEach(file => fileData.append('files', file));

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/uploads`, fileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const uploadedFiles = res.data.files;

      const payload = {
        ...formData,
        files: uploadedFiles,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/projects/submit`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setSubmitMessage(response.data.message || 'Project submitted successfully!');
      setFormData({
        name: '',
        batch: '',
        title: '',
        description: '',
        link: '',
        email: formData.email,
      });
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Submission error:', err);
      // console.log(' Error response:', err.response?.data);
      setSubmitMessage(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-indigo-200 to-emerald-100 flex items-center justify-center px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl w-full max-w-lg p-6 sm:p-8 md:p-10 transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Submit Your Project</h2>

        <div className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}

          <input
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            placeholder="Batch Timing (e.g. 11.00 AM)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {formErrors.batch && <p className="text-red-500 text-sm">{formErrors.batch}</p>}

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Project Title"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {formErrors.title && <p className="text-red-500 text-sm">{formErrors.title}</p>}

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            rows="4"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}

          <input
            name="link"
            value={formData.link}
            onChange={handleChange}
            placeholder="GitHub or Live Link (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer hover:bg-red-700 transition w-fit"
            >
              Choose Files
            </label>
           <input
  id="file-upload"
  type="file"
  multiple
  onChange={handleFileChange}
  ref={fileInputRef}
  className="hidden"
  accept=".jpg,.jpeg,.png,.gif,.mp4,.zip,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
/>
            <ul className="text-sm text-gray-600 list-disc ml-5">
              {files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
              <p className="text-xs text-gray-500 ml-5">
  Accepted formats: images, videos, PDFs, DOCs, ZIPs, PPTs, Excel, text files
</p>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 mt-4 text-white font-semibold rounded-lg transition ${
              isSubmitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>

          {submitMessage && (
            <p className="text-center text-green-600 mt-4 font-medium">{submitMessage}</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubmitProject;
