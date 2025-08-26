"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import WhitePopup from '@/components/WhitePopup';

export default function MessagesPage() {
  const router = useRouter();
  return (
    <WhitePopup
      message="This page is under construction."
      onOk={() => router.replace('/')}
    />
  );
}
