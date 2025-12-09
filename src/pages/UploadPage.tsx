import { Link } from 'react-router-dom';
import { ArrowLeft, FileCode, Wrench, Zap, Settings, Rocket } from 'lucide-react';
import VINEditor from '../components/VINEditor';
import { ECU_PLATFORMS } from '../lib/fileUtils';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              VIN Editor
            </h1>
          </div>
          <p className="text-xl text-gray-400">
            Read, edit, and write VIN numbers in ECU bin files
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 md:p-8 mb-8">
          <VINEditor />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/20">
            <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
            <ol className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <span>Upload your ECU bin file using drag-and-drop or file selector</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <span>System scans the file and displays all detected VIN numbers</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <span>Select a VIN from the list and click Edit to modify it</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <span>Download the modified file with the new VIN written to it</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/20">
            <h3 className="text-xl font-bold text-white mb-4">Supported Formats</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                  <FileCode className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="text-white font-semibold">.bin files</div>
                  <div className="text-sm text-gray-400">Binary ECU dumps only</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Settings className="w-5 h-5 text-cyan-400 mr-2" />
            Platform Detection Reference
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(ECU_PLATFORMS).map(([key, platform]) => {
              const icons = [Wrench, Zap, Settings, Rocket];
              const Icon = icons[Object.keys(ECU_PLATFORMS).indexOf(key) % icons.length];

              return (
                <div
                  key={key}
                  className="bg-slate-700/50 rounded-xl p-4 border border-slate-600"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="font-mono font-bold text-white">{platform.name}</div>
                  </div>
                  <div className="text-sm text-gray-400">
                    File Size: <span className="text-cyan-400 font-semibold">{(platform.eepromSize / 1024).toFixed(0)} KB</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Formula: <span className="text-cyan-400 font-semibold">{platform.formula}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
