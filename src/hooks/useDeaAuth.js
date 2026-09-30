import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
export default function useDeaAuth() {
  const [session, setSession] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [recovery, setRecovery] = useState(false);
  const [error, setError] = useState('');
  const accessToken = session?.access_token;
  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase.auth.getSession().then(({ data, error: err }) => {
      if (!alive) return;
      if (err) setError('No pudimos recuperar la sesión. Volvé a ingresar.');
      setSession(data.session); setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession); setLoading(false);
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
      if (event === 'SIGNED_OUT') { setRole(null); setRecovery(false); }
    });
    return () => { alive = false; data.subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    let alive = true;
    setRole(null);
    if (!accessToken || !supabase) { setLoading(false); return; }
    setLoading(true);
    supabase.rpc('get_dea_role').then(({ data, error: err }) => {
      if (!alive) return;
      setRole(data || null); setLoading(false);
      if (err) setError('No pudimos verificar los permisos de tu cuenta.'); else setError('');
    });
    return () => { alive = false; };
  }, [accessToken]);
  return { session, role, loading, recovery, setRecovery, error };
}
