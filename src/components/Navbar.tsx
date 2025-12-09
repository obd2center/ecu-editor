import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Settings, Wrench, Upload, FileCode, Download } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <Wrench className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">OBD2 Center</span>
              <span className="text-xs text-cyan-400">Limited</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/services"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/services')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Services
            </Link>
            <Link
              to="/upload"
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                isActive('/upload')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </Link>
            <Link
              to="/files"
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                isActive('/files')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Files</span>
            </Link>
            <Link
              to="/download"
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                isActive('/download')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Link>
            <Link
              to="/admin"
              className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                isActive('/admin')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/services"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/services')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Services
            </Link>
            <Link
              to="/upload"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/upload')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </Link>
            <Link
              to="/files"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/files')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Files</span>
            </Link>
            <Link
              to="/download"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/download')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/admin')
                  ? 'bg-cyan-400 text-slate-900 font-semibold'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
