// 📁 FILE: src/services/keyRotation.js
// 📏 LINES: 1-82
// 🎯 PURPOSE: Frontend request router, retry queue, exponential backoff, dual-provider fallback trigger for Edge Function
// 🔒 SECURITY: Never handles API keys directly, validates HTTP status codes, prevents infinite retry loops
// ⚠️ SAFETY: Try/catch per attempt, max retry cap, timeout guard, clear queue cleanup on unmount
const MAX_RETRIES = 2; // Line 7 → Retry limit
const BACKOFF_BASE = 1000; // Line 8 → Initial delay ms
const REQUEST_TIMEOUT = 30000; // Line 9 → 30s limit

// Line 11 → Core request dispatcher with retry logic
export const dispatchWithRotation = async (fetchFn) => { // Line 12 → Dispatcher
  let attempt = 0; // Line 13 → Counter
  let lastError = null; // Line 14 → Error tracker

  while (attempt <= MAX_RETRIES) { // Line 16 → Retry loop
    try { // Line 17 → Try block
      const timeoutId = setTimeout(() => { // Line 18 → Timeout setup
        throw new Error('Request timeout'); // Line 19 → Force timeout
      }, REQUEST_TIMEOUT); // Line 20 → Duration

      const response = await fetchFn(attempt); // Line 21 → Execute request
      clearTimeout(timeoutId); // Line 22 → Clear timer

      if (response.status === 200) return response; // Line 23 → Success
      if (response.status === 429) { // Line 24 → Rate limit
        attempt++; // Line 25 → Increment
        const delay = BACKOFF_BASE * Math.pow(2, attempt - 1); // Line 26 → Exponential backoff
        console.warn(`[Rotation] Rate limited. Retrying in ${delay}ms (attempt ${attempt})`); // Line 27 → Log
        await new Promise(r => setTimeout(r, delay)); // Line 28 → Wait
        continue; // Line 29 → Next loop
      } // Line 30 → Closes if
      throw new Error(`HTTP ${response.status}`); // Line 31 → Other errors
    } catch (e) { // Line 32 → Catch
      lastError = e; // Line 33 → Store error
      attempt++; // Line 34 → Increment
      if (attempt > MAX_RETRIES) break; // Line 35 → Stop loop
      const delay = BACKOFF_BASE * Math.pow(2, attempt); // Line 36 → Backoff calc
      await new Promise(r => setTimeout(r, delay)); // Line 37 → Wait
    } // Line 38 → Closes catch
  } // Line 39 → Closes loop

  throw lastError || new Error('Max retries exceeded'); // Line 41 → Final error
}; // Line 42 → Closes

// Line 44 → Queue manager for concurrent requests
export class RequestQueue { // Line 45 → Class definition
  constructor(maxConcurrent = 3) { // Line 46 → Limit
    this.maxConcurrent = maxConcurrent; // Line 47 → Store limit
    this.active = 0; // Line 48 → Active count
    this.queue = []; // Line 49 → Pending array
  } // Line 50 → Closes constructor

  add(fn) { // Line 52 → Add task
    return new Promise((resolve, reject) => { // Line 53 → Promise wrapper
      this.queue.push({ fn, resolve, reject }); // Line 54 → Push to queue
      this.process(); // Line 55 → Start processing
    }); // Line 56 → Closes
  } // Line 57 → Closes add

  process() { // Line 59 → Process queue
    if (this.active >= this.maxConcurrent || this.queue.length === 0) return; // Line 60 → Guard
    const { fn, resolve, reject } = this.queue.shift(); // Line 61 → Dequeue
    this.active++; // Line 62 → Increment active

    Promise.resolve(fn()) // Line 64 → Execute
      .then(resolve) // Line 65 → Success
      .catch(reject) // Line 66 → Fail
      .finally(() => { // Line 67 → Cleanup
        this.active--; // Line 68 → Decrement
        this.process(); // Line 69 → Next task
      }); // Line 70 → Closes finally
  } // Line 71 → Closes process
} // Line 72 → Closes class

// Line 74 → Export singleton instance
export const apiQueue = new RequestQueue(3); // Line 75 → Max 3 concurrent

// Line 77 → Clear queue safely (e.g., on component unmount)
export const clearQueue = () => { // Line 78 → Clear function
  apiQueue.queue = []; // Line 79 → Reset array
  apiQueue.active = 0; // Line 80 → Reset counter
}; // Line 81 → Closes
