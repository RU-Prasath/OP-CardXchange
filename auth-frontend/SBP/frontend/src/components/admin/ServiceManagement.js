import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function ServiceManagement() {
  const { services, fetchServices, presets, fetchPresets, api } = useApp();

  // --- Service state ---
  const [showAddService, setShowAddService] = useState(false);
  const [serviceForm, setServiceForm] = useState({ name: '', pricing: { perUnit: 0 } });
  const [editId, setEditId] = useState(null);
  const [editPricing, setEditPricing] = useState({});

  // --- Preset state ---
  const [showAddPreset, setShowAddPreset] = useState(false);
  const [presetForm, setPresetForm] = useState({
    label: '', serviceType: '', pages: '', copies: '', printType: 'BW', quantity: '', size: 'A4'
  });

  // ── Services ──────────────────────────────────────────────
  async function handleAddService(e) {
    e.preventDefault();
    try {
      const slug = serviceForm.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
      await api.post('/services', { ...serviceForm, type: slug, isCustom: true });
      await fetchServices();
      setShowAddService(false);
      setServiceForm({ name: '', pricing: { perUnit: 0 } });
    } catch (err) { alert(err.response?.data?.message || 'Failed to add service'); }
  }

  async function handleUpdatePricing(svc) {
    try {
      await api.put(`/services/${svc._id}`, { pricing: editPricing });
      await fetchServices();
      setEditId(null);
    } catch { alert('Failed to update pricing'); }
  }

  async function handleDeleteService(id) {
    if (!window.confirm('Delete this service? Any presets using it will no longer appear.')) return;
    await api.delete(`/services/${id}`);
    await fetchServices();
  }

  async function handleSeed() {
    if (!window.confirm('Reset all services to defaults? Custom services will be removed.')) return;
    await api.post('/services/seed');
    await fetchServices();
  }

  // ── Presets ───────────────────────────────────────────────
  async function handleAddPreset(e) {
    e.preventDefault();
    const selectedSvc = services.find(s => s.type === presetForm.serviceType);
    if (!selectedSvc) return alert('Select a valid service');

    const payload = { label: presetForm.label, serviceType: presetForm.serviceType };
    const isXerox = ['xerox', 'brochure', 'offset'].includes(presetForm.serviceType);
    const isSpiral = ['spiral', 'lamination'].includes(presetForm.serviceType);

    if (isXerox) {
      payload.pages = Number(presetForm.pages) || 1;
      payload.copies = Number(presetForm.copies) || 1;
      payload.printType = presetForm.printType;
    } else if (isSpiral) {
      payload.quantity = Number(presetForm.quantity) || 1;
      payload.size = presetForm.size;
    } else {
      payload.quantity = Number(presetForm.quantity) || 1;
    }

    try {
      await api.post('/presets', payload);
      await fetchPresets();
      setShowAddPreset(false);
      setPresetForm({ label: '', serviceType: '', pages: '', copies: '', printType: 'BW', quantity: '', size: 'A4' });
    } catch (err) { alert(err.response?.data?.message || 'Failed to add shortcut'); }
  }

  async function handleDeletePreset(id) {
    if (!window.confirm('Delete this shortcut?')) return;
    await api.delete(`/presets/${id}`);
    await fetchPresets();
  }

  function renderPricingDisplay(svc) {
    const parts = [];
    if (svc.pricing?.bwPerPage != null)    parts.push(`B/W: ₹${svc.pricing.bwPerPage}/pg`);
    if (svc.pricing?.colorPerPage != null) parts.push(`Color: ₹${svc.pricing.colorPerPage}/pg`);
    if (svc.pricing?.perUnit != null)      parts.push(`₹${svc.pricing.perUnit}/unit`);
    if (svc.pricing?.sizes) {
      const sizesObj = svc.pricing.sizes;
      const entries = typeof sizesObj.entries === 'function'
        ? [...sizesObj.entries()]
        : Object.entries(sizesObj);
      parts.push(entries.map(([k, v]) => `${k}: ₹${v}`).join(', '));
    }
    return parts.join(' | ') || 'No pricing set';
  }

  const presetSvc = services.find(s => s.type === presetForm.serviceType);
  const presetIsXerox = ['xerox', 'brochure', 'offset'].includes(presetForm.serviceType);
  const presetIsSpiral = ['spiral', 'lamination'].includes(presetForm.serviceType);
  const presetIsUnit = presetForm.serviceType === 'idcard' || presetSvc?.isCustom;

  return (
    <div>
      {/* ── SERVICES SECTION ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Services & Pricing</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleSeed} style={{
            background: '#f3f4f6', color: '#374151', borderRadius: 8, padding: '7px 14px', fontSize: 13
          }}>Reset Defaults</button>
          <button onClick={() => setShowAddService(true)} style={{
            background: '#1B8B5E', color: '#fff', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600
          }}>+ Add Service</button>
        </div>
      </div>

      {showAddService && (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>New Custom Service</h4>
          <form onSubmit={handleAddService} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Service Name</label>
              <input required value={serviceForm.name}
                onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="e.g. Photo Print"
                style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Price per Unit (₹)</label>
              <input type="number" min="0" step="0.5" value={serviceForm.pricing.perUnit}
                onChange={e => setServiceForm({ ...serviceForm, pricing: { perUnit: +e.target.value } })}
                style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 110 }} />
            </div>
            <button type="submit" style={{ background: '#1B8B5E', color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600 }}>Add</button>
            <button type="button" onClick={() => setShowAddService(false)} style={{ background: '#f3f4f6', color: '#374151', borderRadius: 8, padding: '9px 14px', fontSize: 14 }}>Cancel</button>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
        {services.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
            No services yet. Click "Reset Defaults" to load default services.
          </p>
        )}
        {services.map(svc => (
          <div key={svc._id} style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '12px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{svc.name}</span>
                  {svc.isCustom && (
                    <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 11, padding: '1px 6px', borderRadius: 10 }}>Custom</span>
                  )}
                </div>
                {editId === svc._id ? (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                    {svc.pricing?.bwPerPage != null && (
                      <label style={{ fontSize: 12 }}>B/W/pg (₹):
                        <input type="number" step="0.5" defaultValue={svc.pricing.bwPerPage}
                          onChange={e => setEditPricing(p => ({ ...p, bwPerPage: +e.target.value }))}
                          style={{ width: 65, border: '1px solid #ddd', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }} />
                      </label>
                    )}
                    {svc.pricing?.colorPerPage != null && (
                      <label style={{ fontSize: 12 }}>Color/pg (₹):
                        <input type="number" step="0.5" defaultValue={svc.pricing.colorPerPage}
                          onChange={e => setEditPricing(p => ({ ...p, colorPerPage: +e.target.value }))}
                          style={{ width: 65, border: '1px solid #ddd', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }} />
                      </label>
                    )}
                    {svc.pricing?.perUnit != null && (
                      <label style={{ fontSize: 12 }}>Per unit (₹):
                        <input type="number" step="0.5" defaultValue={svc.pricing.perUnit}
                          onChange={e => setEditPricing(p => ({ ...p, perUnit: +e.target.value }))}
                          style={{ width: 65, border: '1px solid #ddd', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }} />
                      </label>
                    )}
                    {svc.pricing?.sizes && (() => {
                      const sizesObj = svc.pricing.sizes;
                      const entries = typeof sizesObj.entries === 'function' ? [...sizesObj.entries()] : Object.entries(sizesObj);
                      return entries.map(([sz, price]) => (
                        <label key={sz} style={{ fontSize: 12 }}>{sz} (₹):
                          <input type="number" defaultValue={price}
                            onChange={e => setEditPricing(p => ({ ...p, sizes: { ...(p.sizes || {}), [sz]: +e.target.value } }))}
                            style={{ width: 60, border: '1px solid #ddd', borderRadius: 4, padding: '2px 6px', marginLeft: 4 }} />
                        </label>
                      ));
                    })()}
                    <button onClick={() => handleUpdatePricing(svc)} style={{ background: '#1B8B5E', color: '#fff', borderRadius: 6, padding: '4px 12px', fontSize: 12 }}>Save</button>
                    <button onClick={() => setEditId(null)} style={{ background: '#f3f4f6', color: '#374151', borderRadius: 6, padding: '4px 10px', fontSize: 12 }}>Cancel</button>
                  </div>
                ) : (
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{renderPricingDisplay(svc)}</div>
                )}
              </div>
              {editId !== svc._id && (
                <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
                  <button onClick={() => { setEditId(svc._id); setEditPricing({ ...svc.pricing }); }}
                    style={{ background: '#eff6ff', color: '#3b82f6', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12 }}>
                    Edit Price
                  </button>
                  {svc.isCustom && (
                    <button onClick={() => handleDeleteService(svc._id)}
                      style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12 }}>
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK SHORTCUTS SECTION ── */}
      <div style={{ borderTop: '2px solid #e5e7eb', paddingTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700 }}>Quick Order Shortcuts</h3>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
              Shortcut buttons on the POS screen — only appear when the linked service exists.
            </p>
          </div>
          <button onClick={() => setShowAddPreset(true)} disabled={services.length === 0} style={{
            background: services.length === 0 ? '#e5e7eb' : '#1B8B5E',
            color: services.length === 0 ? '#9ca3af' : '#fff',
            borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600,
            cursor: services.length === 0 ? 'not-allowed' : 'pointer'
          }}>+ Add Shortcut</button>
        </div>

        {showAddPreset && (
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16, marginBottom: 16 }}>
            <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 600 }}>New Quick Shortcut</h4>
            <form onSubmit={handleAddPreset} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Button Label</label>
                  <input required value={presetForm.label}
                    onChange={e => setPresetForm({ ...presetForm, label: e.target.value })}
                    placeholder="e.g. 1pg B/W"
                    style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 140 }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Service</label>
                  <select required value={presetForm.serviceType}
                    onChange={e => setPresetForm({ ...presetForm, serviceType: e.target.value })}
                    style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>
                    <option value="">-- Select service --</option>
                    {services.map(s => <option key={s.type} value={s.type}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {presetIsXerox && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Pages</label>
                    <input type="number" min="1" required value={presetForm.pages}
                      onChange={e => setPresetForm({ ...presetForm, pages: e.target.value })}
                      style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 80 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Copies</label>
                    <input type="number" min="1" required value={presetForm.copies}
                      onChange={e => setPresetForm({ ...presetForm, copies: e.target.value })}
                      style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 80 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Print Type</label>
                    <select value={presetForm.printType}
                      onChange={e => setPresetForm({ ...presetForm, printType: e.target.value })}
                      style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>
                      <option value="BW">B/W</option>
                      <option value="Color">Color</option>
                    </select>
                  </div>
                </div>
              )}

              {(presetIsSpiral || presetIsUnit) && (
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Quantity</label>
                    <input type="number" min="1" required value={presetForm.quantity}
                      onChange={e => setPresetForm({ ...presetForm, quantity: e.target.value })}
                      style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, width: 80 }} />
                  </div>
                  {presetIsSpiral && (
                    <div>
                      <label style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Size</label>
                      <select value={presetForm.size}
                        onChange={e => setPresetForm({ ...presetForm, size: e.target.value })}
                        style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14 }}>
                        {['A4', 'A3', 'Letter'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" style={{ background: '#1B8B5E', color: '#fff', borderRadius: 8, padding: '9px 18px', fontSize: 14, fontWeight: 600 }}>Add Shortcut</button>
                <button type="button" onClick={() => setShowAddPreset(false)} style={{ background: '#f3f4f6', color: '#374151', borderRadius: 8, padding: '9px 14px', fontSize: 14 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {presets.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: 13, padding: '12px 0' }}>
              No shortcuts yet. Shortcuts you add here will appear as quick-access buttons on the POS screen.
            </p>
          ) : presets.map(p => {
            const linkedSvc = services.find(s => s.type === p.serviceType);
            const active = !!linkedSvc;
            const details = [
              p.pages    && `${p.pages}pg`,
              p.copies   && `×${p.copies}`,
              p.printType,
              p.quantity && `Qty ${p.quantity}`,
              p.size,
            ].filter(Boolean).join(' ');
            return (
              <div key={p._id} style={{
                background: '#fff',
                border: `1.5px solid ${active ? '#e5e7eb' : '#fecaca'}`,
                borderRadius: 10, padding: '10px 14px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{
                    background: active ? '#f0fdf7' : '#fef2f2',
                    color: active ? '#1B8B5E' : '#ef4444',
                    border: `1px solid ${active ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: 20, padding: '3px 12px', fontSize: 12, fontWeight: 600
                  }}>{p.label}</span>
                  <span style={{ fontSize: 12, color: '#6b7280' }}>
                    {linkedSvc ? linkedSvc.name : <span style={{ color: '#ef4444' }}>Service deleted</span>}
                    {details && ` · ${details}`}
                  </span>
                  {!active && <span style={{ fontSize: 11, color: '#ef4444', fontWeight: 500 }}>⚠ Hidden on POS</span>}
                </div>
                <button onClick={() => handleDeletePreset(p._id)} style={{
                  background: '#fef2f2', color: '#ef4444', border: 'none',
                  borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer'
                }}>Delete</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
