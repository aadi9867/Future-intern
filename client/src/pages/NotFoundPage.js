import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>
      <p className="text-xl text-gray-700 dark:text-gray-200 mb-6">Page Not Found</p>
      <Link to="/" className="px-6 py-2 rounded-full bg-blue-600 text-white font-bold shadow-lg hover:scale-105 hover:bg-blue-700 transition-all duration-300">
        Go Home
      </Link>
    </div>
  );
} 