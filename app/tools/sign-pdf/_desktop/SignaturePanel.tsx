'use client';

import { useSignPdfContext } from '../_context/SignPdfContext';
import DrawSignature from './DrawSignature';
import TypeSignature from './TypeSignature';
import UploadSignature from './UploadSignature';

export default function SignaturePanel() {
  const {
    signatureMode,
    setSignatureMode,
    signatures,
    activeSignatureId,
    setActiveSignatureId,
    removeSignature,
  } = useSignPdfContext();

  const tabs = [
    {
      id: 'draw' as const,
      label: 'Draw',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      id: 'type' as const,
      label: 'Type',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
      ),
    },
    {
      id: 'upload' as const,
      label: 'Upload',
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-[#F1F5F9] rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSignatureMode(tab.id)}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-[12.5px] font-bold transition-all ${
              signatureMode === tab.id
                ? 'bg-white text-[#4F46E5] shadow-sm'
                : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div>
        {signatureMode === 'draw' && <DrawSignature />}
        {signatureMode === 'type' && <TypeSignature />}
        {signatureMode === 'upload' && <UploadSignature />}
      </div>

      {/* Saved Signatures */}
      {signatures.length > 0 && (
        <div className="pt-4 border-t border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[12.5px] font-semibold text-[#26324B]">
              Your Signatures ({signatures.length})
            </label>
          </div>
          <p className="text-[11px] text-[#8A93A3] mb-3">
            Click a signature, then click on the PDF to place it
          </p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {signatures.map((sig) => (
              <div
                key={sig.id}
                onClick={() => setActiveSignatureId(sig.id)}
                className={`group relative bg-white rounded-lg border-2 p-2 cursor-pointer transition-all ${
                  activeSignatureId === sig.id
                    ? 'border-[#4F46E5] shadow-md'
                    : 'border-[#E5E7EB] hover:border-[#C7D2FE]'
                }`}
              >
                <img
                  src={sig.imageDataUrl}
                  alt="Signature"
                  className="w-full h-16 object-contain"
                />
                {activeSignatureId === sig.id && (
                  <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSignature(sig.id);
                  }}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Delete"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}