'use client';

import { useEffect, useState } from 'react';

export interface SavedCV {
  _id: string;
  name: string;
  content: string;
}

const inputClass =
  'w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm';

interface SavedCVSelectorProps {
  onSelect: (cv: SavedCV | null) => void;
}

export default function SavedCVSelector({ onSelect }: SavedCVSelectorProps) {
  const [cvs, setCvs] = useState<SavedCV[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('/api/job-apply/cvs')
      .then((res) => res.json())
      .then((data: SavedCV[]) => setCvs(data));
  }, []);

  useEffect(() => {
    const selected = cvs.find((c) => c._id === selectedId) ?? null;
    onSelect(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, cvs]);

  const resetForm = () => {
    setName('');
    setContent('');
  };

  const loadForEdit = (cv: SavedCV) => {
    setName(cv.name);
    setContent(cv.content);
    setEditingId(cv._id);
    setCreating(true);
    setError('');
  };

  const handleEditClick = () => {
    const selected = cvs.find((c) => c._id === selectedId);
    if (selected) loadForEdit(selected);
  };

  const handleCancel = () => {
    setCreating(false);
    setEditingId(null);
    resetForm();
    setError('');
  };

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) {
      setError('Name and CV text are required.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = { name: name.trim(), content: content.trim() };
      const res = await fetch(
        editingId ? `/api/job-apply/cvs/${editingId}` : '/api/job-apply/cvs',
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) throw new Error('Failed to save');
      const saved: SavedCV = await res.json();
      setCvs((prev) =>
        editingId ? prev.map((c) => (c._id === saved._id ? saved : c)) : [saved, ...prev]
      );
      setSelectedId(saved._id);
      setCreating(false);
      setEditingId(null);
      resetForm();
    } catch {
      setError('Could not save this CV. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Delete this saved CV? This cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/job-apply/cvs/${selectedId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setCvs((prev) => prev.filter((c) => c._id !== selectedId));
      setSelectedId('');
    } catch {
      setError('Could not delete this CV. Try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-3">
      <label htmlFor="cv-select" className="block text-sm font-semibold text-gray-800">
        My CV
      </label>
      <div className="flex gap-2">
        <select
          id="cv-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className={inputClass}
        >
          <option value="">Select a saved CV…</option>
          {cvs.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => (creating ? handleCancel() : setCreating(true))}
          className="px-4 py-2 text-sm font-medium text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          {creating ? 'Cancel' : '+ New CV'}
        </button>
        <button
          onClick={handleEditClick}
          disabled={!selectedId || creating}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={!selectedId || deleting}
          className="px-4 py-2 text-sm font-medium text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>

      {creating && (
        <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Label for this CV (e.g. Full Stack CV 2026)"
            className={inputClass}
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your CV text here"
            className={`${inputClass} h-64 resize-y font-mono`}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : editingId ? 'Update CV' : 'Save CV'}
          </button>
        </div>
      )}
    </div>
  );
}
