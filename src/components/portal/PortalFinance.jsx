/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, Download, Eye, FileText, Landmark, Plus, ReceiptText, Wallet, X } from 'lucide-react';
import { formatDate, localDate, portalError } from '../../lib/portal';
import { downloadPortalExport } from '../../lib/portalExports';
import { accountBalance, centsFromInput, financeCsv, money, obligationBalance, obligationPaymentStatus } from '../../lib/portalFinance';
import { getFinanceDemo, setFinanceDemo } from '../../lib/portalFinanceDemo';
import { correctFinanceMovement, downloadFinanceDocument, getFinanceDocumentBlob, loadFinance, saveFinance, uploadFinanceDocument } from '../../lib/portalFinanceApi';
import { prepareFinanceDocument } from '../../lib/portalFinanceFile';
import PortalDocumentPreview from './PortalDocumentPreview';
import CopyRecordLink from './CopyRecordLink';
import UnsavedChangesPrompt from './UnsavedChangesPrompt';
import useUnsavedForm from '../../hooks/useUnsavedForm';
import './portal-finance.css';

const INITIAL = { accounts: [], obligations: [], movements: [], documents: [], audit: [] };
const KINDS = { income: 'Ingreso', expense: 'Egreso', transfer: 'Transferencia', receivable: 'Por cobrar', payable: 'Por pagar' };
const CATEGORIES = ['Capacitaciones', 'Revisiones', 'Equipamiento', 'Servicios', 'Honorarios', 'Traslados', 'Materiales', 'Impuestos', 'Alquiler', 'Transferencia', 'Otros'];
const METHODS = { cash: 'Efectivo', transfer: 'Transferencia', card: 'Tarjeta', other: 'Otro' };
const ACCOUNT_KINDS = { cash: 'Caja', bank: 'Banco', digital: 'Billetera digital', other: 'Otro fondo' };

function FinanceDialog({ modal, accounts, obligations, movements, institutions, busy, onClose, onSave }) {
  const ref = useRef(null);
  const [file, setFile] = useState(null);
  const [formError, setFormError] = useState('');
  const item = modal.record || {};
  const type = modal.type;
  const [attachmentKind, setAttachmentKind] = useState('invoice');
  const [customCategory, setCustomCategory] = useState(() => Boolean((modal.obligation?.category || item.category) && !CATEGORIES.includes(modal.obligation?.category || item.category)));
  const [form, setForm] = useState(() => ({
    name: item.name || '', kind: item.kind || (type === 'account' ? 'cash' : type === 'movement' ? modal.obligation?.direction === 'payable' ? 'expense' : 'income' : 'invoice'),
    currency: item.currency || modal.currency || 'ARS', opening_balance: item.opening_balance_cents != null ? (Number(item.opening_balance_cents) / 100).toFixed(2) : '',
    direction: item.direction || 'receivable', settlement_status: 'pending', institution_id: modal.obligation?.institution_id || item.institution_id || '', title: modal.obligation?.title || item.title || '',
    category: modal.obligation?.category || item.category || 'Capacitaciones', amount: modal.obligation ? (obligationBalance(modal.obligation, movements) / 100).toFixed(2) : item.amount_cents != null ? (Number(item.amount_cents) / 100).toFixed(2) : '',
    issued_on: item.issued_on || localDate(), due_on: item.due_on || '', occurred_on: item.occurred_on || localDate(),
    account_id: item.account_id || accounts.find((row) => !row.archived_at && row.currency === (modal.obligation?.currency || modal.currency || 'ARS'))?.id || '', destination_account_id: '',
    obligation_id: modal.obligation?.id || item.obligation_id || '', method: item.method || 'transfer',
    reference: item.reference || '', notes: item.notes || '', target: modal.target || '', target_id: modal.targetId || '',
    void_reason: '',
  }));
  const unsaved = useUnsavedForm(form, file, busy, onClose);
  useEffect(() => {
    const node = ref.current;
    node.showModal();
    return () => node.close();
  }, []);
  const set = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const chooseCategory = (value) => {
    setCustomCategory(value === '__custom__');
    set('category', value === '__custom__' ? '' : value);
  };
  const categoryField = <>
    <label>Categoría<select required value={customCategory ? '__custom__' : form.category} onChange={(event) => chooseCategory(event.target.value)}>
      {CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
      <option value="__custom__">Otra categoría…</option>
    </select></label>
    {customCategory && <label>Categoría personalizada<input required maxLength="100" value={form.category} onChange={(event) => set('category', event.target.value)} placeholder="Escribí la categoría" /></label>}
  </>;
  const selectedAccount = accounts.find((row) => row.id === form.account_id);
  const amountError = /importe|saldo pendiente/i.test(formError) ? formError : '';
  const matchedObligations = obligations.filter((row) => row.status === 'open' && row.currency === selectedAccount?.currency &&
    row.direction === (form.kind === 'income' ? 'receivable' : 'payable') && obligationBalance(row, movements) > 0);

  async function submit(event) {
    event.preventDefault();
    setFormError('');
    try {
    let payload;
    let initialSettlement = null;
    if (type === 'account') {
      payload = item.id ? { name: form.name.trim(), kind: form.kind, notes: form.notes.trim() } :
        { name: form.name.trim(), kind: form.kind, currency: form.currency, opening_balance_cents: form.opening_balance ? centsFromInput(form.opening_balance, true) : 0, notes: form.notes.trim() };
    } else if (type === 'obligation') {
      payload = item.id ? { title: form.title.trim(), category: form.category.trim(), amount_cents: centsFromInput(form.amount), due_on: form.due_on || null, reference: form.reference.trim(), notes: form.notes.trim() } : {
        direction: form.direction, institution_id: form.institution_id || null, title: form.title.trim(), category: form.category.trim(),
        amount_cents: centsFromInput(form.amount), currency: form.currency, issued_on: form.issued_on,
        due_on: form.due_on || null, reference: form.reference.trim(), notes: form.notes.trim(),
      };
      if (item.id) {
        const paid = Number(item.amount_cents) - obligationBalance(item, movements);
        if (payload.amount_cents < paid) throw new Error('El importe no puede ser menor que los cobros o pagos vigentes. Corregí esos movimientos primero.');
        if (payload.amount_cents === Number(item.amount_cents)) delete payload.amount_cents;
      }
      if (!item.id && form.settlement_status === 'settled') {
        if (!selectedAccount || selectedAccount.archived_at || selectedAccount.currency !== form.currency) throw new Error('Elegí un fondo activo de la misma moneda para registrarlo como saldado.');
        initialSettlement = {
          kind: form.direction === 'receivable' ? 'income' : 'expense', account_id: selectedAccount.id,
          destination_account_id: null, institution_id: form.institution_id || null,
          title: payload.title, category: payload.category, amount_cents: payload.amount_cents,
          occurred_on: form.occurred_on, method: form.method,
          reference: form.reference.trim(), notes: '',
        };
      }
    } else if (type === 'correction') {
      const amount = centsFromInput(form.amount);
      if (amount === Number(item.amount_cents)) throw new Error('Ingresá un importe diferente al registrado.');
      if (form.void_reason.trim().length < 3) throw new Error('Explicá el motivo de la corrección.');
      payload = { amount_cents: amount, reason: form.void_reason.trim() };
    } else if (type === 'movement') {
      const linked = obligations.find((row) => row.id === form.obligation_id);
      const amount = centsFromInput(form.amount);
      if (form.kind === 'transfer') {
        const destination = accounts.find((row) => row.id === form.destination_account_id);
        if (!selectedAccount || !destination || destination.id === selectedAccount.id || destination.currency !== selectedAccount.currency) throw new Error('Elegí dos fondos distintos de la misma moneda.');
      } else if (linked && (linked.currency !== selectedAccount?.currency || linked.direction !== (form.kind === 'income' ? 'receivable' : 'payable') || linked.status !== 'open' || amount > obligationBalance(linked, movements))) {
        throw new Error('El importe supera el saldo pendiente o no corresponde a ese fondo.');
      }
      payload = {
        kind: form.kind, account_id: form.account_id, destination_account_id: form.kind === 'transfer' ? form.destination_account_id : null,
        obligation_id: form.kind === 'transfer' ? null : form.obligation_id || null,
        institution_id: form.kind === 'transfer' ? null : linked?.institution_id || form.institution_id || null,
        title: form.title.trim(), category: form.category.trim(), amount_cents: amount,
        occurred_on: form.occurred_on, method: form.method, reference: form.reference.trim(), notes: form.notes.trim(),
      };
    } else if (type === 'settle') {
      const status = obligationPaymentStatus(item, movements);
      if (status.cancelled || status.settled || status.remaining <= 0) throw new Error('Este registro ya no tiene saldo pendiente.');
      if (!selectedAccount || selectedAccount.archived_at || selectedAccount.currency !== item.currency) throw new Error('Elegí un fondo activo de la misma moneda.');
      payload = {
        kind: item.direction === 'receivable' ? 'income' : 'expense', account_id: selectedAccount.id,
        obligation_id: item.id, institution_id: item.institution_id || null,
        destination_account_id: null, title: item.title, category: item.category,
        amount_cents: status.remaining, occurred_on: form.occurred_on,
        method: form.method, reference: form.reference.trim(), notes: '',
      };
    } else if (type === 'document') {
      if (!form.target_id) throw new Error('Elegí el pendiente o movimiento asociado.');
      payload = {
        obligation_id: form.target === 'obligation' ? form.target_id : null,
        movement_id: form.target === 'movement' ? form.target_id : null,
        kind: form.kind, title: form.title.trim(), notes: form.notes.trim(),
      };
      if (!file) throw new Error('Seleccioná un comprobante.');
    } else if (type === 'void') {
      if (form.void_reason.trim().length < 3) throw new Error('Explicá el motivo de anulación.');
      payload = { void_reason: form.void_reason.trim() };
    } else if (type === 'cancel') {
      if (movements.some((row) => row.obligation_id === item.id && !row.voided_at)) throw new Error('Anulá los pagos vigentes antes de cancelar el pendiente.');
      payload = { status: 'cancelled' };
    }
    const failure = await onSave(type, payload, type === 'settle' ? null : item.id, file, attachmentKind, initialSettlement);
    if (failure) setFormError(failure);
    } catch (failure) { setFormError(failure.message || 'Revisá los datos.'); }
  }

  return <dialog ref={ref} className="portal-dialog finance-dialog" aria-labelledby="finance-dialog-title"
    onCancel={(event) => { event.preventDefault(); if (unsaved.confirmDiscard) unsaved.setConfirmDiscard(false); else unsaved.requestClose(); }} onClick={(event) => { if (event.target === event.currentTarget) unsaved.requestClose(); }}>
    <div className="portal-dialog-inner">
      <header><div><span className="portal-eyebrow">TESORERÍA GRCP</span><h2 id="finance-dialog-title">{{ account: item.id ? 'Editar fondo' : 'Nuevo fondo', obligation: item.id ? 'Editar cobro o pago' : 'Nuevo cobro o pago', movement: 'Registrar movimiento', correction: 'Corregir importe', settle: item.direction === 'receivable' ? 'Marcar como cobrado' : 'Marcar como pagado', document: 'Adjuntar comprobante', void: 'Anular movimiento', cancel: 'Cancelar pendiente' }[type]}</h2></div><button type="button" className="portal-icon-button" aria-label="Cerrar" onClick={unsaved.requestClose}><X /></button></header>
      <form className="finance-form" onSubmit={submit}>
        {type === 'account' && <>
          {(modal.thenMovement || modal.thenSettlement) && <p className="finance-form-wide">Para {modal.thenSettlement ? 'marcar este registro como saldado' : 'registrar un movimiento'}, creá primero el fondo donde entrará o saldrá el dinero. Después se abrirá el formulario correspondiente.</p>}
          <label>Nombre del fondo<input required maxLength="120" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Caja, banco o billetera" /></label>
          <label>Tipo<select value={form.kind} onChange={(e) => set('kind', e.target.value)}>{Object.entries(ACCOUNT_KINDS).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
          {!item.id && <><label>Moneda<select value={form.currency} onChange={(e) => set('currency', e.target.value)}><option value="ARS">Pesos argentinos</option><option value="USD">Dólares</option></select></label><label>Saldo inicial<input type="text" inputMode="decimal" value={form.opening_balance} onChange={(e) => set('opening_balance', e.target.value)} placeholder="0,00" /></label></>}
        </>}
        {type === 'obligation' && <>
          {!item.id && <><label>Tipo<select value={form.direction} onChange={(e) => set('direction', e.target.value)}><option value="receivable">Por cobrar</option><option value="payable">Por pagar</option></select></label><label>Importe<input required type="text" inputMode="decimal" aria-invalid={Boolean(amountError)} value={form.amount} onChange={(e) => { setFormError(''); set('amount', e.target.value); }} placeholder="0,00" />{amountError && <small className="portal-field-error" role="alert">{amountError}</small>}</label><label>Moneda<select value={form.currency} onChange={(e) => { const nextCurrency = e.target.value; const fund = accounts.find((row) => !row.archived_at && row.currency === nextCurrency); setForm((old) => ({ ...old, currency: nextCurrency, account_id: fund?.id || '', settlement_status: fund ? old.settlement_status : 'pending' })); }}><option value="ARS">ARS</option><option value="USD">USD</option></select></label><label>Fecha de emisión<input required type="date" value={form.issued_on} onChange={(e) => set('issued_on', e.target.value)} /></label></>}
          {item.id && <label>Importe total {item.currency}<input required type="text" inputMode="decimal" aria-invalid={Boolean(amountError)} value={form.amount} onChange={(e) => { setFormError(''); set('amount', e.target.value); }} />{amountError && <small className="portal-field-error" role="alert">{amountError}</small>}</label>}
          <label>Concepto<input required maxLength="200" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Ej. Curso de RCP" /></label>
          <label>Institución<select disabled={Boolean(item.id)} value={form.institution_id} onChange={(e) => set('institution_id', e.target.value)}><option value="">Sin institución</option>{institutions.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>
          {categoryField}
          <label>Vence el<input type="date" min={form.issued_on} value={form.due_on} onChange={(e) => set('due_on', e.target.value)} /></label>
          {!item.id && <label>Estado<select value={form.settlement_status} onChange={(event) => set('settlement_status', event.target.value)}><option value="pending">{form.direction === 'receivable' ? 'Por cobrar' : 'Por pagar'}</option><option value="settled" disabled={!accounts.some((row) => !row.archived_at && row.currency === form.currency)}>{form.direction === 'receivable' ? 'Cobrado' : 'Pagado'}</option></select></label>}
          {!item.id && form.settlement_status === 'settled' && <div className="finance-initial-settlement finance-form-wide"><p>Se registrará el importe completo como {form.direction === 'receivable' ? 'cobro' : 'pago'} y quedará en movimientos.</p><div><label>Fondo<select required value={form.account_id} onChange={(event) => set('account_id', event.target.value)}><option value="">Elegí un fondo</option>{accounts.filter((row) => !row.archived_at && row.currency === form.currency).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label><label>Fecha del {form.direction === 'receivable' ? 'cobro' : 'pago'}<input required type="date" value={form.occurred_on} onChange={(event) => set('occurred_on', event.target.value)} /></label><label>Medio<select value={form.method} onChange={(event) => set('method', event.target.value)}>{Object.entries(METHODS).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label></div></div>}
          {!item.id && !accounts.some((row) => !row.archived_at && row.currency === form.currency) && <small className="finance-form-wide finance-setup-note">Para elegir {form.direction === 'receivable' ? 'Cobrado' : 'Pagado'} al crear, primero necesitás un fondo en {form.currency}. También podés crearlo como pendiente y marcarlo después desde la lista.</small>}
          {item.id && <p className="finance-form-wide">Estado actual: <strong>{obligationPaymentStatus(item, movements).label}</strong>. Para saldarlo, usá la acción de la lista.</p>}
          <div className="finance-attachment finance-form-wide">
            <strong>Comprobante o documento <small>(opcional)</small></strong>
            <div><label>Tipo<select value={attachmentKind} onChange={(event) => setAttachmentKind(event.target.value)}><option value="invoice">Factura</option><option value="receipt">Recibo o comprobante</option><option value="budget">Presupuesto</option><option value="other">Otro documento</option></select></label><label>Archivo<input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setFile(event.target.files?.[0] || null)} /></label></div>
            <small>JPG y PNG se optimizan si reducen el tamaño. PDF se conserva original. Máximo final: 10 MB. Podés adjuntar más archivos después.</small>
          </div>
        </>}
        {type === 'movement' && <>
          <label>Movimiento<select value={form.kind} onChange={(e) => { setCustomCategory(false); setForm((old) => ({ ...old, kind: e.target.value, category: e.target.value === 'transfer' ? 'Transferencia' : old.category === 'Transferencia' ? 'Capacitaciones' : old.category, method: e.target.value === 'transfer' ? 'transfer' : old.method, obligation_id: '', institution_id: '' })); }}><option value="income">Ingreso</option><option value="expense">Egreso</option><option value="transfer">Transferencia entre fondos</option></select></label>
          <label>{form.kind === 'transfer' ? 'Fondo de origen' : 'Fondo'}<select required value={form.account_id} onChange={(e) => setForm((old) => ({ ...old, account_id: e.target.value, obligation_id: '' }))}><option value="">Elegí un fondo</option>{accounts.filter((row) => !row.archived_at && row.currency === (modal.obligation?.currency || modal.currency || 'ARS')).map((row) => <option key={row.id} value={row.id}>{row.name} · {row.currency}</option>)}</select></label>
          {form.kind === 'transfer' ? <label>Fondo de destino<select required value={form.destination_account_id} onChange={(e) => set('destination_account_id', e.target.value)}><option value="">Elegí un fondo</option>{accounts.filter((row) => !row.archived_at && row.currency === selectedAccount?.currency && row.id !== form.account_id).map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label> : <>
            <label>Imputar a pendiente<select value={form.obligation_id} onChange={(e) => { const linked = obligations.find((row) => row.id === e.target.value); if (linked) setCustomCategory(!CATEGORIES.includes(linked.category)); setForm((old) => ({ ...old, obligation_id: e.target.value, institution_id: linked?.institution_id || '', title: linked?.title || old.title, category: linked?.category || old.category })); }}><option value="">Sin pendiente asociado</option>{matchedObligations.map((row) => <option key={row.id} value={row.id}>{row.title} · resta {money(obligationBalance(row, movements), row.currency)}</option>)}</select></label>
            {!form.obligation_id && <label>Institución<select value={form.institution_id} onChange={(e) => set('institution_id', e.target.value)}><option value="">Sin institución</option>{institutions.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label>}
          </>}
          <label>Importe {selectedAccount?.currency || ''}<input required type="text" inputMode="decimal" aria-invalid={Boolean(amountError)} value={form.amount} onChange={(e) => { setFormError(''); set('amount', e.target.value); }} placeholder="0,00" />{amountError && <small className="portal-field-error" role="alert">{amountError}</small>}</label>
          <label>Fecha<input required type="date" value={form.occurred_on} onChange={(e) => set('occurred_on', e.target.value)} /></label>
          <label>Concepto<input required maxLength="200" value={form.title} onChange={(e) => set('title', e.target.value)} /></label>
          {categoryField}
          <label>Medio<select disabled={form.kind === 'transfer'} value={form.method} onChange={(e) => set('method', e.target.value)}>{Object.entries(METHODS).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
        </>}
        {type === 'settle' && <>
          <p className="finance-form-wide">Se registrará {item.direction === 'receivable' ? 'un cobro' : 'un pago'} por el saldo completo de <strong>{money(obligationPaymentStatus(item, movements).remaining, item.currency)}</strong> para «{item.title}». El estado cambiará automáticamente y quedará en el historial.</p>
          <label>Fondo<select required value={form.account_id} onChange={(event) => set('account_id', event.target.value)}><option value="">Elegí un fondo</option>{accounts.filter((row) => !row.archived_at && row.currency === item.currency).map((row) => <option key={row.id} value={row.id}>{row.name} · {row.currency}</option>)}</select></label>
          <label>Fecha del {item.direction === 'receivable' ? 'cobro' : 'pago'}<input required type="date" value={form.occurred_on} onChange={(event) => set('occurred_on', event.target.value)} /></label>
          <label>Medio<select value={form.method} onChange={(event) => set('method', event.target.value)}>{Object.entries(METHODS).map(([key, value]) => <option key={key} value={key}>{value}</option>)}</select></label>
          <label>Referencia (opcional)<input maxLength="120" value={form.reference} onChange={(event) => set('reference', event.target.value)} placeholder="N.º de transferencia o recibo" /></label>
        </>}
        {type === 'document' && <>
          <label>Asociar a<select required value={`${form.target}:${form.target_id}`} onChange={(e) => { const [target, targetId] = e.target.value.split(':'); setForm((old) => ({ ...old, target, target_id: targetId })); }}><option value=":">Elegí un registro</option><optgroup label="Pendientes">{obligations.map((row) => <option key={row.id} value={`obligation:${row.id}`}>{row.title}</option>)}</optgroup><optgroup label="Movimientos">{movements.map((row) => <option key={row.id} value={`movement:${row.id}`}>{row.title} · {row.occurred_on}</option>)}</optgroup></select></label>
          <label>Tipo<select value={form.kind} onChange={(e) => set('kind', e.target.value)}><option value="invoice">Factura</option><option value="receipt">Recibo o comprobante</option><option value="budget">Presupuesto</option><option value="other">Otro</option></select></label>
          <label>Título<input required maxLength="200" value={form.title} onChange={(e) => set('title', e.target.value)} /></label>
          <label>Archivo PDF, JPG o PNG · hasta 10 MB finales<input required type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] || null)} /></label>
          <p className="finance-form-wide">Las imágenes se optimizan antes de subirlas si el archivo queda más liviano. Los PDF se guardan sin cambios.</p>
        </>}
        {type === 'void' && <><p>Se conservará el movimiento y su comprobante en el historial. Dejará de afectar el saldo y cualquier pendiente asociado.</p><label>Motivo de anulación<textarea required minLength="3" maxLength="500" value={form.void_reason} onChange={(e) => set('void_reason', e.target.value)} /></label></>}
        {type === 'correction' && <><p className="finance-form-wide">Importe actual: <strong>{money(item.amount_cents, accounts.find((row) => row.id === item.account_id)?.currency || 'ARS')}</strong>. La corrección anulará este movimiento y creará el reemplazo en un solo paso; ambos quedarán en el historial.</p><label>Importe correcto<input required type="text" inputMode="decimal" aria-invalid={Boolean(amountError)} value={form.amount} onChange={(e) => { setFormError(''); set('amount', e.target.value); }} />{amountError && <small className="portal-field-error" role="alert">{amountError}</small>}</label><label className="finance-form-wide">Motivo de corrección<textarea required minLength="3" maxLength="450" value={form.void_reason} onChange={(e) => set('void_reason', e.target.value)} placeholder="Ej. Error de carga en el comprobante" /></label></>}
        {type === 'cancel' && <p>El pendiente quedará cancelado y seguirá en el historial. Si ya tiene cobros o pagos vigentes, primero deben anularse.</p>}
        {['account', 'obligation', 'movement'].includes(type) && <>
          {(type === 'obligation' || type === 'movement') && <label>Referencia o número de comprobante<input maxLength="120" value={form.reference} onChange={(e) => set('reference', e.target.value)} /></label>}
          <label className="finance-form-wide">Notas<textarea maxLength={type === 'account' ? 2000 : 5000} value={form.notes} onChange={(e) => set('notes', e.target.value)} /></label>
        </>}
        {type === 'document' && <label className="finance-form-wide">Notas<textarea maxLength="2000" value={form.notes} onChange={(e) => set('notes', e.target.value)} /></label>}
        {formError && <p className="portal-alert error finance-form-error" role="alert">{formError}</p>}
        <div className="finance-form-actions"><button type="button" className="portal-button" onClick={unsaved.requestClose} disabled={busy}>Cancelar</button><button className="portal-button primary" disabled={busy}>{busy ? 'Guardando…' : type === 'void' ? 'Anular movimiento' : type === 'cancel' ? 'Cancelar pendiente' : type === 'settle' ? item.direction === 'receivable' ? 'Confirmar cobrado' : 'Confirmar pagado' : 'Guardar'}</button></div>
      </form>
    </div>
    {unsaved.confirmDiscard && <UnsavedChangesPrompt onKeep={() => unsaved.setConfirmDiscard(false)} onDiscard={unsaved.discard} />}
  </dialog>;
}

function FinanceDetail({ type, item, data, institutionName, onClose, onEdit, onCorrect, onAttach, onPreview, onOpenMovement }) {
  const ref = useRef(null);
  useEffect(() => { const node = ref.current; node.showModal(); return () => node.close(); }, []);
  const account = data.accounts.find((row) => row.id === item.account_id);
  const linkedMovements = type === 'obligation' ? data.movements.filter((row) => row.obligation_id === item.id) : [];
  const relatedIds = type === 'movement' ? [item.id, item.corrects_movement_id, ...data.movements.filter((row) => row.corrects_movement_id === item.id).map((row) => row.id)].filter(Boolean) : [];
  const docs = data.documents.filter((row) => type === 'obligation' ? row.obligation_id === item.id || linkedMovements.some((movement) => movement.id === row.movement_id) : type === 'movement' ? relatedIds.includes(row.movement_id) : false);
  const payment = type === 'obligation' ? obligationPaymentStatus(item, data.movements) : null;
  const audit = data.audit.filter((row) => row.record_id === item.id);
  const line = (title, value) => value !== undefined && value !== null && value !== '' && <div className="finance-detail-line"><dt>{title}</dt><dd>{value}</dd></div>;
  return <dialog ref={ref} className="portal-dialog finance-detail-dialog" aria-labelledby="finance-detail-title" onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <div className="portal-dialog-inner"><header><div><span className="portal-eyebrow">DETALLE DE TESORERÍA</span><h2 id="finance-detail-title">{item.title || item.name}</h2></div><button className="portal-icon-button" aria-label="Cerrar detalle" onClick={onClose}><X /></button></header>
      <div className="finance-detail-body"><dl>
        {line('Estado', type === 'obligation' ? payment.label : type === 'movement' ? item.voided_at ? 'Anulado' : 'Vigente' : item.archived_at ? 'Archivado' : 'Activo')}
        {line('Tipo', type === 'obligation' ? KINDS[item.direction] : type === 'movement' ? KINDS[item.kind] : ACCOUNT_KINDS[item.kind])}
        {line('Importe', type === 'obligation' ? money(item.amount_cents, item.currency) : type === 'movement' ? money(item.amount_cents, account?.currency) : money(accountBalance(item, data.movements), item.currency))}
        {type === 'obligation' && line('Saldo pendiente', money(payment.remaining, item.currency))}
        {line('Institución', item.institution_id ? institutionName(item.institution_id) : null)}
        {line('Categoría', item.category)}{line('Fondo', account?.name)}
        {line('Fondo destino', data.accounts.find((row) => row.id === item.destination_account_id)?.name)}
        {line('Fecha', item.occurred_on ? formatDate(item.occurred_on) : item.issued_on ? formatDate(item.issued_on) : formatDate(item.created_at))}
        {line('Vencimiento', item.due_on ? formatDate(item.due_on) : null)}
        {line('Medio', METHODS[item.method])}{line('Referencia', item.reference)}{line('Notas', item.notes)}
        {line('Motivo de anulación', item.void_reason)}
      </dl>
      {type === 'obligation' && <section><h3>Cobros y pagos registrados</h3>{linkedMovements.length ? linkedMovements.map((row) => <p key={row.id}><button className="finance-record-link" onClick={() => onOpenMovement(row)}>{formatDate(row.occurred_on)} · {money(row.amount_cents, item.currency)}</button> · {row.voided_at ? `Anulado: ${row.void_reason}` : 'Vigente'}</p>) : <p>Sin movimientos asociados.</p>}</section>}
      {type !== 'account' && <section><div className="finance-detail-heading"><h3>Comprobantes y documentos</h3><button onClick={onAttach}>Adjuntar</button></div>{docs.length ? docs.map((doc) => <button key={doc.id} className="finance-document-link" onClick={() => onPreview(doc)}><FileText size={17} /><span>{doc.title}<small>{doc.file_name}</small></span><Eye size={16} /></button>) : <p>Sin archivos adjuntos.</p>}</section>}
      {audit.length > 0 && <section><h3>Historial</h3>{audit.slice(0, 20).map((row) => <p key={row.id}>{formatDate(row.happened_at, true)} · {row.action === 'INSERT' ? 'Alta' : 'Cambio'}{row.before_data?.amount_cents !== row.after_data?.amount_cents && row.before_data?.amount_cents != null ? ` · Importe ${money(row.before_data.amount_cents, item.currency || account?.currency)} → ${money(row.after_data.amount_cents, item.currency || account?.currency)}` : ''}</p>)}</section>}
      <div className="finance-detail-actions"><CopyRecordLink />{type === 'obligation' && item.status !== 'cancelled' && <button className="portal-button primary" onClick={onEdit}>Editar registro</button>}{type === 'movement' && !item.voided_at && <button className="portal-button primary" onClick={onCorrect}>Corregir importe</button>}{type === 'account' && <button className="portal-button primary" onClick={onEdit}>Editar fondo</button>}</div></div>
    </div>
  </dialog>;
}

function FinanceObligationRow({ row, movements, institutionName, onDetail, onSettle, onPartial, onDocument, onEdit, onCancel }) {
  const payment = obligationPaymentStatus(row, movements);
  const action = row.direction === 'receivable' ? 'cobrado' : 'pagado';
  return <article className="finance-row" key={row.id}>
    <div>
      <span className={`finance-pill ${payment.cancelled ? 'cancelled' : payment.settled ? 'settled' : row.direction}`}>{payment.label}</span>
      <button className="finance-record-link" onClick={onDetail}>{row.title}</button>
      <small>{institutionName(row.institution_id)} · {row.category} · Emisión {formatDate(row.issued_on)}{row.due_on ? ` · Vence ${formatDate(row.due_on)}` : ''}</small>
      {payment.partial && <small>{row.direction === 'receivable' ? 'Cobro' : 'Pago'} parcial registrado</small>}
      {row.reference && <small>Ref. {row.reference}</small>}
    </div>
    <div className="finance-row-side">
      <strong>{payment.cancelled ? 'Sin saldo exigible' : payment.settled ? `${money(row.amount_cents, row.currency)} saldado` : `${money(payment.remaining, row.currency)} pendiente`}</strong>
      {!payment.cancelled && !payment.settled && <small>de {money(row.amount_cents, row.currency)}</small>}
      <div className="finance-row-actions">
        {!payment.cancelled && !payment.settled && <>
          <button className="finance-action-primary" onClick={onSettle}>Marcar como {action}</button>
          <button onClick={onPartial}>Registrar {row.direction === 'receivable' ? 'cobro' : 'pago'} parcial</button>
        </>}
        <button onClick={onDocument}>Comprobante</button>
        {!payment.cancelled && <button onClick={onEdit}>Editar</button>}
        {!payment.cancelled && !payment.settled && <button onClick={onCancel}>Cancelar</button>}
      </div>
    </div>
  </article>;
}

export default function PortalFinance({ institutions, demo }) {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState(() => demo ? getFinanceDemo() : INITIAL);
  useEffect(() => { if (demo) setFinanceDemo(data); }, [data, demo]);
  const [loading, setLoading] = useState(!demo), [busy, setBusy] = useState(false);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [view, setView] = useState('resumen'), [currency, setCurrency] = useState('ARS'), [institution, setInstitution] = useState(''), [search, setSearch] = useState('');
  const [modal, setModal] = useState(null), [detail, setDetail] = useState(null), [preview, setPreview] = useState(null), [limit, setLimit] = useState(50);
  const financeLink = params.get('finanza');
  const load = useCallback(async () => {
    if (demo) return;
    setLoading(true);
    try { setData(await loadFinance()); setError(''); }
    catch (failure) { setError(['42P01', 'PGRST205'].includes(failure.code) ? 'La tesorería aún no está activada en esta base. Aplicá la migración de finanzas antes de usarla.' : portalError(failure)); }
    finally { setLoading(false); }
  }, [demo]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const [type, id] = (financeLink || '').split(':');
    const table = { account: 'accounts', obligation: 'obligations', movement: 'movements' }[type];
    if (!table || !data[table].some((row) => row.id === id)) { if (!financeLink) setDetail(null); return; }
    setDetail({ type, id });
    setView({ account: 'fondos', obligation: 'pendientes', movement: 'movimientos' }[type]);
  }, [financeLink, data]);
  const institutionName = (id) => institutions.find((row) => row.id === id)?.name || 'Sin institución';
  const accountCurrency = (id) => data.accounts.find((row) => row.id === id)?.currency || 'ARS';
  const matching = (row) => !institution || row.institution_id === institution;
  const includesSearch = (row) => `${row.title || row.name || ''} ${row.category || ''} ${row.reference || ''} ${institutionName(row.institution_id)}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es'));
  const accounts = data.accounts.filter((row) => row.currency === currency);
  const obligations = data.obligations.filter((row) => row.currency === currency && matching(row) && includesSearch(row));
  const movements = data.movements.filter((row) => accountCurrency(row.account_id) === currency && matching(row) && includesSearch(row));
  const documents = data.documents.filter((row) => {
    const linked = data.obligations.find((item) => item.id === row.obligation_id) || data.movements.find((item) => item.id === row.movement_id);
    const linkedCurrency = row.obligation_id ? linked?.currency : accountCurrency(linked?.account_id);
    return linkedCurrency === currency && (!institution || linked?.institution_id === institution) && includesSearch({ ...row, institution_id: linked?.institution_id });
  });
  const pending = data.obligations.filter((row) => row.currency === currency && row.status === 'open' && matching(row));
  const receivable = pending.filter((row) => row.direction === 'receivable').reduce((sum, row) => sum + obligationBalance(row, data.movements), 0);
  const payable = pending.filter((row) => row.direction === 'payable').reduce((sum, row) => sum + obligationBalance(row, data.movements), 0);
  const totalFunds = accounts.reduce((sum, row) => sum + accountBalance(row, data.movements), 0);
  const month = localDate().slice(0, 7);
  const monthIncome = data.movements.filter((row) => !row.voided_at && row.kind === 'income' && row.occurred_on.startsWith(month) && matching(row) && accountCurrency(row.account_id) === currency).reduce((sum, row) => sum + Number(row.amount_cents), 0);
  const monthExpenses = data.movements.filter((row) => !row.voided_at && row.kind === 'expense' && row.occurred_on.startsWith(month) && matching(row) && accountCurrency(row.account_id) === currency);
  const monthExpense = monthExpenses.reduce((sum, row) => sum + Number(row.amount_cents), 0);
  const expenseCategories = Object.entries(monthExpenses.reduce((totals, row) => ({ ...totals, [row.category]: (totals[row.category] || 0) + Number(row.amount_cents) }), {})).sort((a, b) => b[1] - a[1]);
  const receivablesByInstitution = Object.entries(pending.filter((row) => row.direction === 'receivable').reduce((totals, row) => ({ ...totals, [row.institution_id || 'none']: (totals[row.institution_id || 'none'] || 0) + obligationBalance(row, data.movements) }), {})).sort((a, b) => b[1] - a[1]);
  const overdue = pending.filter((row) => row.due_on && row.due_on < localDate() && obligationBalance(row, data.movements) > 0).length;

  function demoSave(table, payload, id, file) {
    const rowId = id || crypto.randomUUID();
    setData((previous) => {
      const now = new Date().toISOString();
      const row = { ...(previous[table].find((item) => item.id === id) || {}), ...payload, id: rowId, created_at: id ? previous[table].find((item) => item.id === id)?.created_at : now };
      if (table === 'movements' && id) row.voided_at = now;
      if (file) Object.assign(row, { file_name: file.name, file_size: file.size, demoFile: file });
      return { ...previous, [table]: id ? previous[table].map((item) => item.id === id ? row : item) : [row, ...previous[table]] };
    });
    return { id: rowId };
  }
  async function perform(action, message, nextModal = null) {
    setBusy(true); setError(''); setNotice('');
    let committed = false;
    try {
      await action(); committed = true;
      if (!demo) await load();
      setModal(nextModal); setNotice(message);
      return null;
    } catch (failure) {
      if (committed || failure.partialFinanceSave) {
        if (!demo) await load().catch(() => {});
        setModal(null);
        setError(failure.partialFinanceSave
          ? `${failure.partialMessage || 'El pendiente se guardó, pero una acción posterior falló.'} ${portalError(failure)}`
          : 'El registro se guardó, pero no se pudo actualizar la lista. Recargá la página antes de volver a guardar.');
        return null;
      }
      const message = /^(El |La |Los |No se |Ingresá |Elegí |Seleccioná |Explicá |Anulá |Usá )/.test(failure.message || '') ? failure.message : portalError(failure);
      setError(message);
      return message;
    }
    finally { setBusy(false); }
  }
  function save(type, payload, id, file, attachmentKind, initialSettlement) {
    const table = { account: 'accounts', obligation: 'obligations', movement: 'movements', settle: 'movements', correction: 'movements', void: 'movements', cancel: 'obligations', document: 'documents' }[type];
    return perform(async () => {
      const preparedFile = file ? await prepareFinanceDocument(file) : null;
      if (type === 'obligation') {
        const saved = demo ? demoSave(table, payload, id) : await saveFinance(table, payload, id);
        if (initialSettlement) {
          try {
            const movementPayload = { ...initialSettlement, obligation_id: saved.id };
            if (demo) demoSave('movements', movementPayload);
            else await saveFinance('movements', movementPayload);
          } catch (failure) {
            failure.partialFinanceSave = true;
            failure.partialMessage = `El registro se guardó como ${payload.direction === 'receivable' ? 'Por cobrar' : 'Por pagar'}, pero no se pudo marcar como ${payload.direction === 'receivable' ? 'Cobrado' : 'Pagado'}. Podés completar el estado desde la lista.`;
            throw failure;
          }
        }
        if (preparedFile) {
          const documentPayload = { obligation_id: saved.id, movement_id: null, kind: attachmentKind,
            title: preparedFile.name.slice(0, 200), notes: '' };
          try {
            if (demo) demoSave('documents', documentPayload, null, preparedFile);
            else await uploadFinanceDocument(documentPayload, preparedFile);
          } catch (failure) {
            failure.partialFinanceSave = true;
            failure.partialMessage = 'El registro se guardó, pero el archivo no se adjuntó. Podés reintentar desde Comprobante en la lista.';
            throw failure;
          }
        }
      } else if (type === 'correction') {
        if (demo) {
          const original = data.movements.find((row) => row.id === id);
          demoSave('movements', { void_reason: `Corrección de importe: ${payload.reason}` }, id);
          demoSave('movements', { ...original, id: undefined, amount_cents: payload.amount_cents, corrects_movement_id: id, void_reason: '', voided_at: null });
        } else await correctFinanceMovement(id, payload.amount_cents, payload.reason);
      } else if (type === 'document') {
        if (demo) demoSave(table, payload, id, preparedFile);
        else await uploadFinanceDocument(payload, preparedFile);
      } else if (demo) demoSave(table, payload, id);
      else await saveFinance(table, payload, id);
    }, type === 'correction' ? 'Importe corregido. El movimiento original quedó anulado y el reemplazo está en el historial.' : type === 'void' ? 'Movimiento anulado con motivo registrado.' : type === 'cancel' ? 'Pendiente cancelado.' : type === 'settle' ? `Registrado como ${modal?.record?.direction === 'receivable' ? 'cobrado' : 'pagado'}.` : type === 'document' ? 'Comprobante guardado en archivos privados.' : initialSettlement ? `Registro creado como ${payload.direction === 'receivable' ? 'cobrado' : 'pagado'}.` : file ? 'Registro y comprobante guardados.' : 'Registro financiero guardado.',
    type === 'account' && !id && modal?.thenSettlement ? { type: 'settle', record: modal.obligation, currency: modal.currency }
      : type === 'account' && !id && modal?.thenMovement ? { type: 'movement', obligation: modal.obligation || null, currency: modal.currency } : null);
  }
  function changeArchive(account) {
    if (!account.archived_at && accountBalance(account, data.movements) !== 0) {
      setError('Transferí o ajustá el saldo antes de archivar el fondo.');
      return;
    }
    perform(async () => {
      const payload = { archived_at: account.archived_at ? null : new Date().toISOString() };
      if (demo) demoSave('accounts', payload, account.id);
      else await saveFinance('accounts', payload, account.id);
    }, account.archived_at ? 'Fondo reactivado.' : 'Fondo archivado. Su historial se conserva.');
  }
  async function download(document) {
    await perform(async () => {
      if (demo) {
        const url = URL.createObjectURL(document.demoFile);
        const anchor = window.document.createElement('a'); anchor.href = url; anchor.download = document.file_name; anchor.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else await downloadFinanceDocument(document);
    }, 'Comprobante descargado.');
  }
  const previewBlob = useCallback((document) => demo ? Promise.resolve(document.demoFile) : getFinanceDocumentBlob(document), [demo]);
  const selectedDetail = detail && data[{ obligation: 'obligations', movement: 'movements', account: 'accounts' }[detail.type]]?.find((row) => row.id === detail.id);
  function closeDetail() {
    setDetail(null);
    setParams((previous) => { const next = new URLSearchParams(previous); next.delete('finanza'); return next; }, { replace: true });
  }
  function openDetail(type, row) {
    setDetail({ type, id: row.id });
    setParams((previous) => { const next = new URLSearchParams(previous); next.set('finanza', `${type}:${row.id}`); return next; });
  }
  function fromDetail(nextModal) { closeDetail(); setModal(nextModal); }
  function openAudit(row) {
    const collection = row.entity.replace('portal_finance_', '');
    const record = data[collection]?.find((item) => item.id === row.record_id);
    if (!record) return;
    if (collection === 'documents') setPreview(record);
    else openDetail({ accounts: 'account', obligations: 'obligation', movements: 'movement' }[collection], record);
  }
  function exportRows(kind) {
    const csv = kind === 'movements'
      ? financeCsv(['Fecha', 'Tipo', 'Concepto', 'Categoría', 'Importe', 'Moneda', 'Fondo', 'Institución', 'Medio', 'Referencia', 'Anulado'], movements.map((row) => [row.occurred_on, KINDS[row.kind], row.title, row.category, (row.amount_cents / 100).toFixed(2), accountCurrency(row.account_id), data.accounts.find((item) => item.id === row.account_id)?.name, institutionName(row.institution_id), METHODS[row.method], row.reference, row.voided_at ? 'Sí' : 'No']))
      : financeCsv(['Tipo', 'Concepto', 'Categoría', 'Importe', 'Moneda', 'Pendiente', 'Institución', 'Emisión', 'Vencimiento', 'Estado', 'Referencia'], obligations.map((row) => [KINDS[row.direction], row.title, row.category, (row.amount_cents / 100).toFixed(2), row.currency, (obligationPaymentStatus(row, data.movements).remaining / 100).toFixed(2), institutionName(row.institution_id), row.issued_on, row.due_on, obligationPaymentStatus(row, data.movements).label, row.reference]));
    downloadPortalExport(csv, `tesoreria-${kind}-${localDate()}.csv`);
  }

  const hasActiveAccount = data.accounts.some((row) => !row.archived_at && row.currency === currency);
  function openMovement(obligation = null) {
    const chosenCurrency = obligation?.currency || currency;
    const hasFund = data.accounts.some((row) => !row.archived_at && row.currency === chosenCurrency);
    setModal(hasFund
      ? { type: 'movement', obligation, currency: chosenCurrency }
      : { type: 'account', thenMovement: true, obligation, currency: chosenCurrency });
  }
  function openSettlement(obligation) {
    const hasFund = data.accounts.some((row) => !row.archived_at && row.currency === obligation.currency);
    setModal(hasFund
      ? { type: 'settle', record: obligation, currency: obligation.currency }
      : { type: 'account', thenSettlement: true, obligation, currency: obligation.currency });
  }

  return <section className="finance-page" aria-label="Tesorería interna de GRCP">
    <div className="finance-intro"><div><span className="portal-eyebrow">USO INTERNO GRCP</span><h2>Control de fondos y compromisos</h2><p>Registrá cobros y pagos reales, seguí lo pendiente y conservá comprobantes. Los saldos se calculan desde los movimientos.</p>{!loading && !hasActiveAccount && <small>Para registrar en {currency}, creá primero un fondo. Te guiamos desde el botón.</small>}</div><button className="portal-button primary" disabled={busy || loading} onClick={() => openMovement()}><Plus size={16} /> {hasActiveAccount ? 'Registrar movimiento' : 'Crear fondo y registrar'}</button></div>
    <div className="finance-filters"><label>Moneda<select aria-label="Moneda de tesorería" value={currency} onChange={(event) => setCurrency(event.target.value)}><option value="ARS">Pesos argentinos</option><option value="USD">Dólares</option></select></label><label>Institución<select aria-label="Filtrar por institución" value={institution} onChange={(event) => setInstitution(event.target.value)}><option value="">Todas</option>{institutions.map((row) => <option key={row.id} value={row.id}>{row.name}</option>)}</select></label><label>Buscar<input aria-label="Buscar en tesorería" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Concepto, referencia…" /></label></div>
    {loading && <p role="status" className="portal-alert">Cargando tesorería…</p>}
    {error && <p role="alert" className="portal-alert error">{error}</p>}
    {notice && <p role="status" className="portal-alert success">{notice}</p>}
    <nav className="finance-tabs" aria-label="Secciones de tesorería">{[['resumen', 'Resumen'], ['pendientes', 'Cobros y pagos'], ['movimientos', 'Movimientos'], ['fondos', 'Fondos'], ['comprobantes', 'Comprobantes'], ['auditoria', 'Auditoría']].map(([key, title]) => <button key={key} type="button" className={view === key ? 'active' : ''} aria-current={view === key ? 'page' : undefined} onClick={() => { setView(key); setLimit(50); }}>{title}</button>)}</nav>
    {!loading && <>
      {view === 'resumen' && <><div className="finance-metrics"><article><Wallet /><span>Fondos registrados</span><strong>{money(totalFunds, currency)}</strong><small>Saldo global de los fondos en {currency}</small></article><article><ArrowDownLeft /><span>Por cobrar</span><strong>{money(receivable, currency)}</strong><small>Saldo de compromisos abiertos</small></article><article><ArrowUpRight /><span>Por pagar</span><strong>{money(payable, currency)}</strong><small>Saldo de costos pendientes</small></article><article><ReceiptText /><span>Vencidos</span><strong>{overdue}</strong><small>Pendientes con fecha pasada</small></article></div><div className="finance-summary-grid"><article className="finance-panel"><h3>Movimiento del mes</h3><div className="finance-summary-row"><span>Ingresos</span><strong>{money(monthIncome, currency)}</strong></div><div className="finance-summary-row"><span>Egresos</span><strong>{money(monthExpense, currency)}</strong></div><div className="finance-summary-row total"><span>Resultado de caja</span><strong>{money(monthIncome - monthExpense, currency)}</strong></div><p>Las transferencias entre fondos no alteran el resultado.</p></article><article className="finance-panel"><h3>Próximos compromisos</h3>{pending.filter((row) => obligationBalance(row, data.movements) > 0).sort((a, b) => (a.due_on || '9999').localeCompare(b.due_on || '9999')).slice(0, 5).map((row) => <div className="finance-summary-row" key={row.id}><span><button className="finance-record-link" onClick={() => openDetail('obligation', row)}>{row.title}</button><small>{row.due_on ? formatDate(row.due_on) : 'Sin vencimiento'} · {institutionName(row.institution_id)}</small></span><strong>{money(obligationBalance(row, data.movements), currency)}</strong></div>)}{!pending.length && <p>No hay pendientes registrados.</p>}</article><article className="finance-panel"><h3>Costos por categoría · este mes</h3>{expenseCategories.slice(0, 6).map(([category, amount]) => <div className="finance-summary-row" key={category}><span>{category}</span><strong>{money(amount, currency)}</strong></div>)}{!expenseCategories.length && <p>Sin egresos en este período.</p>}</article><article className="finance-panel"><h3>Cobros pendientes por institución</h3>{receivablesByInstitution.slice(0, 6).map(([id, amount]) => <div className="finance-summary-row" key={id}><span>{institutionName(id === 'none' ? null : id)}</span><strong>{money(amount, currency)}</strong></div>)}{!receivablesByInstitution.length && <p>Sin cobros pendientes.</p>}</article></div></>}
      {view === 'fondos' && <div className="finance-panel"><div className="finance-panel-heading"><div><h3>Fondos y cuentas</h3><p>Un fondo puede representar efectivo, banco o billetera. El saldo inicial queda fijo; los ajustes se registran como movimientos.</p></div><button className="portal-button primary" onClick={() => setModal({ type: 'account' })}><Plus size={16} /> Nuevo fondo</button></div>{accounts.length ? <div className="finance-grid">{accounts.map((row) => <article className="finance-card" key={row.id}><div className="finance-card-title"><Landmark size={19} /><span><button className="finance-record-link" onClick={() => openDetail('account', row)}>{row.name}</button><small>{ACCOUNT_KINDS[row.kind]} · {row.currency}{row.archived_at ? ' · Archivado' : ''}</small></span></div><strong className="finance-amount">{money(accountBalance(row, data.movements), row.currency)}</strong><p>{row.notes}</p><div className="finance-card-actions"><button onClick={() => setModal({ type: 'account', record: row })}>Editar</button><button disabled={busy} onClick={() => changeArchive(row)}>{row.archived_at ? 'Reactivar' : 'Archivar'}</button></div></article>)}</div> : <p className="finance-empty">Creá el primer fondo para registrar ingresos y gastos.</p>}</div>}
{view === 'pendientes' && <div className="finance-panel"><div className="finance-panel-heading"><div><h3>Cobros y pagos</h3><p>Cada registro muestra si está por cobrar o pagar, o si ya fue cobrado o pagado. Podés saldarlo en un paso y también registrar pagos parciales.</p></div><div className="finance-heading-actions"><button onClick={() => exportRows('obligations')} disabled={!obligations.length}><Download size={15} /> CSV</button><button className="portal-button primary" onClick={() => setModal({ type: 'obligation', currency })}><Plus size={16} /> Nuevo registro</button></div></div>{obligations.length ? <div className="finance-list">{obligations.slice(0, limit).map((row) => <FinanceObligationRow key={row.id} row={row} movements={data.movements} institutionName={institutionName} onDetail={() => openDetail('obligation', row)} onSettle={() => openSettlement(row)} onPartial={() => openMovement(row)} onDocument={() => setModal({ type: 'document', target: 'obligation', targetId: row.id })} onEdit={() => setModal({ type: 'obligation', record: row })} onCancel={() => setModal({ type: 'cancel', record: row })} />)}</div> : <p className="finance-empty">No hay pendientes para estos filtros.</p>}{obligations.length > limit && <button className="finance-more" onClick={() => setLimit((value) => value + 50)}>Mostrar más</button>}</div>}
      {view === 'movimientos' && <div className="finance-panel"><div className="finance-panel-heading"><div><h3>Libro de movimientos</h3><p>Podés corregir un importe; el original y el reemplazo quedarán registrados.</p></div><div className="finance-heading-actions"><button onClick={() => exportRows('movements')} disabled={!movements.length}><Download size={15} /> CSV</button><button className="portal-button primary" onClick={() => openMovement()}><Plus size={16} /> Registrar</button></div></div>{movements.length ? <div className="finance-list">{movements.slice(0, limit).map((row) => <article className={`finance-row ${row.voided_at ? 'voided' : ''}`} key={row.id}><div><span className={`finance-pill ${row.kind}`}>{row.kind === 'income' ? <ArrowDownLeft size={13} /> : row.kind === 'expense' ? <ArrowUpRight size={13} /> : <ArrowLeftRight size={13} />}{KINDS[row.kind]}</span><button className="finance-record-link" onClick={() => openDetail('movement', row)}>{row.title}</button><small>{formatDate(row.occurred_on)} · {data.accounts.find((item) => item.id === row.account_id)?.name || 'Fondo eliminado'}{row.destination_account_id ? ` → ${data.accounts.find((item) => item.id === row.destination_account_id)?.name}` : ''} · {institutionName(row.institution_id)}</small><small>{row.category} · {METHODS[row.method]}{row.reference ? ` · ${row.reference}` : ''}{row.voided_at ? ` · Anulado: ${row.void_reason}` : ''}</small></div><div className="finance-row-side"><strong>{row.kind === 'expense' ? '−' : row.kind === 'income' ? '+' : ''}{money(row.amount_cents, accountCurrency(row.account_id))}</strong><div className="finance-row-actions"><button onClick={() => setModal({ type: 'document', target: 'movement', targetId: row.id })}>Comprobante</button>{!row.voided_at && <button onClick={() => setModal({ type: 'correction', record: row })}>Corregir importe</button>}{!row.voided_at && <button onClick={() => setModal({ type: 'void', record: row })}>Anular</button>}</div></div></article>)}</div> : <p className="finance-empty">Todavía no hay movimientos para estos filtros.</p>}{movements.length > limit && <button className="finance-more" onClick={() => setLimit((value) => value + 50)}>Mostrar más</button>}</div>}
      {view === 'comprobantes' && <div className="finance-panel"><div className="finance-panel-heading"><div><h3>Documentos y comprobantes</h3><p>Archivos privados de GRCP vinculados a cada pendiente o movimiento. Se conservan como evidencia.</p></div><button className="portal-button primary" onClick={() => setModal({ type: 'document' })}><Plus size={16} /> Adjuntar</button></div>{documents.length ? <div className="finance-list">{documents.slice(0, limit).map((row) => <article className="finance-row" key={row.id}><div><FileText size={19} /><button className="finance-record-link" onClick={() => setPreview(row)}>{row.title}</button><small>{({ invoice: 'Factura', receipt: 'Recibo', budget: 'Presupuesto', other: 'Otro' })[row.kind]} · {row.file_name} · {formatDate(row.created_at)}</small><small>{row.obligation_id ? data.obligations.find((item) => item.id === row.obligation_id)?.title : data.movements.find((item) => item.id === row.movement_id)?.title}</small></div><div className="finance-row-actions"><button onClick={() => setPreview(row)}><Eye size={15} /> Ver</button><button onClick={() => download(row)}><Download size={15} /> Descargar</button></div></article>)}</div> : <p className="finance-empty">Todavía no hay comprobantes para estos filtros.</p>}{documents.length > limit && <button className="finance-more" onClick={() => setLimit((value) => value + 50)}>Mostrar más</button>}</div>}
      {view === 'auditoria' && <div className="finance-panel"><h3>Historial de cambios</h3><p>Altas, correcciones y anulaciones registradas con fecha y usuario.</p>{data.audit.length ? <div className="finance-list">{data.audit.slice(0, limit).map((row) => <button className="finance-audit-row" key={row.id} onClick={() => openAudit(row)}><strong>{row.action === 'INSERT' ? 'Alta' : 'Cambio'} · {row.entity.replace('portal_finance_', '')}</strong><span>{formatDate(row.happened_at, true)} · {row.actor_id?.slice(0, 8) || 'Sistema'}</span></button>)}</div> : <p className="finance-empty">Aún no hay cambios registrados.</p>}{data.audit.length > limit && <button className="finance-more" onClick={() => setLimit((value) => value + 50)}>Mostrar más</button>}</div>}
    </>}
    {modal && <FinanceDialog key={`${modal.type}:${modal.record?.id || ''}`} modal={modal} accounts={data.accounts} obligations={data.obligations} movements={data.movements} institutions={institutions} busy={busy} onClose={() => setModal(null)} onSave={save} />}
    {selectedDetail && <FinanceDetail key={`${detail.type}:${detail.id}`} type={detail.type} item={selectedDetail} data={data} institutionName={institutionName} onClose={closeDetail} onEdit={() => fromDetail({ type: detail.type, record: selectedDetail })} onCorrect={() => fromDetail({ type: 'correction', record: selectedDetail })} onAttach={() => fromDetail({ type: 'document', target: detail.type, targetId: detail.id })} onPreview={(document) => setPreview(document)} onOpenMovement={(row) => openDetail('movement', row)} />}
    {preview && <PortalDocumentPreview document={preview} getBlob={previewBlob} onDownload={download} onClose={() => setPreview(null)} />}
  </section>;
}
