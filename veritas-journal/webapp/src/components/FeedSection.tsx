'use client';

import dynamic from 'next/dynamic';

const ArticleFeed = dynamic(() => import('./ArticleFeed'), { ssr: false });

export default function FeedSection() {
  return <ArticleFeed />;
}
