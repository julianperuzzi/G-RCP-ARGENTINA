import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogProducts, hasStock, sellingPrice, stockLimit } from '../src/lib/shopCatalog.js';

test('stock textual y numérico del catálogo', () => {
  assert.equal(stockLimit('Sin Stock'), 0);
  assert.equal(stockLimit('Disponible'), Infinity);
  assert.equal(stockLimit('En stock'), Infinity);
  assert.equal(stockLimit('3'), 3);
  assert.equal(stockLimit('0'), 0);
  assert.equal(stockLimit('desconocido'), 0);
  assert.equal(hasStock({ stock: 'Sin Stock' }), false);
  assert.equal(hasStock({ stock: 'Disponible' }), true);
});

test('filas vacías no rompen búsqueda ni precios del catálogo', () => {
  const products = catalogProducts([
    { id: ' A ', nombre: 'DEA', precio: '200000', descuento: '180000', stock: 'Disponible' },
    { id: 'B', nombre: 'Kit', precio: '20000', descuento: '', stock: 'Sin Stock' },
    { id: '', nombre: '', precio: '' },
    { id: 'C', nombre: 'Sin precio', precio: '' },
  ]);
  assert.equal(products.length, 2);
  assert.equal(products[0].id, 'A');
  assert.equal(products[0].descripcion, '');
  assert.equal(sellingPrice(products[0]), 180000);
  assert.equal(sellingPrice(products[1]), 20000);
  assert.equal(hasStock(products[1]), false);
});
