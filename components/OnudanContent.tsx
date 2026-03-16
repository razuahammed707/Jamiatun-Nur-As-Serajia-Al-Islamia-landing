"use client";

import { useState } from "react";
import OnudanForm from "@/components/OnudanForm";

export default function OnudanContent() {
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'bank'>('bkash');

  return (
    <div className="onudan-grid">
      {/* Form Section (Client Component) */}
      <OnudanForm paymentMethod={paymentMethod} />

      {/* Sidebar Section */}
      <div style={{ position: "sticky", top: "100px" }}>
        {/* Toggle Buttons */}
        <div style={{ 
          display: 'flex', 
          marginBottom: '20px', 
          background: '#e2e8f0', 
          padding: '5px', 
          borderRadius: '10px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <button 
            onClick={() => setPaymentMethod('bkash')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '8px', 
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: paymentMethod === 'bkash' ? '#df146e' : 'transparent',
              color: paymentMethod === 'bkash' ? 'white' : '#4a5568',
            }}
          >
            বিকাশ
          </button>
          <button 
            onClick={() => setPaymentMethod('bank')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '8px', 
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backgroundColor: paymentMethod === 'bank' ? '#0f5825' : 'transparent',
              color: paymentMethod === 'bank' ? 'white' : '#4a5568',
            }}
          >
            ব্যাংক
          </button>
        </div>

        {paymentMethod === 'bkash' ? (
          <div className="onudan-qr-section" style={{ borderTop: '4px solid #df146e' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#df146e" width="32" height="32">
                <path d="M11.996 0L0 12.004h5.176l6.816-6.816L18.816 12l-6.816 6.816-7.14-7.14H-3L11.996 24 27 12.004 11.996 0z" />
              </svg>
              <h3 className="onudan-qr-title" style={{ marginBottom: 0, color: '#df146e' }}>বিকাশ পেমেন্ট</h3>
            </div>
            
            <div className="onudan-qr-image-container" style={{ marginBottom: '20px' }}>
              <img 
                src="/money/qr.jpeg" 
                alt="bKash QR Code" 
                style={{ width: '100%', maxWidth: '250px', margin: '0 auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
              />
            </div>
            
            <p className="onudan-qr-desc" style={{ fontSize: '1.1rem', background: '#fff5f7', padding: '15px', borderRadius: '8px', border: '1px solid #fed7e2' }}>
              <strong>বিকাশ নম্বর: <br/> <span style={{ color: '#df146e', fontSize: '1.25rem' }}>01347351468</span></strong>
            </p>
            <p className="onudan-qr-desc" style={{ marginTop: '15px' }}>
              অনুদান পাঠাতে উপরের কিউআর কোডটি স্ক্যান করুন অথবা সরাসরি আমাদের বিকাশ নম্বরে সেন্ড মানি করুন। 
            </p>
          </div>
        ) : (
          <div className="onudan-qr-section" style={{ borderTop: '4px solid #0f5825' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#0f5825" width="28" height="28">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
              <h3 className="onudan-qr-title" style={{ marginBottom: 0, color: '#0f5825' }}>ব্যাংক একাউন্ট</h3>
            </div>
            
            <div className="onudan-qr-image-container" style={{ marginBottom: '20px', overflow: 'hidden', borderRadius: '8px' }}>
              <img 
                src="/money/image.png" 
                alt="Bank QR Code" 
                style={{ 
                  width: '100%', 
                  maxWidth: '320px', 
                  margin: '0 auto', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease'
                }} 
              />
            </div>

            <p className="onudan-qr-desc" style={{ marginTop: '15px' }}>
              সরাসরি ব্যাংক একাউন্টে অনুদান পাঠিয়ে নিচের ফর্মে আপনার একাউন্ট নম্বরটি উল্লেখ করুন।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
