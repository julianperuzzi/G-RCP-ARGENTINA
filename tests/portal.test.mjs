import { test } from "node:test";
import assert from "node:assert/strict";
import {
  dueState,
  assetAlerts,
  nextOccurrence,
  validateDocument,
  MAX_FILE_SIZE,
} from "../src/lib/portal.js";
import { portalCalendarIcs, portalCsv } from "../src/lib/portalExports.js";
test("vencimientos por fecha civil y alertas independientes", () => {
  assert.equal(dueState("2026-10-06", "2026-10-07"), "overdue");
  assert.equal(dueState("2026-10-07", "2026-10-07"), "soon");
  assert.equal(dueState("2026-11-06", "2026-10-07"), "soon");
  assert.equal(dueState("2026-11-07", "2026-10-07"), "ok");
  assert.equal(
    assetAlerts(
      {
        next_review_on: "2026-10-01",
        pads_expires_on: "2026-10-30",
        battery_expires_on: "2027-01-01",
      },
      "2026-10-07",
    ).length,
    2,
  );
});
test("recurrencia mensual respeta fin de mes y duración", () => {
  const next = nextOccurrence({
    id: "x",
    starts_at: "2026-01-31T13:00:00Z",
    ends_at: "2026-01-31T15:00:00Z",
    repeat_months: 1,
    status: "completed",
  });
  assert.equal(next.starts_at, "2026-02-28T13:00:00.000Z");
  assert.equal(next.ends_at, "2026-02-28T15:00:00.000Z");
  assert.equal(next.status, "planned");
  assert.equal(nextOccurrence({ repeat_months: 0 }), null);
});
test("documentos limitados a PDF/JPG/PNG hasta 10 MB", () => {
  assert.throws(() => validateDocument({ type: "text/html", size: 100 }));
  assert.throws(() =>
    validateDocument({ type: "application/pdf", size: MAX_FILE_SIZE + 1 }),
  );
  assert.throws(() => validateDocument({ type: "application/pdf", size: 0 }));
  assert.doesNotThrow(() =>
    validateDocument({ type: "application/pdf", size: MAX_FILE_SIZE }),
  );
});
test("CSV neutraliza fórmulas y escapa comillas de contenido ingresado", () => {
  const csv = portalCsv(
    "requests",
    [{ title: '=HYPERLINK("url")', body: "Una; consulta", status: "open" }],
    {},
  );
  assert.ok(csv.includes('"\'=HYPERLINK(""url"")"'));
  assert.ok(csv.includes('"Una; consulta"'));
});
test('CSV general identifica la institución de cada registro', () => {
  const csv = portalCsv('sites', [
    { name: 'Sede Central', institution_id: 'one' },
    { name: 'Otra sede', institution_id: 'two' },
  ], { institutions: [{ id: 'one', name: 'DISEI' }, { id: 'two', name: 'Otra institución' }] }, { includeInstitution: true });
  const [header, first, second] = csv.replace(/^\ufeff/, '').split('\r\n');
  assert.ok(header.startsWith('"Institución";"Sede"'));
  assert.ok(first.startsWith('"DISEI";"Sede Central"'));
  assert.ok(second.startsWith('"Otra institución";"Otra sede"'));
});
test("calendario ICS exporta UTC, escapa saltos y excluye canceladas", () => {
  const ics = portalCalendarIcs(
    [
      {
        id: "one",
        title: "RCP, nivel; inicial\nBEGIN:VEVENT",
        starts_at: "2026-10-07T10:00:00-03:00",
        status: "planned",
      },
      { id: "two", starts_at: "2026-10-07T10:00:00Z", status: "cancelled" },
    ],
    new Date("2026-10-01T00:00:00Z"),
  );
  assert.ok(ics.includes("DTSTART:20261007T130000Z"));
  assert.ok(ics.includes("SUMMARY:RCP\\, nivel\\; inicial\\nBEGIN:VEVENT"));
  assert.equal(ics.match(/\r\nBEGIN:VEVENT\r\n/g).length, 1);
});
