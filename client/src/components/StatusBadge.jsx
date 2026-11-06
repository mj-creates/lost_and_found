export default function StatusBadge({ status, type }) {
  const isReturned = status?.toLowerCase() === 'returned';
  const isLost = type?.toLowerCase() === 'lost';

  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
      {type && (
        <span
          className={`px-2 py-0.5 rounded uppercase ${
            isLost
              ? 'bg-red-600 text-white'
              : 'bg-emerald-600 text-white'
          }`}
        >
          {type}
        </span>
      )}
      <span
        className={`px-2 py-0.5 rounded border ${
          isReturned
            ? 'bg-amber-100 text-amber-800 border-amber-300'
            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
        }`}
      >
        {isReturned ? '✓ Returned' : '● Open'}
      </span>
    </div>
  );
}
