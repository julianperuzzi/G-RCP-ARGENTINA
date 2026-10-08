export const FINANCE_BUCKET = 'grcp-finanzas';
export const FINANCE_TABLES = ['accounts', 'obligations', 'movements', 'documents', 'audit'];

export function centsFromInput(value, allowZero = false) {
  const raw = String(value ?? '').trim().replace(/\s/g, '');
  const normalized = /^\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?$/.test(raw)
    ? raw.replaceAll('.', '').replace(',', '.')
    : raw.replace(',', '.');
  if (!/^(?:\d{1,11})(?:\.\d{1,2})?$/.test(normalized)) throw new Error('Ingresá un importe válido con hasta dos decimales.');
  const [whole, fraction = ''] = normalized.split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  if (!Number.isSafeInteger(cents) || (allowZero ? cents < 0 : cents <= 0) || cents > 9000000000000) throw new Error('El importe debe ser mayor a cero.');
  return cents;
}

export function money(cents, currency = 'ARS') {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(Number(cents || 0) / 100);
}

export function accountBalance(account, movements) {
  return movements.filter((row) => !row.voided_at).reduce((balance, row) => {
    if (row.account_id === account.id) balance += row.kind === 'income' ? row.amount_cents : -row.amount_cents;
    if (row.kind === 'transfer' && row.destination_account_id === account.id) balance += row.amount_cents;
    return balance;
  }, Number(account.opening_balance_cents));
}

export function obligationBalance(obligation, movements) {
  const paid = movements.filter((row) => row.obligation_id === obligation.id && !row.voided_at)
    .reduce((sum, row) => sum + Number(row.amount_cents), 0);
  return Math.max(0, Number(obligation.amount_cents) - paid);
}

export function obligationPaymentStatus(obligation, movements) {
  if (obligation.status === 'cancelled') return { label: 'Cancelado', remaining: 0, partial: false, settled: false, cancelled: true };
  const remaining = obligationBalance(obligation, movements);
  const settled = remaining === 0;
  return {
    label: settled ? (obligation.direction === 'receivable' ? 'Cobrado' : 'Pagado')
      : (obligation.direction === 'receivable' ? 'Por cobrar' : 'Por pagar'),
    remaining,
    partial: !settled && remaining < Number(obligation.amount_cents),
    settled,
    cancelled: false,
  };
}

function csvValue(value) {
  let text = String(value ?? '');
  if (/^\s*[=+@\-\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function financeCsv(headers, rows) {
  return '\uFEFF' + [headers, ...rows].map((row) => row.map(csvValue).join(';')).join('\r\n') + '\r\n';
}
