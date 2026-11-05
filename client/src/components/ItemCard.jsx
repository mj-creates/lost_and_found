import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  if (!item) return null;

  const isLost = item.type?.toLowerCase() === 'lost';
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString()
    : item.createdAt
    ? new Date(item.createdAt).toLocaleDateString()
    : 'Recent';

  return (
    <Link
      to={`/item/${item._id}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100 flex flex-col relative"
    >
      {/* Type badge at top right */}
      <div className="absolute top-3 right-3 z-10">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${
            isLost ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          {item.type || 'Item'}
        </span>
      </div>

      {/* Image if available */}
      {item.imageUrl ? (
        <div className="w-full h-48 bg-gray-100 overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
          <svg
            className="w-12 h-12 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-2">
          {item.title}
        </h3>

        <div className="mt-auto space-y-1 text-sm text-gray-600">
          <p className="flex items-center">
            <span className="font-medium mr-1 text-gray-700">Location:</span>
            <span className="truncate">{item.location || 'Not specified'}</span>
          </p>
          <p className="flex items-center">
            <span className="font-medium mr-1 text-gray-700">Date:</span>
            <span>{formattedDate}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
