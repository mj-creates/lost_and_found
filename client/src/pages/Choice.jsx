import { Link } from 'react-router-dom';

export default function Choice() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Title */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          What would you like to do?
        </h1>
        <p className="text-sm text-neutral-500">
          Pick an option to browse existing campus reports before submitting a new one.
        </p>
      </div>

      {/* Two Big Button Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Card 1: Lost (Red button) */}
        <div className="bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg p-6 flex flex-col justify-between transition-colors shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-lg mb-4 text-neutral-800">
              🔍
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">
              I Lost Something
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Search all items that have been found and reported on campus. If yours is not listed, report it so finders can contact you.
            </p>
          </div>

          <Link
            to="/lost"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md text-xs text-center transition-colors shadow-xs block"
          >
            I Lost Something →
          </Link>
        </div>

        {/* Card 2: Found (Green button) */}
        <div className="bg-white border border-neutral-200 hover:border-neutral-900 rounded-lg p-6 flex flex-col justify-between transition-colors shadow-xs">
          <div>
            <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-lg mb-4 text-neutral-800">
              🤝
            </div>
            <h2 className="text-lg font-bold text-neutral-900 mb-1">
              I Found Something
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed mb-6">
              Check if an owner is already searching for this item on campus. If not, post the found item so the owner can claim it.
            </p>
          </div>

          <Link
            to="/found"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-md text-xs text-center transition-colors shadow-xs block"
          >
            I Found Something →
          </Link>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-10 text-center">
        <Link
          to="/"
          className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← Or view all listings on the directory
        </Link>
      </div>
    </div>
  );
}
