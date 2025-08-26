"use client";
import React from 'react';

type WhitePopupProps = {
  message: string;
  onOk: () => void;
};

export default function WhitePopup({ message, onOk }: WhitePopupProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#fff', color: '#111', borderRadius: 12, padding: '20px 24px', width: 360,
        boxShadow: '0 12px 28px rgba(0,0,0,0.18)', textAlign: 'center'
      }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Heads up</div>
        <div style={{ fontSize: 14, marginBottom: 16 }}>{message}</div>
        <button onClick={onOk} style={{
          padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
          background: '#ffffff', color: '#4a148c', borderBottom: '2px solid #ab47bc', fontWeight: 700
        }}>OK</button>
      </div>
    </div>
  );
}
