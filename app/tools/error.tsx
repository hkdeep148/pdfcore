'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ToolsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Tools error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Something went wrong with this tool
        </h1>
        <p className="text-gray-600 mb-2">
          There was an error processing your file. This can happen if:
        </p>
        <ul className="text-sm text-gray-500 mb-8 space-y-1 text-left max-w-xs mx-auto">
          <li>• The file is corrupted or password-protected</li>
          <li>• The file is too large for your device&apos;s memory</li>
          <li>• Your browser blocked the operation</li>
          <li>• Network connection was interrupted</li>
        </ul>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-gradient-to-r from-[#1E63FF] to-[#6D35FF] text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Try Again
          </button>
          <Link
            href="/tools"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
          >
            Choose Another Tool
          </Link>
        </div>

        {/* Error digest for debugging */}
        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}