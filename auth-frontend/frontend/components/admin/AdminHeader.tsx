interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <div style={{
      marginBottom: '28px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '14px',
    }}>
      {/* Accent bar */}
      <div style={{
        width: '3px',
        height: subtitle ? '48px' : '32px',
        background: 'linear-gradient(180deg, #10b981, #059669)',
        borderRadius: '2px',
        flexShrink: 0,
        marginTop: '3px',
      }} />
      <div>
        <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500, margin: 0, marginBottom: '4px', letterSpacing: '0.03em' }}>
          Admin &rsaquo; {title}
        </p>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0, marginTop: '4px', lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
