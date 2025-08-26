"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DemoRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace('/demo/1'); }, [router]);
  return null;
}