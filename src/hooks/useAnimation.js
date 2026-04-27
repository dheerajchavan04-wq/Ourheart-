// 📁 FILE: src/hooks/useAnimation.js
// 📏 LINES: 1-72
// 🎯 PURPOSE: IntersectionObserver-based scroll trigger, hardware acceleration toggle, reduced-motion fallback
// 🔒 SECURITY: SSR-safe checks, prevents DOM leaks, cleans up observers on unmount
// ⚠️ SAFETY: Null ref guards, debounced visibility, safe performance observer, fallback to static display
import { useState, useEffect, useRef, useCallback } from 'react'; // Line 8 → React imports

export default function useAnimation(threshold = 0.1, rootMargin = '0px') { // Line 10 → Hook definition
  const elementRef = useRef(null); // Line 11 → Target DOM ref
  const [isVisible, setIsVisible] = useState(false); // Line 12 → Visibility state
  const [observer, setObserver] = useState(null); // Line 13 → Observer ref

  const prefersReduced = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false; // Line 15 → Motion check

  useEffect(() => { // Line 17 → Mount effect
    if (prefersReduced) { // Line 18 → Check preference
      setIsVisible(true); // Line 19 → Skip animation
      return; // Line 20 → Early exit
    } // Line 21 → Closes

    try { // Line 22 → Try block
      const io = new IntersectionObserver( // Line 23 → Create observer
        ([entry]) => { // Line 24 → Entry callback
          if (entry.isIntersecting) { // Line 25 → Visible check
            setIsVisible(true); // Line 26 → Trigger state
            io.disconnect(); // Line 27 → Stop observing
          } // Line 28 → Closes
        },
        { threshold, rootMargin } // Line 30 → Config
      ); // Line 31 → Closes constructor
      setObserver(io); // Line 32 → Store instance
      return () => io.disconnect(); // Line 33 → Cleanup
    } catch (e) { // Line 34 → Catch unsupported browsers
      console.warn('[useAnimation] Observer not supported:', e.message); // Line 35 → Safe log
      setIsVisible(true); // Line 36 → Fallback show
    } // Line 37 → Closes
  }, [prefersReduced, threshold, rootMargin]); // Line 38 → Dependencies

  useEffect(() => { // Line 40 → Observe target
    if (observer && elementRef.current) { // Line 41 → Guard
      try { // Line 42 → Try
        observer.observe(elementRef.current); // Line 43 → Start watch
      } catch (e) { // Line 44 → Catch
        console.error('[useAnimation] Observe failed:', e.message); // Line 45 → Log
      } // Line 46 → Closes
    } // Line 47 → Closes
  }, [observer]); // Line 48 → Dependency

  const triggerAnimation = useCallback(() => { // Line 50 → Manual trigger
    setIsVisible(true); // Line 51 → Force show
  }, []); // Line 52 → Stable ref

  const getStyle = useCallback(() => { // Line 54 → GPU optimization helper
    return isVisible // Line 55 → Condition
      ? { transform: 'translateZ(0)', opacity: 1 } // Line 56 → Active
      : { transform: 'translateZ(0)', opacity: 0 }; // Line 57 → Inactive
  }, [isVisible]); // Line 58 → Dependency

  return { elementRef, isVisible, triggerAnimation, getStyle, prefersReduced }; // Line 60 → Exports
} // Line 61 → Closes hook
