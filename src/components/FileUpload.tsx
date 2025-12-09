import { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2, Car, Cpu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { validateBinFile, analyzeFile, formatFileSize, ECUPlatform } from '../lib/fileUtils';

interface FileUploadProps {
  onUploadComplete?: () => void;
}

interface AnalysisResult {
  file: File;
  vin: string | null;
  possiblePlatforms: ECUPlatform[];
  platform: ECUPlatform | null;
  size: number;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [manualVIN, setManualVIN] = useState('');
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileAnalyze(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileAnalyze(files[0]);
    }
  };

  const handleFileAnalyze = async (file: File) => {
    setUploadStatus({ type: null, message: '' });
    setAnalysisResult(null);
    setSelectedPlatform(null);
    setManualVIN('');

    const validation = validateBinFile(file);
    if (!validation.valid) {
      setUploadStatus({ type: 'error', message: validation.error || 'Invalid file' });
      return;
    }

    setAnalyzing(true);

    try {
      const analysis = await analyzeFile(file);

      setAnalysisResult({
        file,
        vin: analysis.vin,
        possiblePlatforms: analysis.possiblePlatforms,
        platform: analysis.platform,
        size: analysis.size,
      });

      if (analysis.possiblePlatforms.length === 1) {
        setSelectedPlatform(analysis.possiblePlatforms[0].name);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setUploadStatus({
        type: 'error',
        message: 'Failed to analyze file. Please try again.',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!analysisResult || !selectedPlatform) return;

    setUploading(true);
    setUploadStatus({ type: null, message: '' });

    try {
      const filePath = `${Date.now()}-${analysisResult.file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('ecu-files')
        .upload(filePath, analysisResult.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const selectedPlatformData = analysisResult.possiblePlatforms.find(
        (p) => p.name === selectedPlatform
      );

      const finalVIN = manualVIN.trim() || analysisResult.vin;

      const { error: dbError } = await supabase.from('ecu_files').insert({
        file_name: analysisResult.file.name,
        file_size: analysisResult.file.size,
        file_path: filePath,
        platform: selectedPlatform,
        eeprom_size: selectedPlatformData?.formula || null,
        vin: finalVIN,
        status: 'processed',
        metadata: {
          originalName: analysisResult.file.name,
          uploadedAt: new Date().toISOString(),
          detectedPlatform: selectedPlatform,
          detectedVIN: analysisResult.vin,
          manualVIN: manualVIN.trim() || null,
        },
      });

      if (dbError) throw dbError;

      setUploadStatus({
        type: 'success',
        message: `File uploaded successfully! Platform: ${selectedPlatform}${
          finalVIN ? ` | VIN: ${finalVIN}` : ''
        }`,
      });

      setAnalysisResult(null);
      setSelectedPlatform(null);
      setManualVIN('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({
        type: 'error',
        message: 'Failed to upload file. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setAnalysisResult(null);
    setSelectedPlatform(null);
    setManualVIN('');
    setUploadStatus({ type: null, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!analysisResult ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 ${
            isDragging
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-slate-700 hover:border-slate-600'
          } ${analyzing ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".bin"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="w-20 h-20 rounded-full bg-cyan-400/10 flex items-center justify-center mb-4">
              {analyzing ? (
                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
              ) : (
                <Upload className="w-10 h-10 text-cyan-400" />
              )}
            </div>

            <h3 className="text-xl font-semibold text-white mb-2">
              {analyzing ? 'Analyzing File...' : 'Upload ECU Bin File'}
            </h3>

            <p className="text-gray-400 text-center mb-4">
              Drag and drop your file here, or click to browse
            </p>

            <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
              <span className="px-3 py-1 bg-slate-800 rounded-full">.bin only</span>
            </div>

            <p className="text-xs text-cyan-400 mt-2">Binary ECU dumps</p>

            <p className="text-xs text-gray-500 mt-4">Maximum file size: 50MB</p>
          </label>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">File Analysis Results</h3>

          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">File Name</div>
              <div className="text-white font-semibold">{analysisResult.file.name}</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">File Size</div>
              <div className="text-white font-semibold">{formatFileSize(analysisResult.size)}</div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Car className="w-5 h-5 text-cyan-400" />
                <div className="text-sm text-gray-400">VIN / Chassis Number</div>
              </div>

              {analysisResult.vin && !manualVIN ? (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 mb-3">
                  <div className="text-sm text-green-400 mb-1">Auto-detected VIN:</div>
                  <div className="text-xl font-mono font-bold text-green-400">
                    {analysisResult.vin}
                  </div>
                </div>
              ) : !analysisResult.vin && !manualVIN ? (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <div className="text-sm text-yellow-400">VIN not detected - please enter manually</div>
                  </div>
                </div>
              ) : null}

              <div>
                <label htmlFor="manual-vin" className="block text-sm text-gray-400 mb-2">
                  {analysisResult.vin ? 'Override with manual VIN (optional):' : 'Enter VIN manually:'}
                </label>
                <input
                  id="manual-vin"
                  type="text"
                  value={manualVIN}
                  onChange={(e) => setManualVIN(e.target.value.toUpperCase())}
                  maxLength={17}
                  placeholder="Enter 17-character VIN"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white font-mono text-lg focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <div className="text-xs text-gray-500 mt-2">
                  {manualVIN.length}/17 characters
                </div>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <div className="text-sm text-gray-400">Select ECU Platform</div>
              </div>

              {analysisResult.possiblePlatforms.length === 0 ? (
                <div className="text-red-400 text-sm">
                  No matching platforms found for this file size
                </div>
              ) : analysisResult.possiblePlatforms.length === 1 ? (
                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-3">
                  <div className="text-cyan-400 font-semibold">
                    {analysisResult.possiblePlatforms[0].name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {analysisResult.possiblePlatforms[0].formula}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {analysisResult.possiblePlatforms.map((platform) => (
                    <label
                      key={platform.name}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedPlatform === platform.name
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="platform"
                          value={platform.name}
                          checked={selectedPlatform === platform.name}
                          onChange={(e) => setSelectedPlatform(e.target.value)}
                          className="w-4 h-4 text-cyan-400"
                        />
                        <div>
                          <div className="text-white font-semibold">{platform.name}</div>
                          <div className="text-sm text-gray-400">{platform.formula}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleConfirmUpload}
              disabled={!selectedPlatform || uploading}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                !selectedPlatform || uploading
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-400 hover:bg-cyan-300 text-slate-900'
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm & Upload</span>
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {uploadStatus.type && (
        <div
          className={`mt-4 p-4 rounded-xl flex items-start space-x-3 ${
            uploadStatus.type === 'success'
              ? 'bg-green-500/10 border border-green-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <p
            className={`text-sm ${
              uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {uploadStatus.message}
          </p>
        </div>
      )}
    </div>
  );
}
