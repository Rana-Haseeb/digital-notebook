const COLORS = [
  'bg-yellow-50 border-yellow-200',
  'bg-blue-50 border-blue-200',
  'bg-green-50 border-green-200',
  'bg-pink-50 border-pink-200',
  'bg-purple-50 border-purple-200',
  'bg-orange-50 border-orange-200',
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function NoteCard({ note, index, onEdit, onDelete, deleting }) {
  const colorClass = COLORS[index % COLORS.length];

  return (
    <div
      className={`relative flex flex-col rounded-xl border ${colorClass} p-5 shadow-sm hover:shadow-md transition-shadow group ${deleting ? 'opacity-50 pointer-events-none' : ''}`}
    >
      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-base mb-2 line-clamp-1 pr-6">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 flex-1">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
        <span className="text-xs text-gray-400">{formatDate(note.updatedAt)}</span>

        {/* Action buttons — visible on hover */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-1.5 rounded-lg bg-white hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 text-gray-500 hover:text-indigo-600 transition"
            title="Edit note"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(note._id)}
            className="p-1.5 rounded-lg bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 text-gray-500 hover:text-red-500 transition"
            title="Delete note"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
