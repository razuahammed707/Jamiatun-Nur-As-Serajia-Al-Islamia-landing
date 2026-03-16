"use client";

import { useState } from "react";

export default function OnudanForm({ paymentMethod }: { paymentMethod: 'bkash' | 'bank' }) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      sector: formData.get('sector'),
      amount: formData.get('amount'),
      trxId: formData.get('trxId'),
      bankAccount: formData.get('bankAccount'),
      paymentMethod,
      isAnonymous
    };

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to submit');

      setStatus({ type: 'success', message: 'আপনার অনুদান তথ্য সফলভাবে দাখিল করা হয়েছে। আমরা শীঘ্রই এটি যাচাই করব।' });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'দুঃখিত, তথ্য দাখিল করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onudan-form-card">
      <div className="onudan-form-header">
        <h2>অনুদান</h2>
      </div>
      <div className="onudan-form-body">
        <h3 className="onudan-form-title">অনুদান দিয়ে দ্বীনের খেদমতে শরীক হোন</h3>
        
        {status && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            backgroundColor: status.type === 'success' ? '#f0fff4' : '#fff5f5',
            color: status.type === 'success' ? '#22543d' : '#822727',
            border: `1px solid ${status.type === 'success' ? '#c6f6d5' : '#feb2b2'}`,
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Anonymity Checkbox at Top */}
          <div className="onudan-form-checkbox-group" style={{ marginBottom: "32px", background: "#f0fff4", padding: "15px", borderRadius: "8px", border: "1px solid #c6f6d5" }}>
            <input 
              type="checkbox" 
              id="anonymous" 
              className="onudan-form-checkbox" 
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anonymous" className="onudan-form-checkbox-label" style={{ fontWeight: "700", color: "#2d3748" }}>পরিচয় প্রকাশে আগ্রহী নই (Anonymous)</label>
          </div>

          {!isAnonymous && (
            <>
              <div className="onudan-form-group">
                <label htmlFor="name" className="onudan-form-label">আপনার নাম</label>
                <input type="text" id="name" name="name" className="onudan-form-input" placeholder="আপনার নাম লিখুন" />
              </div>

              <div className="onudan-form-group">
                <label htmlFor="phone" className="onudan-form-label">ফোন নম্বর</label>
                <input type="tel" id="phone" name="phone" className="onudan-form-input" placeholder="আপনার ফোন নম্বর লিখুন" />
                <span className="onudan-form-hint">ইমো/হোয়াটসঅ্যাপ নম্বর (রশিদ গ্রহনের জন্য)</span>
              </div>

              <div className="onudan-form-group">
                <label htmlFor="address" className="onudan-form-label">আপনার ঠিকানা</label>
                <textarea id="address" name="address" className="onudan-form-textarea" placeholder="আপনার পূর্ণাঙ্গ ঠিকানা লিখুন"></textarea>
              </div>
            </>
          )}

          <div className="onudan-form-group">
            <label htmlFor="sector" className="onudan-form-label">অনুদানের খাত <span style={{ color: "red" }}>*</span></label>
            <select id="sector" name="sector" className="onudan-form-select" defaultValue="" required>
              <option value="" disabled>অনুদানের খাত নির্বাচন করুন</option>
              <option value="zakat">যাকাত</option>
              <option value="sadaqah">সাদাকা</option>
              <option value="sadaqah_jariah">সাদাকায়ে জারিয়া</option>
              <option value="fitrah">সদকাতুল ফিতর (ফিতরা)</option>
              <option value="fidyah">ফিদইয়া</option>
              <option value="kaffarah">কাফফারা</option>
              <option value="qurbani">কোরবানি</option>
              <option value="waqf">ওয়াক্ফ</option>
              <option value="general">সাধারণ অনুদান</option>
            </select>
          </div>

          <div className="onudan-form-group">
            <label htmlFor="amount" className="onudan-form-label">অনুদানের পরিমান <span style={{ color: "red" }}>*</span></label>
            <input type="number" id="amount" name="amount" className="onudan-form-input" placeholder="অনুদানের পরিমান লিখুন" required />
          </div>

          {paymentMethod === 'bkash' ? (
            <div className="onudan-form-group">
              <label htmlFor="trxId" className="onudan-form-label">ট্রানজেকশন আইডি (TrxID) <span style={{ color: "red" }}>*</span></label>
              <input type="text" id="trxId" name="trxId" className="onudan-form-input" placeholder="বিকাশ ট্রানজেকশন আইডি লিখুন" required />
            </div>
          ) : (
            <div className="onudan-form-group">
              <label htmlFor="bankAccount" className="onudan-form-label">আপনার ব্যাংক একাউন্ট নম্বর <span style={{ color: "red" }}>*</span></label>
              <input type="text" id="bankAccount" name="bankAccount" className="onudan-form-input" placeholder="আপনার ব্যাংক একাউন্ট নম্বর লিখুন" required />
            </div>
          )}

          <button 
            type="submit" 
            className="onudan-submit-btn" 
            style={{ width: "100%", marginTop: "10px", opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? 'প্রক্রিয়াধীন...' : 'দাখিল করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}
