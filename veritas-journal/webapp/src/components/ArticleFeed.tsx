'use client';

import { useEffect, useState, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { VERITAS_ARTICLE_ABI, VERITAS_ARTICLE_ADDRESS } from '@/constants/VeritasArticle';
import ReactMarkdown from 'react-markdown';
import TrustButton from './TrustButton';
import { Loader2, FileText, RefreshCw } from 'lucide-react';

const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || '';

interface ArticleMetadata {
  name: string;
  description?: string;
  content: string;
  properties?: {
    type?: string;
    timestamp?: string;
  };
}

interface Article {
  tokenId: number;
  metadata: ArticleMetadata;
  tokenURI: string;
}

/** Convert ipfs:// or gateway URLs to a fetchable URL */
function resolveIPFS(uri: string): string {
  if (uri.startsWith('ipfs://')) {
    const cid = uri.replace('ipfs://', '');
    if (PINATA_GATEWAY) return `https://${PINATA_GATEWAY}/ipfs/${cid}`;
    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  }
  return uri;
}

export default function ArticleFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [trustScores, setTrustScores] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isContractDeployed =
    VERITAS_ARTICLE_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Always call the hook unconditionally (React rules of hooks).
  // When the contract isn't deployed the call will fail — we handle that below.
  const { data: totalSupply, isError: contractError } = useReadContract({
    address: VERITAS_ARTICLE_ADDRESS as `0x${string}`,
    abi: VERITAS_ARTICLE_ABI,
    functionName: 'totalSupply',
  });

  const fetchTrustScores = useCallback(async () => {
    try {
      const res = await fetch('/api/trust');
      if (res.ok) {
        const data = await res.json();
        setTrustScores(data.scores || {});
      }
    } catch {
      // Non-critical — scores just won't show
    }
  }, []);

  useEffect(() => {
    fetchTrustScores();
  }, [fetchTrustScores]);

  // Single effect for article fetching with a stable 3-item deps array
  useEffect(() => {
    // Contract not deployed or RPC call failed → show empty state immediately
    if (!isContractDeployed || contractError) {
      setIsLoading(false);
      return;
    }

    // Still waiting for the RPC response
    if (totalSupply === undefined) return;

    const count = Number(totalSupply);
    if (count === 0) {
      setIsLoading(false);
      return;
    }

    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fetched: Article[] = [];

        for (let i = count - 1; i >= 0 && fetched.length < 20; i--) {
          try {
            const uriRes = await fetch(`/api/articles?tokenId=${i}`);
            if (!uriRes.ok) continue;
            const { tokenURI } = await uriRes.json();

            const metaRes = await fetch(resolveIPFS(tokenURI));
            if (!metaRes.ok) continue;
            const metadata: ArticleMetadata = await metaRes.json();

            fetched.push({ tokenId: i, metadata, tokenURI });
          } catch {
            continue;
          }
        }

        setArticles(fetched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load articles.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [totalSupply, isContractDeployed, contractError]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-500 dark:text-zinc-400">
        <Loader2 className="animate-spin mb-3" size={32} />
        <p>Loading articles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
        <FileText className="mx-auto mb-3" size={40} />
        <p className="text-lg font-medium">No articles yet</p>
        <p className="text-sm mt-1">Be the first to publish on Veritas Journal.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Article Feed</h2>
        <button
          onClick={() => { fetchTrustScores(); window.location.reload(); }}
          className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {articles.map((article) => (
        <article
          key={article.tokenId}
          className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 p-6"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                {article.metadata.name || `Article #${article.tokenId}`}
              </h3>
              {article.metadata.properties?.timestamp && (
                <time className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(article.metadata.properties.timestamp).toLocaleDateString()}
                </time>
              )}
            </div>
            <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              #{article.tokenId}
            </span>
          </div>

          <div className="prose dark:prose-invert max-w-none text-sm mb-4 line-clamp-6">
            <ReactMarkdown>{article.metadata.content}</ReactMarkdown>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-700">
            <TrustButton
              tokenId={article.tokenId}
              trustScore={trustScores[article.tokenId] || 0}
              onTrusted={fetchTrustScores}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
