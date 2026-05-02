import React from 'react';

export default function TodaySummary({ orders }) {
  const completed = orders.filter(o => o.status === 'completed');
  const pending = orders.filter(o => o.status === 'pending');
  const totalEarnings = completed.reduce((s, o) => s + o.total, 0);

  // Service breakdown
  const breakdown = {};
  orders.forEach(o => {
    if (!breakdown[o.service]) breakdown[o.service] = { count: 0, revenue: 0, type: o.serviceType };
    breakdown[o.service].count += 1;
    if (o.status === 'completed') breakdown[o.service].revenue += o.total;
  });

  const maxRevenue = Math.max(...Object.values(breakdown).map(b => b.revenue), 1);

  function getIcon(type) {
    const icons = { xerox: '📄', spiral: '🔗', idcard: '🪪', brochure: '📋', offset: '🖨️', lamination: '✨' };
    return icons[type] || '📦';
  }

  return (
    <div style={{ padding: 16, height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span>📊</span>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>TODAY'S SUMMARY</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#eff6ff', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, marginBottom: 4 }}>Total Orders</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#1e40af' }}>{orders.length}</div>
        </div>
        <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, marginBottom: 4 }}>Total Earnings</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#15803d' }}>₹{totalEarnings.toFixed(0)}</div>
        </div>
        <div style={{ background: '#fffbeb', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ fontSize: 12, color: '#d97706', fontWeight: 600, marginBottom: 4 }}>Pending Orders</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#b45309' }}>{pending.length}</div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 10 }}>SERVICE BREAKDOWN</div>
        {Object.entries(breakdown).length === 0 ? (
          <p style={{ fontSize: 12, color: '#9ca3af' }}>No orders yet</p>
        ) : Object.entries(breakdown).map(([name, data]) => (
          <div key={name} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{getIcon(data.type)}</span>{name}
              </span>
              <span style={{ fontWeight: 600 }}>{data.count}</span>
            </div>
            <div style={{ background: '#e5e7eb', borderRadius: 4, height: 6 }}>
              <div style={{ background: '#1B8B5E', height: 6, borderRadius: 4, width: `${(data.count / orders.length) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 10 }}>REVENUE BY SERVICE</div>
        {Object.entries(breakdown).map(([name, data]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 16 }}>{getIcon(data.type)}</span>
            <div style={{ flex: 1, background: '#e5e7eb', borderRadius: 4, height: 8 }}>
              <div style={{ background: '#3b82f6', height: 8, borderRadius: 4, width: `${(data.revenue / maxRevenue) * 100}%` }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>₹{data.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
