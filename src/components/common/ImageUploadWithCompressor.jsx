// src/components/common/ImageUploadWithCompressor.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressImage } from '../../utils/imageCompressor';
import { Upload, X, CheckCircle, Image as ImageIcon, Loader2 } from 'lucide-react';
import { formatBytes } from '../../utils/helpers';

// Helper to format bytes locally if helper is missing or different
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ImageUploadWithCompressor = ({ 
  onUploadReady, 
  multiple = false, 
  maxFiles = 10,
  accept = 'image/*',
  className = '' 
}) => {
  const [compressing, setCompressing] = useState(false);
  const [fileList, setFileList] = useState([]); // Array of { originalName, originalSize, compressedSize, previewUrl, blob }

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setCompressing(true);
    const newFiles = [];
    
    const limit = multiple ? Math.min(acceptedFiles.length, maxFiles - fileList.length) : 1;
    
    for (let i = 0; i < limit; i++) {
      const file = acceptedFiles[i];
      try {
        const result = await compressImage(file);
        newFiles.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          originalName: file.name,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          previewUrl: result.previewUrl,
          blob: result.blob
        });
      } catch (err) {
        console.error('Compression error for file ' + file.name + ':', err);
      }
    }

    const updatedList = multiple ? [...fileList, ...newFiles] : newFiles;
    setFileList(updatedList);
    setCompressing(false);
    
    // Send to parent component
    if (multiple) {
      onUploadReady(updatedList.map(f => ({ blob: f.blob, name: f.originalName })));
    } else {
      if (updatedList.length > 0) {
        onUploadReady(updatedList[0].blob, updatedList[0].originalName);
      } else {
        onUploadReady(null, null);
      }
    }
  }, [fileList, multiple, maxFiles, onUploadReady]);

  const removeFile = (id) => {
    const updated = fileList.filter(f => f.id !== id);
    setFileList(updated);
    
    // Revoke object URL to avoid memory leak
    const removed = fileList.find(f => f.id === id);
    if (removed) URL.revokeObjectURL(removed.previewUrl);

    if (multiple) {
      onUploadReady(updated.map(f => ({ blob: f.blob, name: f.originalName })));
    } else {
      onUploadReady(null, null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: accept === 'image/*' ? { 'image/*': [] } : accept,
    disabled: compressing || (!multiple && fileList.length > 0)
  });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropzone Area */}
      {(!multiple && fileList.length > 0) ? null : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-gold bg-gold/5' 
              : 'border-white/10 hover:border-gold/50 bg-white/5'
          } ${compressing ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3 font-body text-champagne/60">
            {compressing ? (
              <>
                <Loader2 className="w-10 h-10 text-gold animate-spin" />
                <p className="text-sm font-semibold">Compressing & optimizing image(s)...</p>
              </>
            ) : (
              <>
                <Upload className="w-10 h-10 text-gold/80 group-hover:text-gold" />
                <p className="text-sm font-semibold">
                  {isDragActive ? 'Drop files here...' : 'Drag & drop image(s), or click to browse'}
                </p>
                <p className="text-[11px] text-champagne/40">
                  JPEG, PNG, WEBP and GIF supported (Auto-optimized to under 300KB)
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Previews List */}
      {fileList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fileList.map((file) => {
            const sizeReduction = Math.max(
              0,
              Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100)
            );
            return (
              <div 
                key={file.id} 
                className="flex items-center space-x-3 bg-white/5 border border-white/5 rounded-xl p-3 relative group animate-scaleIn"
              >
                <img 
                  src={file.previewUrl} 
                  alt="preview" 
                  className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0" 
                />
                <div className="min-w-0 flex-1 text-left font-body">
                  <p className="text-xs font-bold text-champagne truncate pr-6">{file.originalName}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-champagne/40 line-through">
                      {formatFileSize(file.originalSize)}
                    </span>
                    <span className="text-[10px] text-gold font-bold">
                      {formatFileSize(file.compressedSize)}
                    </span>
                    {sizeReduction > 0 && (
                      <span className="text-[9px] bg-emerald/15 text-emerald border border-emerald/20 px-1.5 py-0.5 rounded-full font-semibold">
                        -{sizeReduction}%
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center text-[9px] text-emerald mt-1 font-semibold">
                    <CheckCircle className="w-3 h-3 mr-1 text-emerald" /> Optimized ✓
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 p-1 rounded-full bg-white/5 text-champagne/50 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageUploadWithCompressor;
