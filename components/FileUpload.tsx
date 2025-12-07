'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';

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
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          {acceptedFiles.length > 0 && !isAnalyzing ? (
            <>
              <FileText className="w-16 h-16 text-green-500" />
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {acceptedFiles[0].name}
                </p>
                <p className="text-sm text-gray-500">
                  {(acceptedFiles[0].size / 1024).toFixed(2)} KB
                </p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {isDragActive ? 'Drop your contract here' : 'Upload your contract'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Drag & drop or click to browse
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF, DOCX, and TXT files (max 10MB)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
