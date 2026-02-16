'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VERITAS_ARTICLE_ABI, VERITAS_ARTICLE_ADDRESS } from '@/constants/VeritasArticle';
import { Loader2, Send, FileText, Eye } from 'lucide-react';

export default function PublishComponent() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: hash, writeContract, isPending: isMinting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePublish = async () => {
    setError(null);
    if (!content || !title) { setError('Please provide a title and content.'); return; }

    try {
      setIsUploading(true);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (!res.ok) { throw new Error(data.error || 'Upload failed'); }

      setIsUploading(false);

      writeContract({
        address: VERITAS_ARTICLE_ADDRESS as `0x${string}`,
        abi: VERITAS_ARTICLE_ABI,
        functionName: 'mintArticle',
        args: [data.tokenURI],
      });
    } catch (err) {
      console.error('Publishing failed:', err);
      setIsUploading(false);
      setError(err instanceof Error ? err.message : 'Failed to upload to IPFS.');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Write Article</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-zinc-300 dark:border-zinc-600 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
          >
            {isPreview ? <FileText size={18} /> : <Eye size={18} />}
            {isPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isUploading || isMinting || isConfirming}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50"
          >
            {isUploading || isMinting || isConfirming ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            Publish
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Article Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-bold mb-4 outline-none border-b border-zinc-300 dark:border-zinc-600 pb-2 focus:border-black dark:focus:border-white transition-colors bg-transparent text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
      />

      {isPreview ? (
        <div className="prose dark:prose-invert max-w-none min-h-[400px] border border-zinc-300 dark:border-zinc-600 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 font-sans">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          placeholder="Write your article in Markdown..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full min-h-[400px] p-4 font-mono text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-1 focus:ring-black dark:focus:ring-white outline-none bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
        />
      )}

      {hash && (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-800/20 border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-blue-800">
            Transaction Hash: <span className="font-mono">{hash}</span>
          </p>
          {isConfirming && <p className="text-sm text-blue-600 mt-1">Waiting for confirmation...</p>}
          {isSuccess && <p className="text-sm text-green-600 mt-1 font-bold">Successfully minted NFT!</p>}
        </div>
      )}
    </div>
  );
}
