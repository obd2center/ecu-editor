import { Link } from 'react-router-dom';
import { Wrench, Zap, Settings, Rocket, ArrowRight } from 'lucide-react';

const platforms = [
  {
    icon: Wrench,
    name: 'EDC17CP11',
    formula: '128KB EEPROM',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Zap,
    name: 'EDC17CP42',
    formula: '128KB EEPROM',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: Settings,
    name: 'EDC17CP55',
    formula: '256KB EEPROM',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Rocket,
    name: 'MEDC17.9',
    formula: '192KB EEPROM',
    gradient: 'from-pink-500 to-red-500',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDYsIDE4MiwgMjEyLCAwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
              <span className="text-cyan-400 text-sm font-semibold">Professional ECU Services</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Complete Jaguar Land Rover
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ECU Coverage
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert ECU programming and calibration services for Jaguar Land Rover vehicles
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl">
                <div className="text-sm text-slate-900 font-semibold">Standard Price</div>
                <div className="text-3xl font-bold text-slate-900">$50 USD</div>
              </div>
              <Link
                to="/services"
                className="group px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all duration-300 flex items-center space-x-2 border border-cyan-400/20"
              >
                <span className="text-white font-semibold">View Services</span>
                <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Supported Platforms
          </h2>
          <p className="text-gray-400">Industry-leading ECU coverage with verified formulas</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 hover:border-cyan-400/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                <div className="relative space-y-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{platform.name}</h3>
                    <p className="text-sm text-gray-400">ECU Platform</p>
                  </div>

                  <div className="pt-4 border-t border-slate-700">
                    <div className="text-sm text-gray-400 mb-1">EEPROM Formula</div>
                    <div className="text-lg font-mono font-bold text-cyan-400">{platform.formula}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex items-center justify-center space-x-8 px-8 py-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">4</div>
              <div className="text-sm text-gray-400 mt-1">Verified Platforms</div>
            </div>
            <div className="h-12 w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">21+</div>
              <div className="text-sm text-gray-400 mt-1">Vehicle Models</div>
            </div>
            <div className="h-12 w-px bg-slate-700" />
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">2004-2024</div>
              <div className="text-sm text-gray-400 mt-1">Year Coverage</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Ready to get started?</h3>
              <p className="text-gray-400">Professional ECU services for your vehicle</p>
            </div>
            <Link
              to="/services"
              className="group px-8 py-4 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all duration-300 flex items-center space-x-2"
            >
              <span className="text-slate-900 font-bold">Explore Services</span>
              <ArrowRight className="w-5 h-5 text-slate-900 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
