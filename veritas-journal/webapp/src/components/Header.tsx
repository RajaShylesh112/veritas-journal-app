'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from 'react';

export function Header() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-700">
      <div className="text-xl font-bold text-zinc-800 dark:text-zinc-100">Veritas Journal</div>
      {mounted && <ConnectButton />}
    </header>
  );
}
