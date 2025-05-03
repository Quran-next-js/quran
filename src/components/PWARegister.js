// src/components/PWARegister.js
"use client";

import { useEffect } from 'react';

export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('SW registered:', reg))
        .catch(err => console.log('SW registration failed:', err));
    }
  }, []);

  return null; // لا يُظهر أي واجهة
}