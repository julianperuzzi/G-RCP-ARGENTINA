import test from 'node:test';
import assert from 'node:assert/strict';
import { formatShopPrice, shopCanOrder, shopDiscountPercent, shopMoneyToCents, shopPrice, shopStockLimit, validateShopDraft } from '../src/lib/shopCatalog.js';

const published = { status: 'published', price_cents: 2000000, sale_price_cents: 1800000, stock_mode: 'limited', stock_quantity: 2 };

test('precio y stock se expresan en centavos y limitan el carrito', () => {
  assert.equal(shopPrice(published), 1800000);
  assert.equal(shopDiscountPercent(published), 10);
  assert.equal(shopStockLimit(published), 2);
  assert.equal(shopCanOrder({ ...published, stock_quantity: 0 }), false);
  assert.equal(shopCanOrder({ ...published, status: 'draft' }), false);
  assert.equal(shopStockLimit({ ...published, stock_mode: 'available' }), Infinity);
  assert.match(formatShopPrice(1800000), /18\.000/);
});

test('el editor valida precio, oferta y cantidad antes de guardar', () => {
  const form = { name: 'Kit RCP', category: 'Capacitación', price: '20000,50', sale: '18000', stock_mode: 'limited', stock_quantity: '2', status: 'draft' };
  assert.equal(shopMoneyToCents('20000,50'), 2000050);
  assert.equal(validateShopDraft(form).price_cents, 2000050);
  assert.equal(validateShopDraft(form).sale_price_cents, 1800000);
  assert.throws(() => validateShopDraft({ ...form, sale: '25000' }), /oferta/);
  assert.throws(() => validateShopDraft({ ...form, stock_quantity: '0' }), /cantidad/);
  assert.throws(() => validateShopDraft({ ...form, price: 'abc' }), /precio/);
});
