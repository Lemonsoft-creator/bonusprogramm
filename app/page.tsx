'use client';
import dynamic from 'next/dynamic';
const BonusApp = dynamic(() => import('@/components/BonusApp'), { ssr: false });

export default function Page() {
  return <BonusApp />;
}
