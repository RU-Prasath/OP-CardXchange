import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import ServiceManagement from '../components/admin/ServiceManagement';
import CalendarView from '../components/admin/CalendarView';
import DeleteOrders from '../components/admin/DeleteOrders';
import OrderQueue from '../components/OrderQueue';

const TABS = [
  { id: 'orders', label: '📋 Orders', icon: '📋' },
  { id: 'services', label: '⚙️ Services & Pricing', icon: '⚙️' },
  { id: 'calendar', label: '📅 Calendar', icon: '📅' },
  { id: 'export', label: '📊 Export', icon: '📊' },
  { id: 'delete', label: '🗑️ Manage Data', icon: '🗑️' },
];

export default function AdminPage() {
  const { adminToken, api } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);
  const [exportStartDate, setExportStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [exportEndDate, setExportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (!adminToken) { navigate('/'); return; }
    if (activeTab === 'orders') fetchOrders();
  }, [adminToken, activeTab, filterDate]);

  async function fetchOrders() {
    try {
      const res = await api.get('/orders', { params: { date: filterDate } });
      setOrders(res.data);
    } catch (e) { console.error(e); }
  }

  async function handleExport() {
    setExportLoading(true);
    try {
      const res = await api.get('/orders/export', {
        params: { startDate: exportStartDate, endDate: exportEndDate },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `printhub_orders_${exportStartDate}_to_${exportEndDate}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) { alert('Export failed'); }
    setExportLoading(false);
  }

  if (!adminToken) return null;

  return (
    <div style={{ minHeight: 'calc(100vh - 52px)', background: '#f9fafb' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              padding: '14px 18px', fontSize: 13, fontWeight: 500, border: 'none', background: 'none',
              color: activeTab === tab.id ? '#1B8B5E' : '#6b7280',
              borderBottom: activeTab === tab.id ? '2px solid #1B8B5E' : '2px solid transparent',
              whiteSpace: 'nowrap', cursor: 'pointer'
            }}>{tab.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700 }}>Orders</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Date:</label>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
                  style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '7px 12px', fontSize: 13 }} />
                <button onClick={fetchOrders} style={{ background: '#1B8B5E', color: '#fff', borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>Refresh</button>
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', minHeight: 400 }}>
              <OrderQueue orders={orders} />
            </div>
          </div>
        )}

        {activeTab === 'services' && <ServiceManagement />}
        {activeTab === 'calendar' && <CalendarView />}

        {activeTab === 'export' && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Export Orders to Excel</h3>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>
                Export all orders (with service details, amounts, and status) for a selected date range.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>From Date</label>
                  <input type="date" value={exportStartDate} onChange={e => setExportStartDate(e.target.value)}
                    style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: 14 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 6 }}>To Date</label>
                  <input type="date" value={exportEndDate} min={exportStartDate} onChange={e => setExportEndDate(e.target.value)}
                    style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: 14 }} />
                </div>
                <button onClick={handleExport} disabled={exportLoading} style={{
                  background: '#1B8B5E', color: '#fff', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  {exportLoading ? '⏳ Exporting...' : '⬇️ Export Excel'}
                </button>
              </div>
              <div style={{ marginTop: 24, background: '#f9fafb', borderRadius: 8, padding: 16 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Export includes:</h4>
                <ul style={{ fontSize: 13, color: '#6b7280', paddingLeft: 20, lineHeight: 2 }}>
                  <li>Serial number, Date, Time</li>
                  <li>Service name and details (pages, copies, size, etc.)</li>
                  <li>Total amount</li>
                  <li>Order status (Pending / Completed)</li>
                  <li>Grand total row at the bottom</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'delete' && (
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24 }}>
            <DeleteOrders />
          </div>
        )}
      </div>
    </div>
  );
}
