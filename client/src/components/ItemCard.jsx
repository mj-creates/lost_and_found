import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ItemCard({ item }) {
  if (!item) return null;

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString()
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : 'Recent';

  return (
    <Link
      to={`/item/${item._id}`}
      className="group bg-white rounded-lg border border-neutral-200 hover:border-neutral-900 transition-all flex flex-col overflow-hidden relative"
    >
      {/* Badges pinned at top right */}
      <div className="absolute top-2.5 right-2.5 z-10">
        <StatusBadge status={item.status} type={item.type} />
      </div>

      {/* Image */}
      {item.imageUrl ? (
        <div className="w-full h-44 bg-neutral-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
          />
        </div>
      ) : (
        <div className="w-full h-44 bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
          <span>No image provided</span>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-neutral-900 text-sm line-clamp-1 mb-1.5 group-hover:text-black">
          {item.title}
        </h3>

        <p className="text-neutral-500 text-xs line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="mt-auto pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="truncate max-w-[140px]">
            📍 {item.location || 'Campus'}
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
}
