// NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Page Not Found</h1>
        <p className="text-lg text-gray-700 mb-6">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link 
          to="/" 
          className="text-xl text-blue-600 hover:text-blue-800 transition-colors"
        >
          Go back to Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
