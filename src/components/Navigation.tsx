import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Settings } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Bank Policy Assistant</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat Interface
              </Link>
              {/* <Link
                to="/admin"
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Link> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}