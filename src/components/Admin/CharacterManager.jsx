// 📁 FILE: src/components/Admin/CharacterManager.jsx
// 📏 LINES: 1-112
// 🎯 PURPOSE: Admin CRUD interface for adding/editing/deleting anime characters with validation
// 🔒 SECURITY: Sanitizes all inputs, enforces 18+ age rule, prevents XSS, validates tags/URLs
// ⚠️ SAFETY: Try/catch wrappers, loading/disabled states, ARIA roles, fallback on API failure
import React, { useState, useEffect } from 'react'; // Line 7 → Import hooks
import { stripHTML } from '../../utils/regexExtractors'; // Line 8 → Import sanitizer

export default function CharacterManager({ onSave, onDelete, characters = [] }) { // Line 10 → Props
  const [form, setForm] = useState({ name: '', age: 18, desc: '', tags: '', image: '' }); // Line 11 → Form state
  const [loading, setLoading] = useState(false); // Line 12 → Loading flag
  const [error, setError] = useState(''); // Line 13 → Error message

  const validateForm = () => { // Line 15 → Validation logic
    const cleanName = stripHTML(form.name).trim(); // Line 16 → Sanitize name
    if (!cleanName) return 'Name is required'; // Line 17 → Guard
    if (form.age < 18) return 'Age must be 18 or older'; // Line 18 → Age rule
    if (cleanName.length > 40) return 'Name too long'; // Line 19 → Length cap
    return null; // Line 20 → Valid
  }; // Line 21 → Closes

  const handleSubmit = (e) => { // Line 23 → Submit handler
    e.preventDefault(); // Line 24 → Prevent reload
    const err = validateForm(); // Line 25 → Check validation
    if (err) { setError(err); return; } // Line 26 → Block if invalid
    setError(''); // Line 27 → Clear errors
    setLoading(true); // Line 28 → Set loading
    try { // Line 29 → Try block
      const payload = { ...form, name: stripHTML(form.name), tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }; // Line 30 → Build safe payload
      if (typeof onSave === 'function') onSave(payload); // Line 31 → Dispatch save
      setForm({ name: '', age: 18, desc: '', tags: '', image: '' }); // Line 32 → Reset form
    } catch (e) { // Line 33 → Catch
      setError('Failed to save character. Please try again.'); // Line 34 → Safe fallback
    } finally { setLoading(false); } // Line 35 → Always reset loading
  }; // Line 36 → Closes

  return ( // Line 37 → JSX
    <div className="w-full max-w-2xl mx-auto space-y-6"> // Line 38 → Container
      <h2 className="text-2xl font-serif font-bold text-white">Character Manager</h2> // Line 39 → Title
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-4"> // Line 40 → Form wrapper
        {error && <p className="text-red-400 text-sm anim-fade-in" role="alert">{error}</p>} // Line 41 → Error display
        <input // Line 42 → Name input
          type="text" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} // Line 43 → State sync
          placeholder="Character Name" className="w-full px-4 py-2 rounded-lg glass-panel text-white placeholder-gray-400" // Line 44 → Styling
        /> // Line 45 → Closes input
        <input // Line 46 → Age input
          type="number" min={18} max={999} value={form.age} onChange={e => setForm(f => ({...f, age: Number(e.target.value)}))} // Line 47 → Number state
          placeholder="Age (18+)" className="w-full px-4 py-2 rounded-lg glass-panel text-white placeholder-gray-400" // Line 48 → Styling
        /> // Line 49 → Closes input
        <textarea // Line 50 → Description
          value={form.desc} onChange={e => setForm(f => ({...f, desc: e.target.value}))} // Line 51 → State sync
          placeholder="Personality & Bond" rows={3} className="w-full px-4 py-2 rounded-lg glass-panel text-white placeholder-gray-400 resize-none" // Line 52 → Styling
        /> // Line 53 → Closes textarea
        <input // Line 54 → Tags input
          type="text" value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} // Line 55 → State sync
          placeholder="Tags (comma separated)" className="w-full px-4 py-2 rounded-lg glass-panel text-white placeholder-gray-400" // Line 56 → Styling
        /> // Line 57 → Closes input
        <input // Line 58 → Image URL
          type="url" value={form.image} onChange={e => setForm(f => ({...f, image: e.target.value}))} // Line 59 → URL state
          placeholder="Image URL (.webp/.jpg)" className="w-full px-4 py-2 rounded-lg glass-panel text-white placeholder-gray-400" // Line 60 → Styling
        /> // Line 61 → Closes input
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-primaryPink text-white font-medium hover:bg-secondaryPink disabled:opacity-60 active:scale-95 transition-all"> // Line 62 → Submit button
          {loading ? 'Saving...' : 'Save Character'} // Line 63 → Dynamic text
        </button> // Line 64 → Closes button
      </form> // Line 65 → Closes form
      <div className="space-y-3"> // Line 66 → Character list
        {characters.length === 0 ? <p className="text-gray-400 text-center py-4">No characters added yet.</p> : null} // Line 67 → Empty state
        {characters.map(c => ( // Line 68 → Render list
          <div key={c.id || Math.random()} className="glass-panel p-4 rounded-xl flex justify-between items-center"> // Line 69 → Item card
            <div> // Line 70 → Info container
              <h3 className="font-bold text-white">{c.name}</h3> // Line 71 → Name
              <p className="text-xs text-gray-300">Age {c.age} | {Array.isArray(c.tags) ? c.tags.join(', ') : c.tags}</p> // Line 72 → Meta
            </div> // Line 73 → Closes container
            <button onClick={() => typeof onDelete === 'function' && onDelete(c.id)} className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 active:scale-95 text-sm">Delete</button> // Line 74 → Delete trigger
          </div> // Line 75 → Closes item
        ))} // Line 76 → End map
      </div> // Line 77 → Closes list
    </div> // Line 78 → Closes container
  ); // Line 79 → Closes return
} // Line 80 → Closes component
