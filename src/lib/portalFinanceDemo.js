import { localDate } from './portal';

let session;

export function getFinanceDemo() {
  if (!session) {
    const today = localDate();
    session = {
      accounts: [{ id: 'demo-cash', name: 'Caja general · Ejemplo', kind: 'cash', currency: 'ARS', opening_balance_cents: 0, archived_at: null, created_at: new Date().toISOString() }],
      obligations: [{ id: 'demo-invoice', direction: 'receivable', institution_id: 'demo-school', title: 'Capacitación RCP · Ejemplo', category: 'Capacitaciones', amount_cents: 95000, currency: 'ARS', issued_on: today, due_on: today, status: 'open', reference: 'EJEMPLO-001', notes: '', created_at: new Date().toISOString() }],
      movements: [], documents: [], audit: [],
    };
  }
  return session;
}

export function setFinanceDemo(value) { session = value; }
export function resetFinanceDemo() { session = undefined; }
