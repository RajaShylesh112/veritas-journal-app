'use client';

import { Header } from "@/components/Header";
import dynamic from 'next/dynamic';

const PublishComponent = dynamic(() => import('@/components/PublishComponent'), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading Editor...</div>
});

export default function PublishPage() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6">
        <PublishComponent />
      </main>
    </div>
  );
}
