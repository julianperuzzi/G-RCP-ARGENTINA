// Read link intent before the Auth SDK consumes the fragment; keep this module small
// so the public home does not need to load the Supabase client just for redirects.
export let authLinkType = new URLSearchParams(window.location.hash.slice(1)).get('type');
export function clearAuthLinkType() { authLinkType = null; }
