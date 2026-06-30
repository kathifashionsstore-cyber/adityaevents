// src/components/common/ImageUploadWithCompressor.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { compressAndConvertToWebP, uploadToImgBB } from '../../utils/imagePipeline';
import { Upload, X, CheckCircle, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper to format bytes locally
const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const ImageUploadWithCompressor = ({ 
  onUploadSuccess,
  onUploadStart,
  onUploadError,
  currentImageUrl = '',
  multiple = false,
  maxFiles = 10,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [errorText, setErrorText] = useState('');
  
  // Single upload preview metadata
  const [uploadedUrl, setUploadedUrl] = useState(currentImageUrl);
  const [uploadStats, setUploadStats] = useState(null); // { originalSize, compressedSize }

  // Multiple upload list of uploaded items
  const [uploadedList, setUploadedList] = useState([]); // Array of { id, url, name, size }

  useEffect(() => {
    if (!multiple) {
      setUploadedUrl(currentImageUrl);
    }
  }, [currentImageUrl, multiple]);

  // Main file processing dropped callback
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    setLoading(true);
    setErrorText('');
    if (onUploadStart) onUploadStart();

    // Verify ImgBB Key is set in React Environment
    const apiKey = process.env.REACT_APP_IMGBB_API_KEY || window.env?.REACT_APP_IMGBB_API_KEY;
    if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY') {
      const errMsg = 'ImgBB API key is not set. Check REACT_APP_IMGBB_API_KEY in .env file.';
      setErrorText(errMsg);
      setLoading(false);
      if (onUploadError) onUploadError(new Error(errMsg));
      toast.error(errMsg);
      return;
    }

    try {
      if (multiple) {
        const urls = [...uploadedList.map(item => item.url)];
        const newList = [...uploadedList];

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          setStatusText(`Processing image ${i + 1}/${acceptedFiles.length}...`);
          
          const result = await compressAndConvertToWebP(file, (msg) => setStatusText(msg));
          setStatusText(`Uploading image ${i + 1}/${acceptedFiles.length} to ImgBB...`);
          
          const uploadRes = await uploadToImgBB(result.blob, result.name);
          
          const item = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            url: uploadRes.url,
            name: result.name,
            size: result.compressedSize
          };
          newList.push(item);
          urls.push(uploadRes.url);
        }

        setUploadedList(newList);
        onUploadSuccess(urls);
      } else {
        // Single upload flow
        const file = acceptedFiles[0];
        setStatusText('Analyzing file...');
        
        const result = await compressAndConvertToWebP(file, (msg) => setStatusText(msg));
        setStatusText('Uploading WebP to ImgBB...');
        
        const uploadRes = await uploadToImgBB(result.blob, result.name);
        
        setUploadedUrl(uploadRes.url);
        setUploadStats({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize
        });
        
        onUploadSuccess(uploadRes.url);
      }
    } catch (err) {
      console.error(err);
      setErrorText(err.message || 'Upload pipeline failed.');
      if (onUploadError) onUploadError(err);
      toast.error(err.message || 'Image processing failed.');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  }, [multiple, uploadedList, onUploadStart, onUploadError, onUploadSuccess]);

  const handleClearSingle = (e) => {
    e.stopPropagation();
    setUploadedUrl('');
    setUploadStats(null);
    onUploadSuccess('');
  };

  const handleRemoveMultiple = (id) => {
    const updated = uploadedList.filter(item => item.id !== id);
    setUploadedList(updated);
    onUploadSuccess(updated.map(item => item.url));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': []
    },
    disabled: loading
  });

  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* 1. Loader overlay / progress indicators */}
      {loading && (
        <div className="border border-gold/30 bg-gold/5 rounded-xl p-6 flex flex-col items-center justify-center space-y-3 animate-pulse">
          <Loader2 className="w-8 h-8 text-gold animate-spin" />
          <p className="font-body text-xs text-gold font-semibold tracking-wider uppercase">
            {statusText}
          </p>
        </div>
      )}

      {/* 2. Error Message banner */}
      {errorText && (
        <div className="border border-danger/30 bg-danger/5 rounded-xl p-4 flex items-center space-x-3 text-danger font-body text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* 3. Drag Drop Zone (rendered when empty for single, or always for multiple) */}
      {!loading && (!multiple && uploadedUrl ? null : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-gold bg-gold/5' 
              : 'border-white/10 hover:border-gold/50 bg-white/5'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3 font-body text-champagne/60">
            <Upload className="w-8 h-8 text-gold/80" />
            <p className="text-xs font-semibold">
              {isDragActive ? 'Drop files here...' : 'Drag & drop image(s), or click to browse'}
            </p>
            <p className="text-[10px] text-champagne/40">
              Supports JPEG, PNG, WEBP, and GIF (WebP 500KB Auto-Compression Pipeline)
            </p>
          </div>
        </div>
      ))}

      {/* 4. Single File Preview & stats */}
      {!loading && !multiple && uploadedUrl && (
        <div className="flex items-center space-x-4 bg-white/5 border border-white/15 rounded-xl p-3 relative group animate-scaleIn">
          <img 
            src={uploadedUrl} 
            alt="uploaded result" 
            className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0" 
          />
          <div className="min-w-0 flex-1 text-left font-body">
            <p className="text-xs font-bold text-champagne truncate">Upload successful</p>
            {uploadStats ? (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] text-champagne/40 line-through">
                  {formatFileSize(uploadStats.originalSize)}
                </span>
                <span className="text-[10px] text-gold font-bold">
                  {formatFileSize(uploadStats.compressedSize)} (WebP)
                </span>
                <span className="text-[9px] bg-emerald/15 text-emerald border border-emerald/20 px-1.5 py-0.5 rounded-full font-semibold">
                  -{Math.round(((uploadStats.originalSize - uploadStats.compressedSize) / uploadStats.originalSize) * 100)}%
                </span>
              </div>
            ) : (
              <p className="text-[9px] text-champagne/50 mt-0.5">Pre-existing image loaded</p>
            )}
            <span className="inline-flex items-center text-[9px] text-emerald mt-1 font-semibold">
              <CheckCircle className="w-3 h-3 mr-1 text-emerald" /> Hosted on ImgBB ✓
            </span>
          </div>

          <button
            type="button"
            onClick={handleClearSingle}
            className="absolute top-2 right-2 p-1 rounded-full bg-white/5 text-champagne/50 hover:text-danger hover:bg-danger/10 transition-all cursor-pointer"
            title="Remove Image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5. Multiple File Previews list */}
      {!loading && multiple && uploadedList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {uploadedList.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center space-x-3 bg-white/5 border border-white/5 rounded-xl p-3 relative animate-scaleIn"
            >
              <img 
                src={item.url} 
                alt={item.name} 
                className="w-12 h-12 rounded-lg object-cover border border-white/10 shrink-0" 
              />
              <div className="min-w-0 flex-1 text-left font-body">
                <p className="text-xs font-bold text-champagne truncate pr-6">{item.name}</p>
                <span className="text-[10px] text-gold font-semibold block mt-0.5">
                  {formatFileSize(item.size)} (WebP)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMultiple(item.id)}
                className="absolute top-2 right-2 p-1 rounded-full bg-white/5 text-champagne/50 hover:text-danger hover:bg-danger/10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ImageUploadWithCompressor;
