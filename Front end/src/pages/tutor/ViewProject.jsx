import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewProject = () => {
  const [projects, setProjects] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [feedbackSent, setFeedbackSent] = useState({});
  const [emailProvider, setEmailProvider] = useState({});
  const [loading, setLoading] = useState(true);

  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

  const cleanExpiredProjects = () => {
    const now = Date.now();
    const keys = Object.keys(localStorage).filter((key) => key.startsWith('project_'));

    keys.forEach((key) => {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item?.submittedAt && now - item.submittedAt > THREE_DAYS) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      if (!isMounted) return;

      cleanExpiredProjects();

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/projects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const enriched = res.data.map((p) => ({
          ...p,
          submittedAt: Date.now(),
          email: p.email || '',
        }));

        Object.keys(localStorage)
          .filter((key) => key.startsWith('project_'))
          .forEach((key) => localStorage.removeItem(key));

        enriched.forEach((p) => {
          localStorage.setItem(`project_${p._id}`, JSON.stringify(p));
        });

        setProjects(enriched);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProjects = selectedBatch
    ? projects.filter((p) => p.batch === selectedBatch)
    : projects;

  const handleSendFeedback = (project) => {
    const provider = emailProvider[project._id] || 'gmail';
    const subject = `Feedback on ${project.title}`;
    const body = `Hi ${project.name},\n\n[Write your feedback here]\n\nRegards,\nTutor`;

    const email = project.email?.trim();
    if (!email) return;

    let url = '';
    switch (provider) {
      case 'gmail':
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
      case 'outlook':
        url = `https://outlook.live.com/owa/?path=/mail/action/compose&to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
      case 'yahoo':
        url = `https://compose.mail.yahoo.com/?to=${email}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        break;
      default:
        url = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }

    window.open(url, '_blank');
    setFeedbackSent((prev) => ({ ...prev, [project._id]: true }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-indigo-200 to-emerald-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Submitted Projects</h2>

        <div className="flex justify-center mb-6">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">All Batches</option>
            <option value="9.30 AM">9.30 AM</option>
            <option value="10.00 AM">10.00 AM</option>
            <option value="11.00 AM">11.00 AM</option>
            <option value="12.30 PM">12.30 PM</option>
            <option value="1.00 PM">1.00 PM</option>
            <option value="6.00 PM">6.00 PM</option>
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading projects...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.length === 0 ? (
              <p className="text-gray-500 text-center col-span-full">No projects found for this batch.</p>
            ) : (
              filteredProjects.map((project) => {
                const fileUrl = `${import.meta.env.VITE_API_BASE_URL}/uploads/${project.filePath}`;
                const fileExtension = project.filePath?.split('.').pop()?.toLowerCase();
                const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);

                return (
                  <div
                    key={project._id}
                    className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition duration-300"
                  >
                    <h3 className="text-xl font-semibold text-indigo-600 mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-700 mb-1">{project.name}</p>
                    <p className="text-sm text-gray-700 mb-1">Batch: {project.batch}</p>
                    <p className="text-sm text-gray-700 mb-1">{project.email || 'Not available'}</p>
                    <p className="text-gray-800 mb-3 text-sm">
                      {project.description.length > 100
                        ? `${project.description.slice(0, 100)}...`
                        : project.description}
                    </p>

{project.files?.map((file, idx) => {
  const fileUrl = file.fileUrl;
  const ext = fileUrl?.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

  return (
    <div key={idx} className="mb-2">
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        {isImage ? (
          <img
            src={fileUrl}
            alt={file.fileName}
            className="w-full h-auto rounded-lg border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/default.png';
            }}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-32 flex items-center justify-center bg-gray-100 border rounded text-sm text-gray-600">
            📄 {file.fileName}
          </div>
        )}
        <p className="text-sm text-blue-600 underline text-center">Click to view</p>
      </a>
    </div>
  );
})}
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm block mb-2"
                      >
                        View Project Link
                      </a>
                    )}

                    {project.email?.trim() ? (
                      !feedbackSent[project._id] ? (
                        <div className="mt-3">
                          <select
                            value={emailProvider[project._id] || 'gmail'}
                            onChange={(e) =>
                              setEmailProvider((prev) => ({
                                ...prev,
                                [project._id]: e.target.value,
                              }))
                            }
                            className="mb-2 px-3 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-indigo-300"
                          >
                            <option value="gmail">Gmail</option>
                            <option value="outlook">Outlook</option>
                            <option value="yahoo">Yahoo Mail</option>
                          </select>
                          <button
                            onClick={() => handleSendFeedback(project)}
                            className="bg-emerald-600 text-white px-4 py-1 m-2 rounded text-sm hover:bg-emerald-700 transition"
                          >
                            Send Feedback
                          </button>
                        </div>
                      ) : (
                        <span className="inline-block bg-gray-200 text-green-700 px-3 py-1 rounded text-sm mt-2">
                          Feedback Sent
                        </span>
                      )
                    ) : (
                      <p className="text-red-500 text-sm mt-2">No email found for this student</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProject;
