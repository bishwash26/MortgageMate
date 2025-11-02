import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Home, User, Bell } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    MortgageMate
                  </h1>
                  <p className="text-xs text-purple-300 -mt-1">AI Mortgage Consultant</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'bg-purple-600/30 text-purple-200 shadow-lg backdrop-blur-sm border border-purple-400/30'
                    : 'text-purple-300 hover:text-white hover:bg-purple-600/20 hover:backdrop-blur-sm'
                }`}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Consultant
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 text-purple-300 hover:text-white hover:bg-purple-600/20 rounded-lg transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}