import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArrowUpRight, Download, History, LogOut, Pencil, Plus, RefreshCw, Search, ShieldCheck, Upload } from 'lucide-react';
import useDeaAuth from '../hooks/useDeaAuth';
import { fetchAllDeas, supabase } from '../lib/supabase';
import { normalizeText, availabilityLabels } from '../lib/dea';
import { parseDeaFile } from '../lib/deaImport';
import DeaLogin from '../components/dea/DeaLogin';
import DeaEditor from '../components/dea/DeaEditor';
import '../components/dea/dea.css';

const dateTime = value => new Date(value).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
export default function PanelDEA() {
  const auth = useDeaAuth();
  const [records,setRecords] = useState([]), [loading,setLoading] = useState(false), [busy,setBusy] = useState(false), [error,setError] = useState(''), [notice,setNotice] = useState('');
  const [query,setQuery] = useState(''), [filter,setFilter] = useState('active'), [page,setPage] = useState(0), [refresh,setRefresh] = useState(0);
  const [editor,setEditor] = useState(null), [archiveCandidate,setArchiveCandidate] = useState(null), [history,setHistory] = useState(null);
  const [importData,setImportData] = useState(null), [importPublished,setImportPublished] = useState(false);
  useEffect(() => {
    if (!auth.role) { setRecords([]); return; }
    let alive = true; setLoading(true); setError('');
    fetchAllDeas({ admin: true }).then(result => { if (alive) setRecords(result.records); }).catch(err => { if (alive) setError(err.message); }).finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [auth.role,refresh]);
  useEffect(() => { setPage(0); }, [query,filter]);
  const filtered = useMemo(() => records.filter(r => {
    const text = normalizeText(`${r.name} ${r.address} ${r.city} ${r.province}`);
    return text.includes(normalizeText(query)) && (filter === 'archived' ? Boolean(r.archived_at) : !r.archived_at && (filter === 'draft' ? !r.published : filter === 'unverified' ? r.verification !== 'verified' : true));
  }).sort((a,b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0)), [records,query,filter]);
  useEffect(() => { setPage(previous => Math.min(previous, Math.max(0, Math.ceil(filtered.length / 20) - 1))); }, [filtered.length]);
  const active = records.filter(r => !r.archived_at);
  async function save(payload, original) {
    if (original) {
      const { data,error: err } = await supabase.from('dea_locations').update(payload).eq('id',original.id).eq('updated_at',original.updated_at).select('id');
      if (err) throw new Error('No pudimos guardar. Revisá tus permisos y los datos.');
      if (!data.length) throw new Error('Otra persona modificó este registro o tus permisos cambiaron. Cerrá el editor y actualizá el listado.');
    } else {
      const { error: err } = await supabase.from('dea_locations').insert(payload);
      if (err) throw new Error('No pudimos crear la ubicación. Revisá los datos y tus permisos.');
    }
    setNotice('Ubicación guardada. Los cambios publicados ya se pueden consultar en el mapa.'); setRefresh(value => value+1);
  }
  async function archive(record, restore = false) {
    setBusy(true); setError(''); setNotice('');
    try {
      const { data,error: err } = await supabase.from('dea_locations').update({ archived_at: restore ? null : new Date().toISOString(), published: false }).eq('id',record.id).eq('updated_at',record.updated_at).select('id');
      if (err || !data.length) throw new Error('No pudimos actualizar. El registro pudo cambiar o tus permisos ya no lo permiten.');
      setArchiveCandidate(null); setNotice(restore ? 'Ubicación restaurada como borrador. Revisala antes de publicarla.' : 'Ubicación archivada y retirada del mapa. Podés restaurarla desde Archivados.'); setRefresh(value => value+1);
    } catch(err) { setError(err.message); } finally { setBusy(false); }
  }
  async function showHistory(record) {
    setError(''); setHistory({ record,entries: [],loading: true });
    const { data,error: err } = await supabase.from('dea_audit_log').select('id,action,actor_id,changed_at,before_data,after_data').eq('dea_id',record.id).order('changed_at',{ ascending: false }).limit(15);
    if (err) { setError('No pudimos consultar el historial.'); setHistory(null); } else setHistory({ record, entries: data, loading: false });
  }
  async function readImport(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setError(''); setNotice(''); setBusy(true); setImportData(null);
    try {
      if (file.size > 10*1024*1024) throw new Error('El archivo supera el límite de 10 MB.');
      const result = parseDeaFile(new Uint8Array(await file.arrayBuffer()),file.name);
      const existing = new Set(records.map(r => r.source_key).filter(Boolean));
      const accepted = result.records.filter(r => !existing.has(r.source_key));
      setImportData({ ...result, records: accepted, existing: result.records.length-accepted.length, filename: file.name });
      setImportPublished(false);
    } catch(err) { setError(err.message); } finally { setBusy(false); event.target.value = ''; }
  }
  async function commitImport() {
    setBusy(true); setError(''); let inserted = 0;
    try {
      // Batches are additive and repeat-safe; existing source keys are never overwritten.
      for(let i=0;i<importData.records.length;i+=100) {
        const batch = importData.records.slice(i,i+100).map(r => ({ ...r, published: importPublished }));
        const { data,error: err } = await supabase.from('dea_locations').upsert(batch,{ onConflict: 'source_key',ignoreDuplicates: true }).select('id');
        if (err) throw new Error(`La importación se detuvo después de ${inserted} altas. Actualizá y volvé a importar para completar sin duplicar registros.`);
        inserted += data.length;
      }
      setImportData(null); setNotice(`${inserted} ubicaciones importadas ${importPublished ? 'y publicadas' : 'como borradores para revisar'}.`);
    } catch(err) { setError(err.message); setImportData(null); } finally { setBusy(false); setRefresh(value => value+1); }
  }
  function exportData() {
    const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(),records: filtered },null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob), anchor = document.createElement('a'); anchor.href=url; anchor.download='grcp-dea-registro.json'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  async function logout() { const {error: err} = await supabase.auth.signOut(); if(err) setError('No pudimos cerrar la sesión. Intentá otra vez.'); }
  if(auth.loading) return <div className="dea-empty dea-page" role="status">Verificando sesión y permisos…</div>;
  if(!auth.session || auth.recovery || !supabase) return <div className="dea-page"><DeaLogin recovery={auth.recovery} onRecovered={() => auth.setRecovery(false)} /></div>;
  if(!auth.role) return <div className="dea-page grcp-container dea-access-pending"><ShieldCheck size={32} /><h1>Tu cuenta necesita autorización.</h1><p>Ingresaste como {auth.session.user.email}. La gestión está reservada a la cuenta oficial gruporcpsa@gmail.com.</p>{auth.error && <p className="dea-error">{auth.error}</p>}<Link className="grcp-button grcp-button-secondary" to="/MapaDEA">Ver el mapa público</Link><button className="dea-text-button" onClick={logout}>Cerrar sesión</button></div>;
  return <div className="dea-page dea-admin"><div className="grcp-container">
    <header className="dea-admin-heading"><div><p className="grcp-eyebrow">PANEL GRCP · {auth.role === 'admin' ? 'ADMINISTRADOR' : 'EDITOR'}</p><h1>Registro de <span>DEA.</span></h1><p>{auth.session.user.email}</p></div><div className="dea-admin-actions"><Link to="/MapaDEA" className="grcp-button grcp-button-secondary">Ver mapa <ArrowUpRight size={17} /></Link><button className="dea-icon-button" onClick={logout} aria-label="Cerrar sesión"><LogOut size={20} /></button></div></header>
    <div className="dea-admin-stats"><div><strong>{active.length}</strong><span>Ubicaciones activas</span></div><div><strong>{active.filter(r=>r.published).length}</strong><span>Publicadas</span></div><div><strong>{active.filter(r=>r.verification==='verified').length}</strong><span>Verificadas</span></div><div><strong>{active.filter(r=>r.verification!=='verified').length}</strong><span>Por verificar</span></div></div>
    {error && <p className="dea-error" role="alert">{error}</p>}{notice && <p className="dea-success" role="status">{notice}</p>}
    <>
      <div className="dea-admin-toolbar"><label className="dea-search-field"><Search size={18} /><input aria-label="Buscar en el registro DEA" placeholder="Buscar lugar o localidad" value={query} onChange={e=>setQuery(e.target.value)} /></label><select aria-label="Filtrar estado de los DEA" value={filter} onChange={e=>setFilter(e.target.value)}><option value="active">Activos</option><option value="draft">Borradores</option><option value="unverified">Por verificar</option><option value="archived">Archivados</option></select><button className="dea-icon-button" onClick={()=>setRefresh(value=>value+1)} disabled={loading||busy} aria-label="Actualizar registro"><RefreshCw size={18} /></button><button className="grcp-button grcp-button-primary" disabled={busy} onClick={()=>setEditor({ record: null })}><Plus size={17} />Nuevo DEA</button></div>
      <div className="dea-admin-secondary-actions"><label className={`dea-upload-button ${busy?'is-disabled':''}`}><Upload size={16} />Importar KMZ / KML<input type="file" accept=".kmz,.kml" onChange={readImport} disabled={busy} /></label><button onClick={exportData} disabled={loading||!filtered.length}><Download size={16} />Exportar listado</button><span>{filtered.length} registros</span></div>
      {importData && <section className="dea-import-preview"><h2>Revisar importación</h2><p>{importData.filename}: {importData.records.length} nuevas ubicaciones, {importData.existing} ya registradas y {importData.rejected.length} descartadas.</p><p>Los puntos importados quedan sin verificar. Los registros existentes y sus modificaciones se conservan.</p>{importData.rejected.length>0 && <details><summary>Ver registros descartados</summary><ul>{importData.rejected.map((r,i)=><li key={i}>{r.name}: {r.reason}</li>)}</ul></details>}<label className="dea-checkbox"><input type="checkbox" checked={importPublished} onChange={e=>setImportPublished(e.target.checked)} disabled={busy} />Publicar las nuevas ubicaciones sin verificar</label><div className="dea-admin-actions"><button className="grcp-button grcp-button-primary" onClick={commitImport} disabled={busy||!importData.records.length}>{busy?'Importando…':`Importar ${importData.records.length} ubicaciones`}</button><button className="grcp-button grcp-button-secondary" disabled={busy} onClick={()=>setImportData(null)}>Cancelar</button></div></section>}
      {archiveCandidate && <section className="dea-confirm-archive" role="alert"><h2>¿Archivar {archiveCandidate.name}?</h2><p>Se retirará del mapa público. Podés restaurarlo desde Archivados.</p><button className="grcp-button grcp-button-primary" disabled={busy} onClick={()=>archive(archiveCandidate)}>Confirmar archivo</button><button className="grcp-button grcp-button-secondary" disabled={busy} onClick={()=>setArchiveCandidate(null)}>Cancelar</button></section>}
      <div className="dea-table-wrap"><table><thead><tr><th>Lugar</th><th>Ubicación</th><th>Estado</th><th>Verificación</th><th>Acciones</th></tr></thead><tbody>{filtered.slice(page*20,page*20+20).map(record=><tr key={record.id}><td><strong>{record.name}</strong><small>{availabilityLabels[record.availability]}</small></td><td>{[record.city,record.province].filter(Boolean).join(', ')||'Localidad pendiente'}<small>{record.latitude.toFixed(5)}, {record.longitude.toFixed(5)}</small></td><td><span className={`dea-badge ${record.published&&!record.archived_at?'is-published':''}`}>{record.archived_at?'Archivado':record.published?'Publicado':'Borrador'}</span></td><td>{record.verification==='verified'?'Verificado':'Sin verificar'}<small>{record.verified_at||'Sin fecha'}</small></td><td><div className="dea-row-actions">{!record.archived_at?<><button disabled={busy} onClick={()=>setEditor({record})} aria-label={`Editar ${record.name}`}><Pencil size={17} /></button><button disabled={busy} onClick={()=>setArchiveCandidate(record)} aria-label={`Archivar ${record.name}`}><Archive size={17} /></button></>:<button disabled={busy} onClick={()=>archive(record,true)}>Restaurar</button>}<button onClick={()=>showHistory(record)} aria-label={`Historial de ${record.name}`}><History size={17} /></button></div></td></tr>)}</tbody></table>{loading && <p className="dea-empty" role="status">Cargando registro…</p>}{!loading&&!filtered.length&&<p className="dea-empty">No hay ubicaciones para este filtro. Podés crear un DEA o importar el KMZ.</p>}</div>
      <div className="dea-pagination"><button disabled={!page} onClick={()=>setPage(value=>value-1)}>Anterior</button><span>Página {Math.min(page+1,Math.max(1,Math.ceil(filtered.length/20)))} de {Math.max(1,Math.ceil(filtered.length/20))}</span><button disabled={(page+1)*20>=filtered.length} onClick={()=>setPage(value=>value+1)}>Siguiente</button></div>
      {history && <section className="dea-history"><div className="dea-selected-heading"><h2>Historial: {history.record.name}</h2><button className="dea-text-button" onClick={()=>setHistory(null)}>Cerrar historial</button></div>{history.loading?<p>Cargando cambios…</p>:<ul>{history.entries.map(entry=><li key={entry.id}><strong>{entry.action==='INSERT'?'Alta':entry.after_data?.archived_at&&!entry.before_data?.archived_at?'Archivado':entry.before_data?.archived_at&&!entry.after_data?.archived_at?'Restaurado':'Actualización'}</strong><span>{dateTime(entry.changed_at)} · {entry.actor_id===auth.session.user.id?'Tu cuenta':entry.actor_id?`Usuario ${entry.actor_id.slice(0,8)}`:'Importación inicial'}</span></li>)}</ul>}</section>}
    </>
    {editor && <DeaEditor record={editor.record} onClose={()=>setEditor(null)} onSave={save} />}
  </div></div>;
}
