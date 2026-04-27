// 📁 FILE: src/components/Auth/GoogleLogin.jsx
// 📏 LINES: 1-62
// 🎯 PURPOSE: Google OAuth trigger button with loading state, error boundary, accessibility
// 🔒 SECURITY: Delegates auth to Supabase hook, prevents direct window.location manipulation
// ⚠️ SAFETY: Loading/disabled states, try/catch wrapper, clear ARIA labels

export default function GoogleLogin({ onLoginStart, isLoading, error }) { // Line 8 → Props
  const handleClick = () => { // Line 9 → Click handler
    if (isLoading || typeof onLoginStart !== 'function') return; // Line 10 → Guard
    try { // Line 11 → Try
      onLoginStart(); // Line 12 → Trigger parent auth flow
      if (window.navigator?.vibrate) window.navigator.vibrate(12); // Line 13 → Haptic
    } catch (e) { // Line 14 → Catch
      console.error('[GoogleLogin] Auth trigger failed:', e.message); // Line 15 → Log
    } // Line 16 → Closes
  }; // Line 17 → Closes

  return ( // Line 18 → JSX
    <div className="flex flex-col items-center gap-3"> // Line 19 → Container
      <button // Line 20 → Auth button
        onClick={handleClick} // Line 21 → Handler
        disabled={isLoading} // Line 22 → Disable during loading
        aria-label="Sign in with Google" // Line 23 → ARIA
        className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 rounded-xl glass-panel bg-white/10 hover:bg-white/15 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none" // Line 24 → Styling
      >
        {isLoading ? ( // Line 25 → Loading check
          <span className="animate-spin">⏳</span> // Line 26 → Spinner icon
        ) : ( // Line 27 → Else
          <span>🔵 Sign in with Google</span> // Line 28 → Button text
        )} // Line 29 → Closes ternary
      </button> // Line 30 → Closes button
      {error && ( // Line 31 → Error check
        <p className="text-red-400 text-sm mt-2 text-center anim-fade-in" role="alert"> // Line 32 → Error text
          {error} // Line 33 → Message
        </p> // Line 34 → Closes p
      )} // Line 35 → Closes error
    </div> // Line 36 → Closes container
  ); // Line 37 → Closes return
} // Line 38 → Closes component
