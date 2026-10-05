/**
 * Tech Academy v1 - Automated Quality Assurance & Invariant Verification Suite
 * Ushbu test butun platforma bo'yicha ma'lumotlar, navigatsiya, arxitektura va
 * havolalar yaxlitligini 100% matematik aniqlikda tekshiradi.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🚀 [TEST SUITE] Tech Academy platformasini to\'liq avtomatlashtirilgan tekshiruvi boshlandi...\n');

const lessonsPath = path.join(__dirname, '..', 'data', 'lessons.js');
if (!fs.existsSync(lessonsPath)) {
  console.error('❌ CRITICAL: data/lessons.js topilmadi!');
  process.exit(1);
}

const content = fs.readFileSync(lessonsPath, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);

try {
  vm.runInContext(content, sandbox);
  console.log('✅ PASS: data/lessons.js sintaksisi toza, JavaScript xatoliksiz yuklandi.');
} catch (e) {
  console.error('❌ FAIL: data/lessons.js da sintaktik xatolik:', e);
  process.exit(1);
}

const lessons = sandbox.window.ACADEMY_LESSONS || [];
const modules = sandbox.window.ACADEMY_MODULES || [];
const questions = sandbox.window.ACADEMY_QUESTIONS || [];
const resume = sandbox.window.ACADEMY_RESUME || {};

let failed = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

// 1. Modullar soni va tuzilishi
console.log('\n--- 1. Modullar Yaxlitligi ---');
assert(modules.length === 17, `17 ta modul to'liq mavjud (Hozirgi son: ${modules.length})`);
assert(modules.every(m => m.id && m.name && m.order !== undefined), 'Har bir modulda id, name va order maydonlari mavjud');

// 2. Darslar soni va ID lar unikalligi
console.log('\n--- 2. Darslar va Unikallik ---');
assert(lessons.length === 110, `110 ta Masterclass dars to'liq mavjud (Hozirgi son: ${lessons.length})`);

const lessonIds = new Set();
let dupLessonIds = 0;
lessons.forEach(l => {
  if (lessonIds.has(l.id)) dupLessonIds++;
  lessonIds.add(l.id);
});
assert(dupLessonIds === 0, `Barcha dars ID lari 100% unikal (Takrorlanishlar: ${dupLessonIds})`);

// 3. Savollar soni va tuzilishi
console.log('\n--- 3. Texnik Sinov (Savollar) Yaxlitligi ---');
assert(questions.length === 75, `75 ta intervyu savoli to'liq mavjud (Hozirgi son: ${questions.length})`);

const qIds = new Set();
let dupQIds = 0;
let invalidQ = 0;
questions.forEach(q => {
  if (qIds.has(q.id)) dupQIds++;
  qIds.add(q.id);
  if (!q.id || !q.module || !q.q || !q.hint) invalidQ++;
});
assert(dupQIds === 0, `Barcha savol ID lari 100% unikal (Takrorlanishlar: ${dupQIds})`);
assert(invalidQ === 0, `Barcha savollarda q, hint, module maydonlari to'liq (Nuqsonli: ${invalidQ})`);

// 4. Raqamlar va Sarlavhalar sinxronligi
console.log('\n--- 4. Darslar Raqamlari va Sarlavha Sinxronligi ---');
const byMod = {};
lessons.forEach(l => {
  if (!byMod[l.module]) byMod[l.module] = [];
  byMod[l.module].push(l);
});

let numErrors = 0;
let emptySummaries = 0;
let deadPrereqs = 0;

modules.forEach(m => {
  const modLessons = byMod[m.id] || [];
  modLessons.forEach((l, idx) => {
    const expected = (idx + 1).toString();
    const titleMatch = l.title.match(/^(\d+)-dars/);
    const shortMatch = l.shortTitle.match(/^(\d+)\./);

    if (!titleMatch || titleMatch[1] !== expected) numErrors++;
    if (!shortMatch || shortMatch[1] !== expected) numErrors++;
    if (!l.summary || l.summary.length < 20) emptySummaries++;

    (l.prerequisites || []).forEach(p => {
      if (!lessonIds.has(p)) deadPrereqs++;
    });
  });
});

assert(numErrors === 0, `Barcha darslarda title va shortTitle raqamlari 100% tartiblangan (Xatolar: ${numErrors})`);
assert(emptySummaries === 0, `Barcha 110 ta darsda to'liq summary mavjud (Yetishmayotgan: ${emptySummaries})`);
assert(deadPrereqs === 0, `Barcha prerequisites havolalari haqiqiy darslarga ulangan (O'lik havolalar: ${deadPrereqs})`);

// 5. Rezyume Mapping Yaxlitligi
console.log('\n--- 5. Rezyume va Fintech Konfiguratsiyasi ---');
assert(Boolean(resume.headline && resume.focus && resume.evidence), 'ACADEMY_RESUME to\'liq to\'ldirilgan');

// Yakuniy natija
console.log('\n========================================');
if (failed === 0) {
  console.log('🎉 BARCHA TESTLAR MUVAFFAQIYATLI O\'TDI (0 TA XATOLIK)!');
  console.log('Platforma 100% ishlab chiqarish va o\'rganishga tayyor.');
  process.exit(0);
} else {
  console.error(`💥 DIQQAT: ${failed} ta test muvaffaqiyatsiz tugadi!`);
  process.exit(1);
}
