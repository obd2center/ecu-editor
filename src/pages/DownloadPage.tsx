import { Download, Code, FileArchive, CheckCircle } from 'lucide-react';

export default function DownloadPage() {
  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Code className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">
            Download Source Code
          </h1>
          <p className="text-xl text-gray-300">
            Get the complete ECU VIN Editor source code
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-center mb-6">
              <FileArchive className="w-20 h-20 text-cyan-400" />
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-4">
              ECU VIN Editor Source
            </h2>

            <div className="bg-slate-900 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Package Contents:</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Complete React + TypeScript application</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Supabase database integration & migrations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">File upload & VIN editing functionality</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Admin dashboard & order management</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">Tailwind CSS styling & responsive design</span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <a
                href="/ecu-vin-editor-source.tar.gz"
                download
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/50"
              >
                <Download className="w-6 h-6" />
                <span>Download Source Code</span>
              </a>
              <p className="text-gray-400 text-sm mt-4">
                Compressed archive (tar.gz format)
              </p>
            </div>
          </div>

          <div className="bg-slate-900 px-8 py-6 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Getting Started:</h3>
            <div className="space-y-2 text-gray-300 font-mono text-sm">
              <p className="text-cyan-400"># Extract the archive</p>
              <p>tar -xzf ecu-vin-editor-source.tar.gz</p>
              <p className="text-cyan-400 mt-4"># Install dependencies</p>
              <p>npm install</p>
              <p className="text-cyan-400 mt-4"># Start development server</p>
              <p>npm run dev</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2">
            <Code className="w-5 h-5 text-blue-400" />
            <span>Requirements</span>
          </h3>
          <ul className="text-gray-300 space-y-1 ml-7">
            <li>Node.js 18+ and npm</li>
            <li>Supabase account for database</li>
            <li>Modern web browser</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
