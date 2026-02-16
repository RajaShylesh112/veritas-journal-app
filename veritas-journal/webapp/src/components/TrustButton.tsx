'use client';

import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Shield, ShieldCheck, Loader2 } from 'lucide-react';

interface TrustButtonProps {
  tokenId: number;
  trustScore: number;
  onTrusted?: () => void;
}

export default function TrustButton({ tokenId, trustScore, onTrusted }: TrustButtonProps) {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTrusted, setHasTrusted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrust = async () => {
    if (!isConnected || !address) {
      setError('Connect your wallet first.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const message = `I trust article #${tokenId} on Veritas Journal`;

      const signature = await signMessageAsync({ message });

      const res = await fetch('/api/trust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          signer: address,
          signature,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit trust signal.');

      setHasTrusted(true);
      onTrusted?.();
    } catch (err) {
      // User rejected signature — not an error
      if (err instanceof Error && err.message.includes('User rejected')) {
        setIsSubmitting(false);
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to trust.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleTrust}
        disabled={isSubmitting || hasTrusted || !isConnected}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          hasTrusted
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default'
            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-50'
        }`}
        title={!isConnected ? 'Connect wallet to trust' : hasTrusted ? 'Already trusted' : 'Signal trust'}
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={16} />
        ) : hasTrusted ? (
          <ShieldCheck size={16} />
        ) : (
          <Shield size={16} />
        )}
        {hasTrusted ? 'Trusted' : 'Trust'}
      </button>
      <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400" title="Trust score">
        {trustScore + (hasTrusted ? 1 : 0)}
      </span>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
