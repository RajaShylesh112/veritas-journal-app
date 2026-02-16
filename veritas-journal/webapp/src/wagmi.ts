import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia } from 'wagmi/chains';
import { createStorage, cookieStorage } from 'wagmi';

const isBrowser = typeof window !== 'undefined';

export const config = getDefaultConfig({
  appName: 'Veritas Journal',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arbitrumSepolia],
  ssr: true,
  ...(isBrowser ? {
    storage: createStorage({
      storage: cookieStorage,
    }),
  } : {}),
});
