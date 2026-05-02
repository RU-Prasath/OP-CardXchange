import React from 'react';
import { useApp } from '../context/AppContext';
import QuickOrder from '../components/QuickOrder';
import OrderQueue from '../components/OrderQueue';
import TodaySummary from '../components/TodaySummary';

export default function PrintHubPage() {
  const { todayOrders } = useApp();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr 280px', height: 'calc(100vh - 52px)', overflow: 'hidden' }}>
      <div style={{ borderRight: '1px solid #e5e7eb', overflowY: 'auto', background: '#fff' }}>
        <QuickOrder />
      </div>
      <div style={{ background: '#f9fafb', overflowY: 'auto' }}>
        <OrderQueue orders={todayOrders} />
      </div>
      <div style={{ borderLeft: '1px solid #e5e7eb', background: '#fff', overflowY: 'auto' }}>
        <TodaySummary orders={todayOrders} />
      </div>
    </div>
  );
}
