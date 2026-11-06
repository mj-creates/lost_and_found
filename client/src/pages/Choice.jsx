import { Link } from 'react-router-dom';

export default function Choice() {
  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          What would you like to do?
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Pick one of the options below. We check the other side's list first so you can spot an immediate match!
        </p>
      </div>

      {/* Two Big Buttons / Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Big Button 1: I Lost Something */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-red-200 hover:border-red-500 hover:shadow-xl transition-all duration-300 p-8 flex flex-col justify-between text-left group">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
              🔍
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
              Looking for your item
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
              I Lost Something
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Someone on campus might have already found it! Search through all recently reported <strong className="text-gray-800">found items</strong> first. If it's not there, you can post your lost item with details and contact info.
            </p>
          </div>

          <Link
            to="/lost"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center text-base flex items-center justify-center space-x-2 group-hover:translate-x-1"
          >
            <span>I Lost Something</span>
            <span>→</span>
          </Link>
        </div>

        {/* Big Button 2: I Found Something */}
        <div className="bg-white rounded-2xl shadow-md border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 p-8 flex flex-col justify-between text-left group">
          <div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
              🤝
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Help return an item
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-3">
              I Found Something
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Check if the owner has already posted looking for it! Browse through open <strong className="text-gray-800">lost items</strong> to contact the owner directly. If no match is found, post what you found with a photo.
            </p>
          </div>

          <Link
            to="/found"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-center text-base flex items-center justify-center space-x-2 group-hover:translate-x-1"
          >
            <span>I Found Something</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
