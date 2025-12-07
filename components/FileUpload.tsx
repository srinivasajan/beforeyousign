'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export default function FileUpload({ onFileSelect, isAnalyzing }: FileUploadProps) {
  const [error, setError] = useState<string>('');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('');
      
      if (acceptedFiles.length === 0) {
        setError('Please upload a valid PDF, DOCX, or TXT file');
        return;
      }

      const file = acceptedFiles[0];
      const maxSize = parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760');

      if (file.size > maxSize) {
        setError(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
        return;
      }

      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 bg-white p-20 text-center cursor-pointer overflow-hidden
          transition-all duration-300 ease-in-out group
          ${isDragActive ? 'border-stone-900 bg-stone-50 scale-[1.02]' : 'border-stone-300 hover:border-stone-900 hover:shadow-sm'}
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="flex flex-col items-center gap-6">
          {acceptedFiles.length > 0 && !isAnalyzing ? (
            <>
              <div className="relative">
                <FileText className="w-20 h-20 text-stone-900" />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-stone-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-semibold text-stone-900 mb-2">
                  {acceptedFiles[0].name}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="mono text-sm text-stone-500">
                    {(acceptedFiles[0].size / 1024).toFixed(2)} KB
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Ready for Analysis</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <Upload className={`w-20 h-20 transition-all duration-300 ${
                  isDragActive ? 'text-stone-900 scale-110' : 'text-stone-400 group-hover:text-stone-700'
                }`} />
                <div className="absolute inset-0 border-2 border-dashed border-stone-300 rounded-full group-hover:border-stone-900 transition-colors duration-300 scale-150"></div>
              </div>
              <div>
                <p className="text-3xl font-bold text-stone-900 mb-4 group-hover:text-stone-700 transition-colors">
                  {isDragActive ? 'Release to Upload' : 'Submit Contract for Analysis'}
                </p>
                <p className="text-stone-600 mb-4 font-light text-lg">
                  Drag and drop document or click to select
                </p>
                <div className="flex items-center justify-center gap-4">
                  <span className="mono text-xs text-stone-500 uppercase tracking-wider font-medium">PDF</span>
                  <span className="text-stone-300">•</span>
                  <span className="mono text-xs text-stone-500 uppercase tracking-wider font-medium">DOCX</span>
                  <span className="text-stone-300">•</span>
                  <span className="mono text-xs text-stone-500 uppercase tracking-wider font-medium">TXT</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500 font-medium">Max 10MB</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-5 bg-white border-2 border-stone-900 flex items-start gap-4 animate-slide-in">
          <AlertCircle className="w-5 h-5 text-stone-900 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1">Upload Error</p>
            <p className="text-sm text-stone-800 font-medium leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
