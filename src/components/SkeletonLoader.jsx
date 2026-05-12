export default function SkeletonLoader({ lines = 3, height = 16, gap = 10 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height,
            width: i === lines - 1 ? '65%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ height = 120 }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 18, width: '40%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: '55%' }} />
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1, maxWidth: 320 }}>
        <div className="skeleton" style={{ height: 14, width: '90%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '50%' }} />
      </div>
    </div>
  );
}
