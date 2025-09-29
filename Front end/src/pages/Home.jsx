import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center 
    bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80')]">
      <div className="text-center p-8 max-w-md rounded-lg shadow-lg bg-white/10 
       backdrop-blur-md border border-white/30">
        <h2 className="text-2xl font-bold text-white mb-4">
          Welcome to the Skill Bridge
        </h2>
        <p className="text-white mb-6">
          Submit your project details, share your work, and let tutors review your progress.
        </p>
      </div>
    </div>
  );
};

export default Home;
