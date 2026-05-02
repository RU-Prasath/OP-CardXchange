import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

// Format a local Date as YYYY-MM-DD without timezone shift
function toLocalDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CalendarView() {
  const { api } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayOrders, setDayOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchCalendarData(); }, [currentDate]);

  async function fetchCalendarData() {
    setLoading(true);
    try {
      const res = await api.get('/orders/calendar', {
        params: { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1 }
      });
      setCalendarData(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleDayClick(day) {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(d);
    try {
      // Use local date string to avoid UTC shift
      const res = await api.get('/orders', { params: { date: toLocalDateStr(d) } });
      setDayOrders(res.data);
    } catch (e) { console.error(e); setDayOrders([]); }
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const completedOrders = dayOrders.filter(o => o.status === 'completed');
  const dayEarnings = completedOrders.reduce((s, o) => s + o.total, 0);

  function getServiceIcon(type) {
    const icons = { xerox: '📄', spiral: '🔗', idcard: '🪪', brochure: '📋', offset: '🖨️', lamination: '✨' };
    return icons[type] || '📦';
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {/* Calendar grid */}
        <div style={{ flex: '1 1 380px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={() => setCurrentDate(new Date(year, month - 1))} style={{
              background: '#f3f4f6', border: 'none', borderRadius: 8,
              padding: '6px 14px', fontSize: 18, cursor: 'pointer'
            }}>‹</button>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>{monthName}</h3>
            <button onClick={() => setCurrentDate(new Date(year, month + 1))} style={{
              background: '#f3f4f6', border: 'none', borderRadius: 8,
              padding: '6px 14px', fontSize: 18, cursor: 'pointer'
            }}>›</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b7280', padding: '6px 0' }}>{d}</div>
            ))}
            {cells.map((day, idx) => {
              if (!day) return <div key={idx} />;
              const data = calendarData[day];
              const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
              const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === month && selectedDate?.getFullYear() === year;
              return (
                <button key={idx} onClick={() => handleDayClick(day)} style={{
                  padding: '8px 4px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'center',
                  background: isSelected ? '#1B8B5E' : isToday ? '#f0fdf4' : data ? '#e8f5ef' : '#f9fafb',
                  color: isSelected ? '#fff' : '#1a1a2e',
                  outline: isToday && !isSelected ? '2px solid #1B8B5E' : 'none',
                }}>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 700 : 400 }}>{day}</div>
                  {data && (
                    <div style={{ fontSize: 9, color: isSelected ? '#d1fae5' : '#1B8B5E', fontWeight: 600, marginTop: 2 }}>
                      ₹{data.earnings}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {loading && <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: 12, fontSize: 13 }}>Loading...</p>}
        </div>

        {/* Day detail panel */}
        <div style={{ flex: '1 1 300px' }}>
          {selectedDate ? (
            <>
              <h4 style={{ marginBottom: 12, fontSize: 15, fontWeight: 700 }}>
                Orders on {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </h4>

              {dayOrders.length === 0 ? (
                <div style={{ color: '#9ca3af', fontSize: 14, padding: '20px 0', textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  No orders on this day
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                    <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#16a34a', fontWeight: 600 }}>Earnings</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#15803d' }}>₹{dayEarnings.toFixed(2)}</div>
                    </div>
                    <div style={{ background: '#eff6ff', borderRadius: 8, padding: '10px 14px' }}>
                      <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>Total Orders</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: '#1e40af' }}>{dayOrders.length}</div>
                    </div>
                  </div>

                  {/* Service breakdown */}
                  <div style={{ background: '#f9fafb', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', marginBottom: 8 }}>SERVICE BREAKDOWN</div>
                    {(() => {
                      const breakdown = {};
                      dayOrders.forEach(o => {
                        if (!breakdown[o.service]) breakdown[o.service] = { count: 0, revenue: 0, type: o.serviceType };
                        breakdown[o.service].count++;
                        if (o.status === 'completed') breakdown[o.service].revenue += o.total;
                      });
                      return Object.entries(breakdown).map(([name, d]) => (
                        <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 13 }}>
                          <span>{getServiceIcon(d.type)} {name}</span>
                          <span style={{ display: 'flex', gap: 10 }}>
                            <span style={{ color: '#6b7280' }}>{d.count} orders</span>
                            <span style={{ fontWeight: 600 }}>₹{d.revenue}</span>
                          </span>
                        </div>
                      ));
                    })()}
                  </div>

                  <div style={{ maxHeight: 340, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {dayOrders.map(o => (
                      <div key={o._id} style={{
                        background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
                        padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        borderLeft: `3px solid ${o.status === 'completed' ? '#1B8B5E' : '#f59e0b'}`
                      }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{o.service}</div>
                          <div style={{ fontSize: 11, color: '#6b7280' }}>
                            {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            {o.pages && ` · ${o.pages}pg × ${o.copies} ${o.printType}`}
                            {o.quantity && ` · Qty ${o.quantity}`}
                            {o.size && ` · ${o.size}`}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>₹{o.total}</div>
                          <span style={{
                            fontSize: 10, padding: '2px 6px', borderRadius: 10, fontWeight: 600,
                            background: o.status === 'completed' ? '#dcfce7' : '#fef9c3',
                            color: o.status === 'completed' ? '#16a34a' : '#a16207'
                          }}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 220, color: '#9ca3af' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
              <p style={{ fontSize: 13 }}>Click a date to view order details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
