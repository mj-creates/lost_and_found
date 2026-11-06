export default function StatusBadge({ status, type }) {
  const isReturned = status?.toLowerCase() === 'returned';
  const isLost = type?.toLowerCase() === 'lost';

  return (
    <div className="inline-flex items-center gap-2">
      {type && (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
            isLost ? 'bg-red-500' : 'bg-green-600'
          }`}
        >
          {type}
        </span>
      )}
      <span
        className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider shadow-sm ${
          isReturned
            ? 'bg-gray-100 text-gray-700 border border-gray-300'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
        }`}
      >
        {isReturned ? '✓ Returned' : '● Open'}
      </span>
    </div>
  );
}
