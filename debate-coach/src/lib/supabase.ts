import { createClient as createServerClient } from './supabase/server';
import { createClient as createBrowserClient } from './supabase/client';

// Export both client and server Supabase clients
export { createServerClient, createBrowserClient };

// For backward compatibility, export a default client
// This is a browser client that can be used in client components
const supabase = typeof window !== 'undefined' ? createBrowserClient() : null;

export default supabase; 