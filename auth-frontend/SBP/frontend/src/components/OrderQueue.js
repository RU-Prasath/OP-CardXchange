import React from 'react';
import { useApp } from '../context/AppContext';

export default function OrderQueue({ orders, showAll = false }) {
  const { updateOrderStatus, deleteOrder, adminToken } = useApp();

  const displayOrders = showAll ? orders : orders;
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  function getServiceIcon(type) {
    const icons = { xerox: '📄', spiral: '🔗', idcard: '🪪', brochure: '📋', offset: '🖨️', lamination: '✨' };
    return icons[type] || '📦';
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function getDetails(order) {
    const parts = [];
    if (order.pages) parts.push(`${order.pages}pg`);
    if (order.copies) parts.push(`× ${order.copies}`);
    if (order.printType) parts.push(order.printType);
    if (order.quantity) parts.push(`Qty: ${order.quantity}`);
    if (order.size) parts.push(order.size);
    return parts.join(' ');
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>☰</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>ORDER QUEUE</span>
          <span style={{
            background: '#e5e7eb', color: '#374151', borderRadius: 20,
            padding: '1px 8px', fontSize: 13, fontWeight: 600
          }}>{orders.length}</span>
        </div>
        {pendingCount > 0 && (
          <span style={{ fontSize: 13, color: '#f59e0b', fontWeight: 600 }}>
            {pendingCount} pending
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
          <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>📭</div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>No orders yet</p>
          <p style={{ fontSize: 12 }}>Add an order from the left panel</p>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {orders.map(order => (
            <div key={order._id} style={{
              background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 10,
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderLeft: `4px solid ${order.status === 'completed' ? '#1B8B5E' : '#f59e0b'}`
            }}>
              <span style={{ fontSize: 22 }}>{getServiceIcon(order.serviceType)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{order.service}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{formatTime(order.createdAt)}</span>
                </div>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{getDetails(order)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>₹{order.total}</span>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                  background: order.status === 'completed' ? '#dcfce7' : '#fef9c3',
                  color: order.status === 'completed' ? '#16a34a' : '#a16207'
                }}>{order.status === 'completed' ? 'Completed' : 'Pending'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <button onClick={() => updateOrderStatus(order._id, order.status === 'completed' ? 'pending' : 'completed')}
                  title={order.status === 'completed' ? 'Mark Pending' : 'Mark Complete'}
                  style={{
                    background: order.status === 'completed' ? '#f3f4f6' : '#1B8B5E',
                    color: order.status === 'completed' ? '#6b7280' : '#fff',
                    border: 'none', borderRadius: 6, width: 28, height: 28, fontSize: 14
                  }}>✓</button>
                {adminToken && (
                  <button onClick={() => { if(window.confirm('Delete this order?')) deleteOrder(order._id); }}
                    style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 6, width: 28, height: 28, fontSize: 12 }}>✕</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
