import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { authLinkType, clearAuthLinkType } from "../lib/authLink.js";
import { loadPortal, savePortal, uploadPortalDocument } from "../lib/portalApi";
import { nextOccurrence, portalError } from "../lib/portal";
import { createPortalDemo } from "../lib/portalDemo";

export default function usePortal(demo) {
  const [session, setSession] = useState(null),
    [context, setContext] = useState(null),
    [data, setData] = useState(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [recovery, setRecovery] = useState(
    authLinkType === "invite" || authLinkType === "recovery",
  );
  const [demoAdmin, setDemoAdmin] = useState(true);
  const generation = useRef(0);
  const invalidate = useCallback(() => {
    generation.current += 1;
  }, []);
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let alive = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (alive) {
        setSession(data.session);
        if (error) setError("No pudimos recuperar tu sesión.");
      }
    });
    const { data: auth } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") {
        clearAuthLinkType();
        setRecovery(false);
        setData(null);
        setContext(null);
      }
    });
    return () => {
      alive = false;
      auth.subscription.unsubscribe();
    };
  }, []);
  const token = session?.access_token;
  const reload = useCallback(async () => {
    if (demo) return;
    const current = ++generation.current;
    setLoading(true);
    setError("");
    setData(null);
    setContext(null);
    if (!token || !supabase) {
      setLoading(false);
      return;
    }
    try {
      const { data: access, error: failure } =
        await supabase.rpc("get_portal_context");
      if (failure) throw failure;
      const records = await loadPortal(access.is_admin);
      if (current !== generation.current) return;
      setContext(access);
      setData(records);
    } catch (failure) {
      if (current === generation.current) setError(portalError(failure));
    } finally {
      if (current === generation.current) setLoading(false);
    }
  }, [token, demo]);
  useEffect(() => {
    if (demo) {
      ++generation.current;
      setData(createPortalDemo());
      setLoading(false);
      setError("");
      return;
    }
    reload();
    return invalidate;
  }, [demo, reload, invalidate]);
  async function save(key, payload, id, file) {
    if (!demo) {
      const result =
        key === "documents" && file
          ? await uploadPortalDocument(payload, file)
          : await savePortal(key, payload, id);
      await reload();
      return result;
    }
    const existing = id ? data?.[key]?.find((row) => row.id === id) : null;
    const result = {
      ...(key === "requests" ? { status: "open", response: "" } : {}),
      ...existing,
      ...payload,
      id: id || crypto.randomUUID(),
      created_at: existing?.created_at || new Date().toISOString(),
    };
    if (file) Object.assign(result, { file_name: file.name, demoFile: file });
    setData((previous) => {
      const next = {
        ...previous,
        [key]: id
          ? previous[key].map((row) =>
              row.id === id ? { ...row, ...result } : row,
            )
          : [...previous[key], result],
      };
      if (
        key === "activities" &&
        payload.status === "completed" &&
        !previous.activities.some(
          (row) => row.recurrence_source_id === result.id,
        )
      ) {
        const future = nextOccurrence(result);
        if (future)
          next.activities = [
            ...next.activities,
            { ...future, id: crypto.randomUUID() },
          ];
      }
      if (key === "inspections")
        next.assets = next.assets.map((row) =>
          row.id === result.asset_id
            ? {
                ...row,
                next_review_on: result.next_review_on,
                status: {
                  pass: "operational",
                  attention: "attention",
                  fail: "out_of_service",
                }[result.result],
              }
            : row,
        );
      return next;
    });
    return result;
  }
  return {
    session,
    context: demo
      ? { is_admin: demoAdmin, email: "responsable@example.com" }
      : context,
    data,
    loading,
    error,
    reload,
    recovery,
    setRecovery: (value) => {
      if (!value) clearAuthLinkType();
      setRecovery(value);
    },
    save,
    demoAdmin,
    setDemoAdmin,
  };
}
