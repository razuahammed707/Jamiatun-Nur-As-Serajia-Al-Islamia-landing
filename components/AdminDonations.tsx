"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Donation {
  id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  sector: string;
  amount: number;
  trxId: string | null;
  bankAccount: string | null;
  paymentMethod: 'bkash' | 'bank';
  isAnonymous: boolean;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
}

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const fetchDonations = useCallback(async (pageNum: number = page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/donations?page=${pageNum}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setDonations(data.donations ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error("Failed to fetch donations:", err);
    } finally {
      setLoading(false);
    }
  }, [page, router]);

  useEffect(() => {
    fetchDonations(page);
  }, [page, fetchDonations]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const updateStatus = async (id: string, status: 'VERIFIED' | 'REJECTED' | 'PENDING') => {
    try {
      const res = await fetch("/api/donations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!res.ok) throw new Error("Failed");

      await fetchDonations();
      showSuccess(status === "VERIFIED" ? "✅ অনুদান নিশ্চিত করা হয়েছে" : "❌ অনুদান বাতিল করা হয়েছে");
    } catch {
      alert("সমস্যা হয়েছে, আবার চেষ্টা করুন");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getSectorName = (sector: string) => {
    const sectors: Record<string, string> = {
      zakat: "যাকাত",
      sadaqah: "সাদাকা",
      sadaqah_jariah: "সাদাকায়ে জারিয়া",
      fitrah: "ফিতরা",
      fidyah: "ফিদইয়া",
      kaffarah: "কাফফারা",
      qurbani: "কোরবানি",
      waqf: "ওয়াক্ফ",
      general: "সাধারণ"
    };
    return sectors[sector] || sector;
  };

  if (loading && donations.length === 0) {
    return (
      <div className="admin-loading">
        <p className="admin-loading-text">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="admin-donations">
      {successMsg && <div className="admin-success-toast">{successMsg}</div>}
      
      <div className="admin-posts-list">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>💰 অনুদান তালিকা</h2>
          <button onClick={() => fetchDonations()} className="admin-btn edit" style={{ fontSize: '0.8rem' }}>🔄 রিফ্রেশ</button>
        </div>

        {donations.length === 0 ? (
          <div className="admin-empty">
            <span className="admin-empty-icon">💸</span>
            <p>কোনো অনুদান পাওয়া যায়নি</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #edf2f7' }}>
                  <th style={{ padding: '15px' }}>সময় ও দাতা</th>
                  <th style={{ padding: '15px' }}>বিবরণ</th>
                  <th style={{ padding: '15px' }}>পেমেন্ট তথ্য</th>
                  <th style={{ padding: '15px' }}>অবস্থা</th>
                  <th style={{ padding: '15px' }}>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} style={{ borderBottom: '1px solid #edf2f7', opacity: donation.status === 'REJECTED' ? 0.6 : 1 }}>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#718096' }}>{formatDate(donation.createdAt)}</div>
                      <div style={{ fontWeight: '700' }}>{donation.isAnonymous ? 'গোপন দাতা' : donation.name}</div>
                      {!donation.isAnonymous && <div style={{ fontSize: '0.85rem' }}>{donation.phone}</div>}
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ 
                        display: 'inline-block', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        background: '#ebf8ff', 
                        color: '#2b6cb0', 
                        fontSize: '0.8rem',
                        marginBottom: '4px'
                      }}>
                        {getSectorName(donation.sector)}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#2d3748' }}>{donation.amount} ৳</div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ fontSize: '0.85rem' }}>
                        <strong>{donation.paymentMethod === 'bkash' ? 'বিকাশ' : 'ব্যাংক'}</strong>
                      </div>
                      <div style={{ color: '#e53e3e', fontWeight: '600' }}>
                        {donation.paymentMethod === 'bkash' ? `TrxID: ${donation.trxId}` : `Acc: ${donation.bankAccount}`}
                      </div>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem', 
                        fontWeight: '700',
                        backgroundColor: donation.status === 'VERIFIED' ? '#c6f6d5' : donation.status === 'REJECTED' ? '#fed7e2' : '#fefcbf',
                        color: donation.status === 'VERIFIED' ? '#22543d' : donation.status === 'REJECTED' ? '#822727' : '#744210'
                      }}>
                        {donation.status === 'VERIFIED' ? 'নিশ্চিত' : donation.status === 'REJECTED' ? 'বাতিল' : 'অপেক্ষমাণ'}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {donation.status === 'PENDING' && (
                          <>
                            <button onClick={() => updateStatus(donation.id, 'VERIFIED')} className="admin-btn save" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>✅ নিশ্চিত</button>
                            <button onClick={() => updateStatus(donation.id, 'REJECTED')} className="admin-btn delete" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>❌ বাতিল</button>
                          </>
                        )}
                        {donation.status !== 'PENDING' && (
                          <button onClick={() => updateStatus(donation.id, 'PENDING')} className="admin-btn cancel" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>🔄 রিসেট</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {donations.length > 0 && totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="admin-pagination-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >← আগে</button>
            <span className="admin-pagination-info">পৃষ্ঠা {page} / {totalPages}</span>
            <button
              className="admin-pagination-btn"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >পরবর্তী →</button>
          </div>
        )}
      </div>
    </div>
  );
}
