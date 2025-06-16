
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, ZoomIn } from 'lucide-react';

interface FilePreviewProps {
  file: {
    name: string;
    type: string;
    url: string;
    size?: number;
  };
  onDownload: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onDownload }) => {
  const [showModal, setShowModal] = useState(false);

  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isImage) {
    return (
      <>
        <div className="relative inline-block">
          <img
            src={file.url}
            alt={file.name}
            className="max-w-xs max-h-48 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowModal(true)}
          />
          <Button
            size="sm"
            onClick={() => setShowModal(true)}
            className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
            <div className="relative max-w-4xl max-h-full p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={file.url}
                alt={file.name}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg max-w-sm">
      <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center">
        <span className="text-white text-xs font-bold">
          {isPdf ? 'PDF' : file.name.split('.').pop()?.toUpperCase() || 'FILE'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{file.name}</p>
        {file.size && (
          <p className="text-gray-400 text-xs">{formatFileSize(file.size)}</p>
        )}
      </div>
      <Button
        size="sm"
        onClick={onDownload}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2"
      >
        <Download className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default FilePreview;
