import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function DeleteOrders() {
  const { api, fetchTodayOrders } = useApp();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleDelete(e) {
    e.preventDefault();
    if (!window.confirm(`Delete ALL orders from ${startDate} to ${endDate}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await api.delete('/orders/range/delete', { data: { startDate, endDate } });
      setResult({ success: true, count: res.data.deleted });
      fetchTodayOrders();
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Failed' });
    }
    setLoading(false);
  }

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Delete Orders by Date Range</h3>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Permanently delete orders within a date range to free up database storage.
      </p>
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontWeight: 600, marginBottom: 6 }}>
          ⚠️ Warning
        </div>
        <p style={{ fontSize: 13, color: '#7f1d1d' }}>This action is irreversible. All orders in the selected range will be permanently deleted.</p>
      </div>
      <form onSubmit={handleDelete} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>From Date</label>
          <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)}
            style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: 14 }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6, color: '#374151' }}>To Date</label>
          <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)}
            min={startDate}
            style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: 14 }} />
        </div>
        <button type="submit" disabled={loading} style={{
          background: '#ef4444', color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600
        }}>{loading ? 'Deleting...' : '🗑️ Delete Orders'}</button>
      </form>
      {result && (
        <div style={{
          marginTop: 16, padding: '12px 16px', borderRadius: 8,
          background: result.success ? '#f0fdf4' : '#fef2f2',
          color: result.success ? '#16a34a' : '#ef4444', fontWeight: 500, fontSize: 14
        }}>
          {result.success ? `✓ Successfully deleted ${result.count} order(s)` : `✕ ${result.message}`}
        </div>
      )}
    </div>
  );
}
