import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

// Fallback pricing used when services haven't loaded from DB yet
const DEFAULT_PRICING = {
  xerox:      { bwPerPage: 1.5, colorPerPage: 5 },
  brochure:   { bwPerPage: 3,   colorPerPage: 8 },
  offset:     { bwPerPage: 2,   colorPerPage: 6 },
  spiral:     { sizes: { A4: 30, A3: 50, Letter: 25 } },
  lamination: { sizes: { A4: 20, A3: 35, 'ID Card': 10 } },
  idcard:     { perUnit: 50 },
};

export default function QuickOrder() {
  const { services, presets, addOrder } = useApp();

  // Only show presets whose serviceType has a matching loaded service
  const activeServiceTypes = new Set(services.map(s => s.type));
  const visiblePresets = presets.filter(p => activeServiceTypes.has(p.serviceType));

  const [selectedService, setSelectedService] = useState('');
  const [pages, setPages] = useState(1);
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState('BW');
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState('A4');
  const [binding, setBinding] = useState(false);
  const [lamination, setLamination] = useState(false);
  const [loading, setLoading] = useState(false);

  // Default to first service when services load
  const effectiveService = selectedService || (services[0]?.type ?? '');

  const svc = services.find(s => s.type === effectiveService);
  const isXerox = ['xerox', 'brochure', 'offset'].includes(effectiveService);
  const isSpiral = ['spiral', 'lamination'].includes(effectiveService);
  const isUnit = effectiveService === 'idcard';
  const isCustom = svc?.isCustom;

  const total = useMemo(() => {
    const def = DEFAULT_PRICING[effectiveService] || {};
    const pricing = svc?.pricing || def;
    let t = 0;

    if (isXerox) {
      const bwPrice = pricing?.bwPerPage ?? def?.bwPerPage ?? 1.5;
      const colorPrice = pricing?.colorPerPage ?? def?.colorPerPage ?? 5;
      t = (printType === 'BW' ? bwPrice : colorPrice) * pages * copies;
    } else if (isSpiral) {
      const sizesObj = pricing?.sizes || def?.sizes || {};
      const sizePrice = (typeof sizesObj.get === 'function') ? sizesObj.get(size) : sizesObj[size];
      t = (sizePrice ?? 30) * quantity;
    } else if (isUnit) {
      t = (pricing?.perUnit ?? def?.perUnit ?? 50) * quantity;
    } else if (isCustom) {
      t = (pricing?.perUnit ?? 0) * quantity;
    }

    if (binding) t += 10;
    if (lamination) t += 20;
    return Math.round(t * 100) / 100;
  }, [effectiveService, pages, copies, printType, quantity, size, binding, lamination, svc, isXerox, isSpiral, isUnit, isCustom]);

  function applyPreset(preset) {
    setSelectedService(preset.serviceType);
    if (preset.pages)     setPages(preset.pages);
    if (preset.copies)    setCopies(preset.copies);
    if (preset.printType) setPrintType(preset.printType);
    if (preset.quantity)  setQuantity(preset.quantity);
    if (preset.size)      setSize(preset.size);
    setBinding(false);
    setLamination(false);
  }

  async function handleAddOrder() {
    setLoading(true);
    try {
      const orderData = {
        service: svc?.name || effectiveService,
        serviceType: effectiveService,
        total,
        status: 'pending',
      };
      if (isXerox) {
        orderData.pages = pages;
        orderData.copies = copies;
        orderData.printType = printType;
      }
      if (isSpiral || isUnit || isCustom) orderData.quantity = quantity;
      if (isSpiral) orderData.size = size;
      if (binding)    orderData.binding = true;
      if (lamination) orderData.lamination = true;
      await addOrder(orderData);
    } catch (e) {
      alert('Failed to add order');
    }
    setLoading(false);
  }

  return (
    <div style={{ background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Quick preset buttons — only if admin created presets for existing services */}
      {visiblePresets.length > 0 && (
        <div style={{
          padding: '8px 12px', borderBottom: '1px solid #f0f0f0',
          display: 'flex', flexWrap: 'wrap', gap: 6
        }}>
          {visiblePresets.map(p => (
            <button key={p._id} onClick={() => applyPreset(p)} style={{
              background: '#f0fdf7', color: '#1B8B5E', border: '1px solid #bbf7d0',
              borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 500,
            }}>{p.label}</button>
          ))}
        </div>
      )}

      <div style={{ padding: 16, flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>⚡</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>QUICK ORDER</span>
        </div>

        {services.length === 0 ? (
          <div style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚙️</div>
            No services configured yet.<br />
            <span style={{ fontSize: 12 }}>Admin → Services & Pricing → Reset Defaults</span>
          </div>
        ) : (
          <>
            <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Service</label>
            <select value={effectiveService} onChange={e => setSelectedService(e.target.value)} style={{
              width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px',
              fontSize: 14, marginBottom: 16, background: '#fff',
            }}>
              {services.map(s => <option key={s.type} value={s.type}>{s.name}</option>)}
            </select>

            {isXerox && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Pages</label>
                    <input type="number" min="1" value={pages}
                      onChange={e => setPages(Math.max(1, +e.target.value))} style={{
                        width: '100%', border: '2px solid #1B8B5E', borderRadius: 8,
                        padding: '9px 12px', fontSize: 16, fontWeight: 600, textAlign: 'center',
                      }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Copies</label>
                    <input type="number" min="1" value={copies}
                      onChange={e => setCopies(Math.max(1, +e.target.value))} style={{
                        width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8,
                        padding: '9px 12px', fontSize: 16, fontWeight: 600, textAlign: 'center',
                      }} />
                  </div>
                </div>
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 8 }}>Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  {['BW', 'Color'].map(t => (
                    <button key={t} onClick={() => setPrintType(t)} style={{
                      padding: '9px', borderRadius: 8, fontSize: 14, fontWeight: 600,
                      background: printType === t ? '#1B8B5E' : '#fff',
                      color: printType === t ? '#fff' : '#374151',
                      border: printType === t ? '2px solid #1B8B5E' : '1.5px solid #e5e7eb',
                    }}>{t === 'BW' ? 'B/W' : 'Color'}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={binding} onChange={e => setBinding(e.target.checked)} style={{ width: 15, height: 15 }} />
                    Binding (+₹10)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer' }}>
                    <input type="checkbox" checked={lamination} onChange={e => setLamination(e.target.checked)} style={{ width: 15, height: 15 }} />
                    Lamination (+₹20)
                  </label>
                </div>
              </>
            )}

            {(isSpiral || isUnit || isCustom) && (
              <div style={{ marginBottom: 16 }}>
                {isSpiral && (
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Size</label>
                    <select value={size} onChange={e => setSize(e.target.value)} style={{
                      width: '100%', border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '9px 12px', fontSize: 14,
                    }}>
                      {['A4', 'A3', 'Letter'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
                <label style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', display: 'block', marginBottom: 6 }}>Quantity</label>
                <input type="number" min="1" value={quantity}
                  onChange={e => setQuantity(Math.max(1, +e.target.value))} style={{
                    width: '100%', border: '2px solid #1B8B5E', borderRadius: 8,
                    padding: '9px 12px', fontSize: 16, fontWeight: 600, textAlign: 'center',
                  }} />
              </div>
            )}

            <div style={{
              background: '#f0fdf7', border: '1.5px solid #bbf7d0', borderRadius: 10,
              padding: '14px 16px', marginBottom: 16, textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: '#1B8B5E', fontWeight: 600, letterSpacing: 1, marginBottom: 4 }}>TOTAL</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#1B8B5E' }}>₹{total.toFixed(2)}</div>
            </div>

            <button onClick={handleAddOrder} disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: 10, background: '#1B8B5E',
              color: '#fff', fontSize: 15, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Adding...' : '⊕ Add Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
