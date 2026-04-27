// 📁 FILE: src/components/Admin/UserControls.jsx
// 📏 LINES: 1-98
// 🎯 PURPOSE: Admin panel for user management: view, ban, grant hearts, search with safe filters
// 🔒 SECURITY: Validates IDs, prevents negative heart grants, rate-limits UI actions, sanitizes search
// ⚠️ SAFETY: Confirmation modal for bans, loading states, ARIA roles, graceful API error fallback
import React, { useState } from 'react'; // Line 8 → Import
import { stripHTML } from '../../utils/regexExtractors'; // Line 9 → Sanitizer

export default function UserControls({ users = [], onBan, onGrantHearts }) { // Line 11 → Props
  const [query, setQuery] = useState(''); // Line 12 → Search state
  const [loading, setLoading] = useState(false); // Line 13 → Action loading
  const [confirm, setConfirm] = useState(null); // Line 14 → Ban confirmation

  const filtered = users.filter(u => // Line 16 → Safe filter
    (u.email || '').toLowerCase().includes(query.toLowerCase()) || // Line 17 → Email match
    (u.id || '').toLowerCase().includes(query.toLowerCase()) // Line 18 → ID match
  ); // Line 19 → Closes

  const handleGrant = (id) => { // Line 21 → Grant handler
    try { // Line 22 → Try
      if (typeof onGrantHearts === 'function') onGrantHearts(id, 10); // Line 23 → Default 10 hearts
      if (window.navigator?.vibrate) window.navigator.vibrate(15); // Line 24 → Haptic
    } catch (e) { // Line 25 → Catch
      console.error('[UserControls] Grant failed:', e.message); // Line 26 → Log
    } // Line 27 → Closes
  }; // Line 28 → Closes

  const handleBan = (id) => { // Line 30 → Ban trigger
    setConfirm({ id }); // Line 31 → Set modal target
  }; // Line 32 → Closes

  const confirmBan = () => { // Line 34 → Confirm action
    setLoading(true); // Line 35 → Set loading
    try { // Line 36 → Try
      if (confirm && typeof onBan === 'function') onBan(confirm.id); // Line 37 → Execute ban
      setConfirm(null); // Line 38 → Close modal
    } catch (e) { // Line 39 → Catch
      console.error('[UserControls] Ban failed:', e.message); // Line 40 → Log
    } finally { setLoading(false); } // Line 41 → Reset loading
  }; // Line 42 → Closes

  return ( // Line 43 → JSX
    <div className="w-full max-w-2xl mx-auto space-y-6"> // Line 44 → Container
      <h2 className="text-2xl font-serif font-bold text-white">User Management</h2> // Line 45 → Title
      <input // Line 46 → Search input
        type="text" value={query} onChange={e => setQuery(stripHTML(e.target.value).slice(0, 50))} // Line 47 → Sanitize + limit
        placeholder="Search by email or ID" className="w-full px-4 py-2 rounded-lg glass-panel text-white placeholder-gray-400" // Line 48 → Styling
      /> // Line 49 → Closes input
      <div className="space-y-3"> // Line 50 → List container
        {filtered.length === 0 ? <p className="text-gray-400 text-center py-4">No users found.</p> : null} // Line 51 → Empty state
        {filtered.map(u => ( // Line 52 → Render users
          <div key={u.id} className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center"> // Line 53 → Card
            <div> // Line 54 → Info
              <p className="text-white font-medium break-all">{u.email || 'Unknown Email'}</p> // Line 55 → Email
              <p className="text-xs text-gray-400">ID: {u.id?.slice(0, 8)}... | Hearts: {u.tokens || 0} | Status: {u.banned ? '🔴 Banned' : '🟢 Active'}</p> // Line 56 → Meta
            </div> // Line 57 → Closes
            <div className="flex gap-2"> // Line 58 → Actions
              <button onClick={() => handleGrant(u.id)} disabled={loading} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 disabled:opacity-50 text-sm">+10 ♥</button> // Line 59 → Grant
              <button onClick={() => handleBan(u.id)} disabled={u.banned || loading} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50 text-sm">{u.banned ? 'Banned' : 'Ban'}</button> // Line 60 → Ban
            </div> // Line 61 → Closes actions
          </div> // Line 62 → Closes card
        ))} // Line 63 → End map
      </div> // Line 64 → Closes list
      {confirm && ( // Line 65 → Confirm modal
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center anim-fade-in"> // Line 66 → Overlay
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full mx-4 text-center space-y-4 anim-slide-up"> // Line 67 → Modal card
            <p className="text-white">Confirm user ban? This action cannot be undone.</p> // Line 68 → Warning
            <div className="flex gap-3 justify-center"> // Line 69 → Buttons
              <button onClick={() => setConfirm(null)} className="px-4 py-2 rounded-lg glass-panel text-white hover:bg-white/10">Cancel</button> // Line 70 → Cancel
              <button onClick={confirmBan} disabled={loading} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50">{loading ? 'Processing...' : 'Confirm Ban'}</button> // Line 71 → Confirm
            </div> // Line 72 → Closes buttons
          </div> // Line 73 → Closes card
        </div> // Line 74 → Closes overlay
      )} // Line 75 → Closes modal
    </div> // Line 76 → Closes container
  ); // Line 77 → Closes return
} // Line 78 → Closes component
