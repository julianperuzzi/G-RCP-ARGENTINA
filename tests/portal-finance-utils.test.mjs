import { test } from 'node:test';
import assert from 'node:assert/strict';
import { accountBalance, centsFromInput, financeCsv, obligationBalance, obligationPaymentStatus } from '../src/lib/portalFinance.js';
import { prepareFinanceDocument } from '../src/lib/portalFinanceFile.js';

test('saldos separan ingresos, egresos, transferencias y anulaciones', () => {
  const movements = [
    { kind: 'income', account_id: 'caja', amount_cents: 7000, obligation_id: 'factura', voided_at: null },
    { kind: 'expense', account_id: 'caja', amount_cents: 2000, voided_at: null },
    { kind: 'transfer', account_id: 'caja', destination_account_id: 'banco', amount_cents: 3000, voided_at: null },
    { kind: 'income', account_id: 'caja', amount_cents: 9000, obligation_id: 'factura', voided_at: '2026-10-07T00:00:00Z' },
  ];
  assert.equal(accountBalance({ id: 'caja', opening_balance_cents: 1000 }, movements), 3000);
  assert.equal(accountBalance({ id: 'banco', opening_balance_cents: 0 }, movements), 3000);
  assert.equal(obligationBalance({ id: 'factura', amount_cents: 12000 }, movements), 5000);
});

test('estado por cobrar o pagar refleja cobros, pagos parciales y anulaciones', () => {
  const receivable = { id: 'cobro', direction: 'receivable', status: 'open', amount_cents: 10000 };
  const payable = { id: 'pago', direction: 'payable', status: 'open', amount_cents: 10000 };
  const partial = { obligation_id: 'cobro', amount_cents: 4000, voided_at: null };
  const finalPayment = { obligation_id: 'cobro', amount_cents: 6000, voided_at: null };
  assert.deepEqual(obligationPaymentStatus(receivable, []), { label: 'Por cobrar', remaining: 10000, partial: false, settled: false, cancelled: false });
  assert.deepEqual(obligationPaymentStatus(receivable, [partial]), { label: 'Por cobrar', remaining: 6000, partial: true, settled: false, cancelled: false });
  assert.equal(obligationPaymentStatus(receivable, [partial, finalPayment]).label, 'Cobrado');
  assert.equal(obligationPaymentStatus(receivable, [{ ...partial, voided_at: '2026-10-07' }, finalPayment]).label, 'Por cobrar');
  assert.equal(obligationPaymentStatus(payable, [{ ...partial, obligation_id: 'pago', amount_cents: 10000 }]).label, 'Pagado');
  assert.equal(obligationPaymentStatus({ ...payable, status: 'cancelled' }, []).label, 'Cancelado');
});

test('importes y CSV conservan centavos y neutralizan fórmulas', () => {
  assert.equal(centsFromInput('1234,56'), 123456);
  assert.equal(centsFromInput('1.234,56'), 123456);
  assert.equal(centsFromInput('0.01'), 1);
  assert.equal(centsFromInput('0,00', true), 0);
  assert.throws(() => centsFromInput('1.234,567'));
  assert.throws(() => centsFromInput('0'));
  assert.match(financeCsv(['Concepto'], [['=SUM(1,2)']]), /"'=SUM\(1,2\)"/);
});

test('comprobantes: comprime imágenes grandes y conserva los PDF', async () => {
  const originalBitmap = globalThis.createImageBitmap;
  const originalDocument = globalThis.document;
  let dimensions;
  globalThis.createImageBitmap = async () => ({ width: 3600, height: 1800, close() {} });
  globalThis.document = { createElement: () => ({
    set width(value) { dimensions = { ...dimensions, width: value }; },
    set height(value) { dimensions = { ...dimensions, height: value }; },
    getContext: () => ({ fillRect() {}, drawImage() {} }),
    toBlob: (done) => done(new Blob([new Uint8Array(400_000)], { type: 'image/jpeg' })),
  }) };
  try {
    const image = new File([new Uint8Array(2_000_000)], 'comprobante.png', { type: 'image/png' });
    const compressed = await prepareFinanceDocument(image);
    assert.equal(compressed.name, 'comprobante.jpg');
    assert.equal(compressed.size, 400_000);
    assert.deepEqual(dimensions, { width: 2400, height: 1200 });
    const pdf = new File(['PDF'], 'factura.pdf', { type: 'application/pdf' });
    assert.equal(await prepareFinanceDocument(pdf), pdf);
    await assert.rejects(prepareFinanceDocument(new File([new Uint8Array(11 * 1024 * 1024)], 'grande.pdf', { type: 'application/pdf' })), /10 MB/);
  } finally {
    globalThis.createImageBitmap = originalBitmap;
    globalThis.document = originalDocument;
  }
});
