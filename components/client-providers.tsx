"use client";

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamically import providers to avoid SSR issues
const DynamicProviders = dynamic(
  () => import('./providers').then((mod) => ({ default: mod.Providers })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    ),
  }
);

export function ClientProviders({ children }: { children: ReactNode }) {
  return <DynamicProviders>{children}</DynamicProviders>;
}