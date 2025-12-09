import { Link } from 'react-router-dom';
import { ArrowLeft, Wrench, Zap, Settings, Rocket, CheckCircle2 } from 'lucide-react';

const platformsData = [
  {
    icon: Wrench,
    name: 'EDC17CP11',
    era: 'Early Generation',
    years: '2004-2009',
    formula: '128KB EEPROM',
    gradient: 'from-cyan-500 to-blue-500',
    vehicles: [
      'Range Rover Sport (2005-2009)',
      'Range Rover L322 (2006-2009)',
      'Discovery 3 (2004-2009)',
      'Discovery 4 (2009)',
      'Freelander 2 (2006-2009)',
    ],
    features: [
      'Complete EEPROM programming',
      'VIN synchronization',
      'Immobilizer adaptation',
      'Diagnostic fault clearing',
      'Full backup & restore',
    ],
  },
  {
    icon: Zap,
    name: 'EDC17CP42',
    era: 'Mid Generation',
    years: '2010-2016',
    formula: '128KB EEPROM',
    gradient: 'from-blue-500 to-purple-500',
    vehicles: [
      'Range Rover Sport (2010-2013)',
      'Range Rover L322 (2010-2012)',
      'Range Rover L405 (2013-2016)',
      'Discovery 4 (2010-2016)',
      'Range Rover Evoque (2011-2015)',
    ],
    features: [
      'Advanced EEPROM calibration',
      'ECU cloning support',
      'Adaptive learning reset',
      'Full diagnostic coverage',
      'Performance optimization',
    ],
  },
  {
    icon: Settings,
    name: 'EDC17CP55',
    era: 'Modern Generation',
    years: '2016-2020',
    formula: '256KB EEPROM',
    gradient: 'from-purple-500 to-pink-500',
    vehicles: [
      'Range Rover Sport (2014-2020)',
      'Range Rover L405 (2017-2020)',
      'Discovery 5 (2017-2020)',
      'Range Rover Velar (2017-2020)',
      'Jaguar F-PACE (2016-2020)',
      'Jaguar XE (2015-2020)',
      'Jaguar XF (2015-2020)',
    ],
    features: [
      'Extended EEPROM capacity',
      'Advanced security protocols',
      'Multi-protocol support',
      'Component coding',
      'Configuration management',
    ],
  },
  {
    icon: Rocket,
    name: 'MEDC17.9',
    era: 'Latest Generation',
    years: '2018-2024',
    formula: '192KB EEPROM',
    gradient: 'from-pink-500 to-red-500',
    vehicles: [
      'Range Rover Sport (2020-2024)',
      'Range Rover L460 (2022-2024)',
      'Defender L663 (2020-2024)',
      'Discovery Sport (2019-2024)',
      'Range Rover Evoque (2019-2024)',
    ],
    features: [
      'Next-gen EEPROM programming',
      'Hybrid system support',
      'Advanced diagnostics',
      'Remote calibration ready',
      'Future-proof architecture',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ECU Services
          </h1>
          <p className="text-xl text-gray-400">
            Professional programming and calibration for all Jaguar Land Rover platforms
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 md:p-8 border border-cyan-400/20 mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-400/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">ECU Identification Formula Reference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformsData.map((platform) => (
              <div
                key={platform.name}
                className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700"
              >
                <div className="text-sm text-gray-400 mb-1">{platform.name}</div>
                <div className="text-lg font-mono font-bold text-cyan-400">{platform.formula}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {platformsData.map((platform) => {
            const Icon = platform.icon;
            return (
              <div
                key={platform.name}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-400/50 transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${platform.gradient}`} />

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${platform.gradient} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                          {platform.name}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
                            {platform.era}
                          </span>
                          <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-gray-300">
                            {platform.years}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded-xl px-4 py-3">
                      <div className="text-xs text-gray-400 mb-1">EEPROM Formula</div>
                      <div className="text-xl font-mono font-bold text-cyan-400">
                        {platform.formula}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                        Supported Vehicles
                      </h4>
                      <ul className="space-y-2">
                        {platform.vehicles.map((vehicle) => (
                          <li
                            key={vehicle}
                            className="flex items-center space-x-2 text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span>{vehicle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-2" />
                        Service Features
                      </h4>
                      <ul className="space-y-2">
                        {platform.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-center space-x-2 text-gray-300"
                          >
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-700 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Standard service price
                    </div>
                    <div className="text-2xl font-bold text-white">
                      $50 <span className="text-base text-gray-400">USD</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-400/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Need Help?</h3>
            <p className="text-gray-400 mb-6">
              Contact us for professional ECU services and technical support
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all duration-300"
            >
              <span className="text-slate-900 font-semibold">Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
