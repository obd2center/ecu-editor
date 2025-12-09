import { useState, useRef } from 'react';
import { Upload, Download, Check, X } from 'lucide-react';
import { validateBinFile, formatFileSize, extractAllVINs, writeVINToBuffer, VINLocation } from '../lib/fileUtils';

export default function VINEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [allVINLocations, setAllVINLocations] = useState<VINLocation[]>([]);
  const [currentVIN, setCurrentVIN] = useState('');
  const [editedVIN, setEditedVIN] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showVINSelectionModal, setShowVINSelectionModal] = useState(false);
  const [uniqueVINs, setUniqueVINs] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info' | null; message: string }>({
    type: null,
    message: '',
  });
  const [isDragging, setIsDragging] = useState(false);
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
      handleFileLoad(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileLoad(files[0]);
    }
  };

  const handleFileLoad = async (selectedFile: File) => {
    setStatus({ type: null, message: '' });

    const validation = validateBinFile(selectedFile);
    if (!validation.valid) {
      setStatus({ type: 'error', message: validation.error || 'Invalid file' });
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      setFileBuffer(buffer);

      const detectedVINs = extractAllVINs(buffer);
      setAllVINLocations(detectedVINs);

      if (detectedVINs.length === 0) {
        setStatus({
          type: 'error',
          message: 'No VINs detected in this file.',
        });
        return;
      }

      const unique = Array.from(new Set(detectedVINs.map(v => v.vin)));
      setUniqueVINs(unique);

      if (unique.length === 1) {
        setCurrentVIN(unique[0]);
        setEditedVIN(unique[0]);
        setStatus({
          type: 'success',
          message: `Found VIN in ${detectedVINs.length} location${detectedVINs.length > 1 ? 's' : ''}. All VINs match.`,
        });
      } else {
        setShowVINSelectionModal(true);
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSelectVINFromModal = (selectedVIN: string) => {
    setCurrentVIN(selectedVIN);
    setEditedVIN(selectedVIN);
    setShowVINSelectionModal(false);
    setStatus({
      type: 'info',
      message: `Selected VIN: ${selectedVIN}. Found ${allVINLocations.length} VIN location${allVINLocations.length > 1 ? 's' : ''} in file.`,
    });
  };

  const handleStartEdit = () => {
    setEditedVIN(currentVIN);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedVIN(currentVIN);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (editedVIN.length !== 17) {
      setStatus({ type: 'error', message: 'VIN must be exactly 17 characters' });
      return;
    }

    if (!fileBuffer) return;

    try {
      let newBuffer = fileBuffer;

      for (const vinLocation of allVINLocations) {
        newBuffer = writeVINToBuffer(newBuffer, editedVIN, vinLocation.offset);
      }

      setFileBuffer(newBuffer);
      setCurrentVIN(editedVIN);
      setIsEditing(false);

      setStatus({
        type: 'success',
        message: `VIN updated in all ${allVINLocations.length} location${allVINLocations.length > 1 ? 's' : ''}. Download to save changes.`,
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to update VIN',
      });
    }
  };

  const handleDownload = () => {
    if (!fileBuffer || !file) return;

    const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.([^.]+)$/, '_modified.$1');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatus({ type: 'success', message: 'File downloaded successfully!' });
  };

  const handleReset = () => {
    setFile(null);
    setFileBuffer(null);
    setAllVINLocations([]);
    setCurrentVIN('');
    setEditedVIN('');
    setIsEditing(false);
    setShowVINSelectionModal(false);
    setUniqueVINs([]);
    setStatus({ type: null, message: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-400/10'
                : 'border-slate-600 hover:border-cyan-400/50'
            }`}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-slate-700/50 rounded-full">
                <Upload className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload ECU File</h3>
                <p className="text-gray-400 mb-4">Drag and drop your file here, or click to browse</p>
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
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold cursor-pointer hover:from-cyan-600 hover:to-blue-600 transition-all inline-block"
                >
                  Open File
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{file.name}</h3>
                  <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                >
                  Open New File
                </button>
              </div>

              {status.message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    status.type === 'success'
                      ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                      : status.type === 'error'
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                      : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                  }`}
                >
                  {status.message}
                </div>
              )}

              {currentVIN && (
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-400 mb-2">VIN:</label>
                      {isEditing ? (
                        <div>
                          <input
                            type="text"
                            value={editedVIN}
                            onChange={(e) => setEditedVIN(e.target.value.toUpperCase())}
                            maxLength={17}
                            className="w-full px-4 py-3 bg-slate-800 border-2 border-cyan-400 rounded-lg text-white font-mono text-2xl focus:outline-none focus:border-cyan-300 transition-colors"
                            autoFocus
                          />
                          <div className="text-sm text-gray-400 mt-2">{editedVIN.length}/17 characters</div>
                        </div>
                      ) : (
                        <div className="text-3xl font-mono font-bold text-white bg-slate-800 px-4 py-3 rounded-lg">
                          {currentVIN}
                        </div>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveEdit}
                          disabled={editedVIN.length !== 17}
                          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
                        >
                          <Check className="w-5 h-5 mr-2" />
                          Save VIN
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-semibold flex items-center justify-center"
                        >
                          <X className="w-5 h-5 mr-2" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartEdit}
                        className="w-full px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
                      >
                        VIN Change
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2 text-lg"
                  >
                    <Download className="w-6 h-6" />
                    <span>Save File</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showVINSelectionModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Multiple VINs Detected</h2>
            <p className="text-gray-400 mb-6">
              Found {allVINLocations.length} VIN location{allVINLocations.length > 1 ? 's' : ''} with {uniqueVINs.length} different value{uniqueVINs.length > 1 ? 's' : ''}. Which VIN is correct?
            </p>

            <div className="space-y-3">
              {uniqueVINs.map((vin, index) => {
                const count = allVINLocations.filter(v => v.vin === vin).length;
                const locations = allVINLocations.filter(v => v.vin === vin);

                return (
                  <div
                    key={index}
                    onClick={() => handleSelectVINFromModal(vin)}
                    className="p-4 border-2 border-slate-600 hover:border-cyan-400 bg-slate-700/50 hover:bg-cyan-400/10 rounded-xl cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-2xl font-mono font-bold text-white group-hover:text-cyan-400">
                        {vin}
                      </div>
                      <div className="text-sm text-gray-400">
                        {count} location{count > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {locations.map(loc => loc.offsetHex).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
