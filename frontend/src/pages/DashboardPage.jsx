import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create mode

  // Delete confirmation
  const [deletingId, setDeletingId] = useState(null);

  // Debounce timer ref
  const debounceRef = useRef(null);

  // ─── Fetch notes (with optional search term) ────────────────────────────────
  const fetchNotes = useCallback(async (term = '') => {
    setLoading(true);
    setFetchError('');
    try {
      const params = term.trim() ? { search: term.trim() } : {};
      const { data } = await api.get('/notes', { params });
      setNotes(data);
    } catch (err) {
      setFetchError(err.response?.data?.message || 'Failed to load notes.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Debounced search — fires backend request 400ms after user stops typing
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchNotes(value), 400);
  };

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // ─── Create ──────────────────────────────────────────────────────────────────
  const handleCreate = async ({ title, content }) => {
    const { data } = await api.post('/notes', { title, content });
    setNotes((prev) => [data, ...prev]);
  };

  // ─── Update ──────────────────────────────────────────────────────────────────
  const handleUpdate = async ({ title, content }) => {
    const { data } = await api.put(`/notes/${editingNote._id}`, { title, content });
    setNotes((prev) => prev.map((n) => (n._id === data._id ? data : n)));
  };

  // ─── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete note.');
    } finally {
      setDeletingId(null);
    }
  };

  // ─── Modal helpers ───────────────────────────────────────────────────────────
  const openCreate = () => { setEditingNote(null); setModalOpen(true); };
  const openEdit = (note) => { setEditingNote(note); setModalOpen(true); };
  const handleSave = (payload) => editingNote ? handleUpdate(payload) : handleCreate(payload);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-white w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Notes Manager</span>
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm uppercase">
                {user?.name?.[0]}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* Search + Add row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search notes by title or content…"
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {search && (
              <button
                onClick={() => { setSearch(''); fetchNotes(''); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Add Note button */}
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Note
          </button>
        </div>

        {/* Stats row */}
        {!loading && !fetchError && (
          <p className="text-sm text-gray-400 mb-4">
            {notes.length === 0
              ? search ? 'No notes match your search.' : 'No notes yet — create your first one!'
              : `${notes.length} note${notes.length !== 1 ? 's' : ''}${search ? ` for "${search}"` : ''}`}
          </p>
        )}

        {/* Error state */}
        {fetchError && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">{fetchError}</p>
            <button
              onClick={() => fetchNotes(search)}
              className="mt-3 text-sm text-indigo-600 hover:underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !fetchError && notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-gray-700 font-semibold text-lg mb-1">
              {search ? 'No results found' : 'No notes yet'}
            </h3>
            <p className="text-gray-400 text-sm mb-5">
              {search ? 'Try a different search term.' : 'Click "Add Note" to get started.'}
            </p>
            {!search && (
              <button
                onClick={openCreate}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
              >
                Create your first note
              </button>
            )}
          </div>
        )}

        {/* Notes grid */}
        {!loading && !fetchError && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notes.map((note, i) => (
              <NoteCard
                key={note._id}
                note={note}
                index={i}
                onEdit={openEdit}
                onDelete={handleDelete}
                deleting={deletingId === note._id}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Modal ─────────────────────────────────────────────────────────────── */}
      <NoteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        note={editingNote}
      />
    </div>
  );
}
