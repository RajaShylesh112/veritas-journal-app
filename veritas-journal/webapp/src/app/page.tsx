import { Header } from "@/components/Header";
import Link from "next/link";
import FeedSection from "@/components/FeedSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-900">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Veritas Journal</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              Decentralized article provenance &amp; journalistic integrity.
            </p>
          </div>
          <Link
            href="/publish"
            className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            Publish
          </Link>
        </div>
        <FeedSection />
      </main>
    </div>
  );
}
