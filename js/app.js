(()=>{
const L = window.ACADEMY_LESSONS || [];
const M = window.ACADEMY_MODULES || [];
const R = window.ACADEMY_RESUME || {};
const Q = window.ACADEMY_QUESTIONS || [];

const $ = s => document.querySelector(s);
const view = $('#view'), modal = $('#modal'), body = $('#modalBody');
const KEY = 'tech-academy-v2';

const state = JSON.parse(localStorage.getItem(KEY) || '{}');
state.progress = state.progress || {};
state.notes = state.notes || {};

const save = () => localStorage.setItem(KEY, JSON.stringify(state));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId = id => L.find(x => x.id === id);

// Strict status score: unread: 0, weak: 0.2, understood: 0.7, ready: 1.0 (Highest)
// Opening a lesson does NOT count as read!
const score = id => ({ unread: 0, weak: 0.2, understood: 0.7, ready: 1.0 }[state.progress[id]?.status || 'unread']);

const pct = mod => {
  const arr = L.filter(x => x.module === mod);
  if (!arr.length) return 0;
  return Math.round(arr.reduce((s, x) => s + score(x.id), 0) / arr.length * 100);
};

const setProgress = (id, status) => {
  const p = state.progress[id] || {};
  p.status = status;
  p.updated = Date.now();
  if (status === 'weak') {
    p.interval = 0;
    p.due = Date.now(); // review immediately
  } else if (status === 'understood') {
    p.interval = 3;
    p.due = Date.now() + 3 * 86400000;
  } else if (status === 'ready') {
    p.interval = 7;
    p.due = Date.now() + 7 * 86400000;
  }
  state.progress[id] = p;
  save();
  renderModules();
};

function renderModules() {
  const host = $('#modules');
  if (!host) return;
  host.innerHTML = M.map(m => {
    const isCurrent = location.hash.includes('/module/' + m.id);
    return `<button class="mod-btn ${isCurrent ? 'on' : ''}" data-route="/module/${m.id}">
      <span class="mod-row">
        <span>${esc(m.name)}</span>
        <span class="mod-pct">${pct(m.id)}%</span>
      </span>
    </button>`;
  }).join('');

  host.querySelectorAll('[data-route]').forEach(b => {
    b.addEventListener('click', () => go(b.dataset.route));
  });

  document.querySelectorAll('.shortcut-btn').forEach(b => {
    const r = b.dataset.route;
    b.classList.toggle('on', (location.hash === '#' + r) || (!location.hash && r === '/'));
  });
}

const go = r => { location.hash = '#' + r; };

function card(x) {
  const st = state.progress[x.id]?.status || 'unread';
  const stLabel = {
    unread: 'O‘qilmagan',
    weak: 'Qaytish kerak (Zaif)',
    understood: 'Tushundim',
    ready: '★ Tushuntira olaman'
  }[st];

  const pres = (x.prerequisites || []).map(p => byId(p)).filter(Boolean);
  const hasUnmetPre = pres.some(p => score(p.id) < 0.7);

  return `<article class="lesson-card" data-id="${x.id}">
    <div class="meta">
      <span class="lesson-id" style="font-size:11px;padding:2px 6px;margin:0">${x.id}</span>
      <span class="pill">${esc(x.moduleName)}</span>
      <span>⏱️ ${x.minutes} min</span>
      <span class="status-pill ${st}">${stLabel}</span>
      ${hasUnmetPre ? '<span class="status-pill weak" title="Oldingi mavzular to‘liq o‘zlashtirilmagan">⚠️ Prereq</span>' : ''}
    </div>
    <h3>${esc(x.title)}</h3>
    <p class="muted" style="font-size:13.5px;margin:0">${esc(x.summary || '')}</p>
  </article>`;
}

function bindCards() {
  document.querySelectorAll('.lesson-card[data-id]').forEach(e => {
    e.addEventListener('click', () => go('/lesson/' + e.dataset.id));
  });
}

function dashboard() {
  const total = L.length;
  const ready = L.filter(x => state.progress[x.id]?.status === 'ready').length;
  const understood = L.filter(x => state.progress[x.id]?.status === 'understood').length;
  const weak = L.filter(x => state.progress[x.id]?.status === 'weak').length;
  const unread = total - ready - understood - weak;
  const overallPct = Math.round(L.reduce((s, x) => s + score(x.id), 0) / total * 100);

  // Daily study plan (5-6 hours: 6-8 lessons based on priority and prerequisites)
  const plan = L.filter(x => score(x.id) < 0.7).sort((a,b) => (a.priority - b.priority) || (a.moduleOrder - b.moduleOrder)).slice(0, 6);
  const weakList = L.filter(x => state.progress[x.id]?.status === 'weak');
  const weakMods = M.map(m => ({ m, p: pct(m.id) })).sort((a,b) => a.p - b.p);

  view.innerHTML = `
    <div class="hero">
      <div class="card">
        <h1>Tech Academy — Shaxsiy Ta'lim Tizimi</h1>
        <p class="muted">Maqsad: Amaliy dasturchi tajribangizni fundamental nazariya, apparat/xotira darajasidagi mexanizmlar va Senior darajadagi tushuntirishlarga aylantirish.</p>
        <div class="meta" style="margin-top:12px;gap:8px">
          <span class="pill" style="background:var(--accent2);color:var(--accent);font-weight:600">Kunlik rejim: 5–6 soat</span>
          <span class="pill">21 bosqichli chuqur tahlil</span>
          <span class="pill">Under the hood & Bytecode</span>
        </div>
      </div>
      <div class="card stats">
        <div class="stat"><b>${overallPct}%</b><span>Umumiy o‘zlashtirish</span></div>
        <div class="stat stat-ready"><b>${ready}</b><span>Tushuntira olaman</span></div>
        <div class="stat stat-understood"><b>${understood}</b><span>Tushundim</span></div>
        <div class="stat stat-weak"><b>${weak}</b><span>Zaif / Qaytish kerak</span></div>
      </div>
    </div>

    ${weakList.length ? `
    <div class="section-title">
      <h2>⚠️ Zaif mavzular (Qaytadan ko‘rib chiqish lozim)</h2>
      <span class="status-pill weak">${weakList.length} ta dars</span>
    </div>
    <div class="today">${weakList.map(card).join('')}</div>
    ` : ''}

    <div class="section-title">
      <h2>🎯 Bugungi fokus (Tavsiya etilgan darslar)</h2>
      <span class="muted">Ketma-ketlik va prerequisite asosida saralangan</span>
    </div>
    <div class="today">${plan.map(card).join('')}</div>

    <div class="section-title">
      <h2>📊 Modullar bo‘yicha progress</h2>
    </div>
    <div class="card" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:14px">
      ${weakMods.map(x => `
        <div>
          <div class="mod-row" style="margin-bottom:6px">
            <span style="font-weight:600;font-size:14px">${esc(x.m.name)}</span>
            <span style="font-weight:700;font-size:13px">${x.p}%</span>
          </div>
          <div class="progress"><span style="width:${x.p}%"></span></div>
        </div>
      `).join('')}
    </div>
  `;
  bindCards();
}

function lessonView(id) {
  const x = byId(id);
  if (!x) {
    view.innerHTML = '<div class="card"><p class="muted">Dars topilmadi.</p></div>';
    return;
  }

  $('#crumb').textContent = x.id + ' · ' + x.title;
  const currentStatus = state.progress[id]?.status || 'unread';

  const pres = (x.prerequisites || []).map(p => byId(p)).filter(Boolean);
  const unmetPres = pres.filter(p => score(p.id) < 0.7);

  const idx = L.findIndex(l => l.id === id);
  const prevLesson = idx > 0 ? L[idx - 1] : null;
  const nextLesson = idx < L.length - 1 ? L[idx + 1] : null;

  view.innerHTML = `
    <article class="lesson">
      <div class="lesson-head">
        <div class="lesson-head-info">
          <span class="lesson-id">${x.id}</span>
          <h1>${esc(x.title)}</h1>
          <div class="lesson-meta">
            <span class="pill">📁 ${esc(x.moduleName)}</span>
            <span class="pill">⏱️ ${x.minutes} daqiqa</span>
            <span class="pill">🏷️ Status: <b>${{
              unread: 'O‘qilmagan',
              weak: 'Qaytish kerak',
              understood: 'Tushundim',
              ready: '★ Tushuntira olaman'
            }[currentStatus]}</b></span>
          </div>
        </div>
        <div class="lesson-head-nav">
          ${prevLesson ? `<button class="btn" type="button" id="topPrevBtn" title="Oldingi dars (←)">← Oldingi</button>` : ''}
          ${nextLesson ? `<button class="btn btn-primary" type="button" id="topNextBtn" title="Keyingi dars (→)">Keyingi dars →</button>` : ''}
        </div>
      </div>

      ${pres.length ? `
        <div class="card" style="padding:14px;background:var(--panel2)">
          <div style="font-size:13px;font-weight:600;margin-bottom:6px">Ushbu darsdan oldin o‘zlashtirilishi shart bo‘lgan mavzular:</div>
          <div class="prereq" style="display:flex;flex-wrap:wrap;gap:8px">
            ${pres.map(p => {
              const pSt = state.progress[p.id]?.status || 'unread';
              return `<button type="button" class="btn" data-pre="${p.id}" style="font-size:12px;padding:4px 10px">
                <span class="status-pill ${pSt}" style="padding:1px 6px;margin-right:4px">${p.id}</span>
                ${esc(p.title)}
              </button>`;
            }).join('')}
          </div>
          ${unmetPres.length ? `<div style="color:var(--warn);font-size:12px;margin-top:6px">⚠️ Diqqat: yuqoridagi ayrim prerequisite'lar hali to‘liq o‘zlashtirilmagan. Agar mavzu qiyinlik qilsa, avval ularni ko‘rib chiqing.</div>` : ''}
        </div>
      ` : ''}

      <div class="lesson-actions">
        <button class="btn-status-weak" type="button" id="btnWeak">
          ? O‘qidim, lekin tushunmadim
        </button>
        <button class="btn-status-understood" type="button" id="btnUnderstood">
          ✓ Tushundim
        </button>
        <button class="btn-status-ready" type="button" id="btnReady">
          ★ Tushuntira olaman (100%)
        </button>
        <button class="btn-deep" type="button" id="deepBtn">
          🔬 Chuqurroq (Under the Hood)
        </button>
      </div>

      <div class="lesson-body">
        ${x.body}
      </div>

      <div class="card lesson-footer-nav" style="display:flex;justify-content:space-between;align-items:center;margin-top:28px;padding:18px;background:var(--panel2);flex-wrap:wrap;gap:12px">
        ${prevLesson ? `
          <button type="button" class="btn" id="prevLessonBtn" style="display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">←</span>
            <div style="text-align:left">
              <div style="font-size:11px;color:var(--muted)">Oldingi dars</div>
              <b>${prevLesson.id}: ${esc(prevLesson.shortTitle || prevLesson.title)}</b>
            </div>
          </button>
        ` : '<div></div>'}

        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-status-weak" type="button" id="footerBtnWeak">
            ? Tushunmadim
          </button>
          <button class="btn-status-understood" type="button" id="footerBtnUnderstood">
            ✓ Tushundim (Keyingisiga o‘tish →)
          </button>
          <button class="btn-status-ready" type="button" id="footerBtnReady">
            ★ Tushuntira olaman
          </button>
        </div>

        ${nextLesson ? `
          <button type="button" class="btn btn-primary" id="nextLessonBtn" style="display:flex;align-items:center;gap:8px;padding:10px 18px">
            <div style="text-align:right">
              <div style="font-size:11px;opacity:0.85">Keyingi dars</div>
              <b>${nextLesson.id}: ${esc(nextLesson.shortTitle || nextLesson.title)}</b>
            </div>
            <span style="font-size:18px">→</span>
          </button>
        ` : '<div></div>'}
      </div>
    </article>
  `;

  // Bind prerequisite buttons
  document.querySelectorAll('[data-pre]').forEach(b => {
    b.addEventListener('click', () => go('/lesson/' + b.dataset.pre));
  });

  // Bind status buttons (top & footer)
  const onWeak = () => {
    setProgress(id, 'weak');
    askModal(x, '', 'Darsni to‘liq tushunmadim');
  };
  const onUnderstood = () => {
    setProgress(id, 'understood');
    if (nextLesson) {
      go('/lesson/' + nextLesson.id);
    } else {
      lessonView(id);
    }
  };
  const onReady = () => {
    setProgress(id, 'ready');
    if (nextLesson) {
      go('/lesson/' + nextLesson.id);
    } else {
      lessonView(id);
    }
  };

  $('#btnWeak').addEventListener('click', onWeak);
  const footerWeak = $('#footerBtnWeak');
  if (footerWeak) footerWeak.addEventListener('click', onWeak);

  $('#btnUnderstood').addEventListener('click', onUnderstood);
  const footerUnderstood = $('#footerBtnUnderstood');
  if (footerUnderstood) footerUnderstood.addEventListener('click', onUnderstood);

  $('#btnReady').addEventListener('click', onReady);
  const footerReady = $('#footerBtnReady');
  if (footerReady) footerReady.addEventListener('click', onReady);

  const prevBtn = $('#prevLessonBtn');
  if (prevBtn && prevLesson) prevBtn.addEventListener('click', () => go('/lesson/' + prevLesson.id));

  const nextBtn = $('#nextLessonBtn');
  if (nextBtn && nextLesson) nextBtn.addEventListener('click', () => go('/lesson/' + nextLesson.id));

  const topPrev = $('#topPrevBtn');
  if (topPrev && prevLesson) topPrev.addEventListener('click', () => go('/lesson/' + prevLesson.id));

  const topNext = $('#topNextBtn');
  if (topNext && nextLesson) topNext.addEventListener('click', () => go('/lesson/' + nextLesson.id));

  // "Chuqurroq" toggle inline function (MUST NOT create prompt, opens deep content directly!)
  const deepBtn = $('#deepBtn');
  const deepSec = $('#deepSection');
  if (deepBtn && deepSec) {
    deepBtn.addEventListener('click', () => {
      const isHidden = deepSec.hasAttribute('hidden');
      if (isHidden) {
        deepSec.removeAttribute('hidden');
        deepBtn.textContent = '▲ Chuqur qismni yopish';
        deepBtn.classList.add('active');
        deepSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        deepSec.setAttribute('hidden', '');
        deepBtn.textContent = '🔬 Chuqurroq (Under the Hood)';
        deepBtn.classList.remove('active');
      }
    });
  }

  // Bind '?' ask buttons on individual headers
  document.querySelectorAll('.lesson-body [data-block-id]').forEach(h => {
    if (!h.querySelector('.ask-block')) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ask-block';
      b.textContent = '?';
      b.title = 'Shu blok bo‘yicha savol berish yoki tushunmagan joyni yozish';
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        askModal(x, h.dataset.blockId, h.textContent.replace('?', '').trim());
      });
      h.appendChild(b);
    }
  });
}

function askModal(x, blockId = '', heading = '') {
  const currentNote = state.notes[blockId || x.id] || '';
  body.innerHTML = `
    <div class="ask-box">
      <h2 style="margin-top:0">${esc(blockId || x.id)} · Savol va Tushunmagan Joy</h2>
      ${heading ? `<p><b>Mavzu bloki:</b> ${esc(heading)}</p>` : ''}
      <p class="muted" style="font-size:14px">Ushbu qismda nima tushunarsiz bo‘lganini yozing. Tizim bu mavzuni avtomatik "Zaif (Qaytish kerak)" deb belgilaydi va keyingi chuqurlashtirishni aynan shu blokka qaratadi.</p>
      
      <div class="quick-reasons" style="display:flex;gap:6px;flex-wrap:wrap;margin:10px 0">
        <button type="button" class="btn" style="font-size:12px" data-r="Terminlar juda tez o'tilgan, mental model yetishmayapti">Terminlar</button>
        <button type="button" class="btn" style="font-size:12px" data-r="Xotira va Thread darajasida under the hood mexanizmni tushunmadim">Under the hood</button>
        <button type="button" class="btn" style="font-size:12px" data-r="Real Android va Banking kodi bilan bog'lay olmadim">Real code</button>
        <button type="button" class="btn" style="font-size:12px" data-r="Prerequisite mavzu yaxshi tushunilmaganligi sababli chalkashdim">Prerequisite</button>
      </div>

      <textarea id="noteInput" style="width:100%;min-height:90px;border:1px solid var(--line);border-radius:8px;padding:10px;font-size:14px" placeholder="Masalan: Continuation qayerdan paydo bo'lishini va suspension pointdan keyin thread qayerga ketishini tushunmayapman...">${esc(currentNote)}</textarea>

      <h3 style="font-size:15px;margin:14px 0 6px">AI / Mentor uchun tayyor so‘rov (Prompt):</h3>
      <textarea id="promptArea" class="prompt" readonly></textarea>

      <div class="lesson-actions" style="margin-top:14px">
        <button type="button" class="btn-status-ready" id="saveNoteBtn">💾 Saqlash va Zaif deb belgilash</button>
        <button type="button" class="btn" id="copyPromptBtn">📋 Promptni nusxalash</button>
      </div>
    </div>
  `;

  const noteInput = $('#noteInput');
  const promptArea = $('#promptArea');

  const buildPrompt = () => {
    promptArea.value = `Mavzu: ${x.id}${blockId ? ' / ' + blockId : ''} — “${x.title}”${heading ? ' / “' + heading + '”' : ''}.
Mening savolim / tushunmagan joyim:
${noteInput.value.trim() || 'Ushbu blokning ichki ishlash mexanizmini to‘liq tushunmadim.'}

Iltimos:
1. Avval ushbu mavzuning prerequisite tushunchalarini tekshir (agar muammo bazaviy tushunchada bo'lsa, avval o'shani soddalashtirib ber).
2. Eng sodda mental model va analogiya ber.
3. Memory / Thread / Bytecode darajasida ichkarida nima sodir bo'lishini step-by-step ko'rsat.
4. Real Android yoki Banking fintech production kod misolida ko'rsat.
5. Men boshqalarga tushuntirib bera olishim uchun aniq xulosaviy javob tayyorlab ber.`;
  };

  buildPrompt();
  noteInput.addEventListener('input', buildPrompt);
  document.querySelectorAll('[data-r]').forEach(b => {
    b.addEventListener('click', () => {
      noteInput.value = (noteInput.value ? noteInput.value + '; ' : '') + b.dataset.r;
      buildPrompt();
    });
  });

  $('#saveNoteBtn').addEventListener('click', () => {
    state.notes[blockId || x.id] = noteInput.value.trim();
    setProgress(x.id, 'weak');
    save();
    closeModal();
    lessonView(x.id);
  });

  $('#copyPromptBtn').addEventListener('click', async () => {
    buildPrompt();
    try {
      await navigator.clipboard.writeText(promptArea.value);
      $('#copyPromptBtn').textContent = '✓ Nusxalandi!';
      setTimeout(() => { $('#copyPromptBtn').textContent = '📋 Promptni nusxalash'; }, 2000);
    } catch {
      promptArea.focus();
      promptArea.select();
    }
  });

  openModal();
}

function graphView() {
  $('#crumb').textContent = 'Knowledge Graph & Mavzular Zanjiri';
  const chains = [
    { name: '1. Apparat, Xotira va Tizim Asoslari', ids: ['FND-001','FND-002','FND-003','FND-004','FND-005','FND-006','FND-007'] },
    { name: '2. Obyektga Yo‘naltirilgan Dasturlash va SOLID', ids: ['OOP-001','OOP-002','OOP-003','OOP-004','OOP-005'] },
    { name: '3. Kotlin Til Mexanizmlari va Bytecode', ids: ['KT-001','KT-002','KT-003','KT-004','KT-005','KT-006','KT-007','KT-008'] },
    { name: '4. Concurrency va Coroutines Under the Hood', ids: ['COR-001','COR-002','COR-003','COR-004','COR-005','COR-006','COR-007','COR-008','COR-009'] },
    { name: '5. Reaktiv Oqimlar va Kotlin Flow', ids: ['FL-001','FL-002','FL-003','FL-004','FL-005','FL-006','FL-007','FL-008'] },
    { name: '6. Android SDK, Lifecycles va Internals', ids: ['AN-001','AN-002','AN-003','AN-004','AN-005','AN-006','AN-007','AN-008','AN-009','AN-010','AN-011'] },
    { name: '7. Jetpack Compose va Deklarativ UI Holati', ids: ['CP-001','CP-002','CP-003','CP-004','CP-005','CP-006','CP-007','CP-008'] },
    { name: '8. Arxitektura, DI (Hilt/Dagger) va Xavfsizlik', ids: ['AR-001','AR-002','AR-003','SEC-001','SEC-002','SEC-003'] },
    { name: '9. Java Core, JVM Xotirasi va Concurrency', ids: ['JV-001','JV-002','JV-003','JV-004','JCON-001','JCON-002'] },
    { name: '10. Oracle SQL, PL/SQL, Tranzaksiyalar va Fintech Backend', ids: ['SQL-001','SQL-002','SQL-003','TX-001','TX-002','TX-003','SP-001','SP-002','SP-003','SP-004','FB-001','FB-002','FB-003'] }
  ];

  view.innerHTML = `
    <div class="graph-container">
      <div class="card">
        <h2 style="margin-top:0">🕸️ Knowledge Graph & Prerequisite Xaritasi</h2>
        <p class="muted">Barcha bilimlar ketma-ket zanjir asosida qurilgan. Agar biror yuqori mavzuni tushunmasangiz, uning chap tomonidagi prerequisite mavzularni tekshiring.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;font-size:12px">
          <span class="status-pill unread">O‘qilmagan</span>
          <span class="status-pill weak">Zaif / Tushunmagan</span>
          <span class="status-pill understood">Tushundim</span>
          <span class="status-pill ready">★ Tushuntira olaman</span>
        </div>
      </div>

      ${chains.map(c => `
        <div class="graph-chain">
          <h3>${esc(c.name)}</h3>
          <div class="graph-nodes">
            ${c.ids.map((id, idx) => {
              const item = byId(id);
              if (!item) return '';
              const st = state.progress[id]?.status || 'unread';
              return `
                <div class="graph-node" data-id="${item.id}" title="${esc(item.title)}">
                  <span class="status-pill ${st}" style="padding:2px 6px">${item.id}</span>
                  <span>${esc(item.shortTitle || item.title)}</span>
                </div>
                ${idx < c.ids.length - 1 ? '<span class="graph-arrow">→</span>' : ''}
              `;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.graph-node[data-id]').forEach(b => {
    b.addEventListener('click', () => go('/lesson/' + b.dataset.id));
  });
}

function resumeView() {
  $('#crumb').textContent = 'Resume Mapping · Rezyume va Nazariya Bog‘liqligi';
  const mappings = [
    {
      skill: "Kotlin & Android SDK",
      cases: "Mobil banking ilovalari, Zygote lifecycle, Memory optimization va Custom View/Compose komponentlari.",
      lessons: ["KT-001", "KT-002", "KT-005", "AN-004", "AN-006"]
    },
    {
      skill: "Coroutines & Flow",
      cases: "Karta balansi va kreditlar ma'lumotlarini parallel yuklash, ekran holatini (UiState) StateFlow orqali reaktiv uzatish, valyuta kurslarini real-vaqtda kuzatish.",
      lessons: ["COR-002", "COR-004", "COR-006", "COR-009", "FL-003", "FL-008"]
    },
    {
      skill: "Clean Architecture & Hilt DI",
      cases: "Domain qatlamini Android SDK'dan mustaqil qilish, to'lov xizmatlarini (Humo/Uzcard) polimorfik interfeyslar orqali ajratish, Unit testlarda Fake repository'lar bilan qoplash.",
      lessons: ["OOP-003", "OOP-005", "AR-001", "AR-002"]
    },
    {
      skill: "Retrofit, OkHttp & Security",
      cases: "401 token muddati tugaganda parallel so'rovlar poygasini (race condition) Authenticator orqali synchronized yangilash, SSL Certificate Pinning, Android Keystore shifrlash.",
      lessons: ["SEC-001", "SEC-002"]
    },
    {
      skill: "Java Concurrency & Memory Model",
      cases: "Thread poollarni sozlash, Race Condition va Deadlock oldini olish, volatile xotira to'siqlari va Compare-And-Swap (CAS) atomik hisob-kitoblari.",
      lessons: ["FND-003", "JCON-001", "JCON-002", "JV-001"]
    },
    {
      skill: "Oracle SQL & PL/SQL Optimization",
      cases: "10+ millionlik tranzaksiya jadvallarini B-Tree indekslar va Partitioning orqali optimallashtirish, BULK COLLECT va FORALL bilan to'lov paketlarini 100 barobar tez qayta ishlash.",
      lessons: ["SQL-002", "TX-001", "TX-003"]
    },
    {
      skill: "Fintech Systems & Distributed Payments",
      cases: "Ikki tomonlama buxgalteriya balansi (Dual-entry Ledger: Debit = Credit), Idempotency-Key yordamida takroriy yechilishlarni (double charge) 100% bartaraf etish.",
      lessons: ["FB-001", "FB-002", "TX-001"]
    }
  ];

  view.innerHTML = `
    <div class="card">
      <h2 style="margin-top:0">💼 Resume Mapping: Sizning Amaliy Tajribangiz va Nazariya</h2>
      <p class="muted">Siz ushbu texnologiyalarni amalda ko‘p yillar davomida ishlatgansiz. Quyida ularning har birining ichki mexanizmlari qaysi darslarda chuqur o‘rganilishi berilgan:</p>
    </div>
    <div class="resume-grid">
      ${mappings.map(m => `
        <div class="resume-card">
          <h3>${esc(m.skill)}</h3>
          <div class="prod-box">
            <b>Amaliy Production misol:</b><br>
            ${esc(m.cases)}
          </div>
          <div style="font-size:13px;font-weight:600;margin-top:4px">Tegishli chuqur darslar:</div>
          <div class="lessons-list">
            ${m.lessons.map(id => {
              const item = byId(id);
              if (!item) return '';
              const st = state.progress[id]?.status || 'unread';
              return `<button type="button" class="btn" data-id="${id}" style="font-size:12px;padding:3px 8px">
                <span class="status-pill ${st}" style="padding:1px 5px">${id}</span>
                ${esc(item.shortTitle || item.title)}
              </button>`;
            }).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.querySelectorAll('.lessons-list [data-id]').forEach(b => {
    b.addEventListener('click', () => go('/lesson/' + b.dataset.id));
  });
}

function review() {
  $('#crumb').textContent = 'Spaced Repetition & Revision';
  const due = L.filter(x => {
    const p = state.progress[x.id];
    return p && (p.status === 'weak' || (p.due && p.due <= Date.now()));
  }).sort((a,b) => (state.progress[a.id]?.due || 0) - (state.progress[b.id]?.due || 0));

  view.innerHTML = `
    <div class="section-title">
      <h2>🔄 Takrorlash Navbati (Active Recall)</h2>
      <span class="status-pill weak">${due.length} ta dars qaytarishga tayyor</span>
    </div>
    <div class="card">
      ${due.length ? due.map(x => `
        <div class="review-item">
          <div>
            <b>${x.id} · ${esc(x.title)}</b>
            <div class="muted" style="font-size:13px">${esc(state.notes[x.id] || 'Ovoz chiqarib o‘z so‘zingiz bilan tushuntirib ko‘ring.')}</div>
          </div>
          <button class="btn btn-status-understood" data-review="${x.id}">Ochish</button>
        </div>
      `).join('') : '<div class="empty">Hozir takrorlash kerak bo‘lgan darslar yo‘q. Yangi mavzularni o‘rganishni davom ettiring!</div>'}
    </div>
  `;

  document.querySelectorAll('[data-review]').forEach(b => {
    b.addEventListener('click', () => go('/lesson/' + b.dataset.review));
  });
}

function moduleView(mod) {
  const m = M.find(x => x.id === mod);
  const arr = L.filter(x => x.module === mod);
  $('#crumb').textContent = m?.name || mod;
  view.innerHTML = `
    <div class="section-title">
      <h2>${esc(m?.name || mod)}</h2>
      <span class="status-pill understood">${pct(mod)}% o‘zlashtirildi</span>
    </div>
    <div class="lesson-grid">${arr.map(card).join('')}</div>
  `;
  bindCards();
}

function mock() {
  const pool = Q.filter(q => !state.progress['mock:' + q.id]?.done);
  const q = (pool.length ? pool : Q)[Math.floor(Math.random() * (pool.length ? pool : Q).length)];
  let sec = 60;
  $('#crumb').textContent = 'Texnik Sinov (Active Recall)';

  view.innerHTML = `
    <div class="card mock-card">
      <div class="lesson-id">${q.id} · ${q.module}</div>
      <div class="mock-q" style="font-size:22px;margin:16px 0;line-height:1.4">${esc(q.q)}</div>
      <div class="timer" id="timer" style="font-size:24px;font-weight:700;color:var(--accent);margin-bottom:12px">01:00</div>
      <p class="muted">Ovoz chiqarib xuddi jamoangizga yoki arxitektura komissiyasiga tushuntirayotgandek javob bering.</p>
      <div class="lesson-actions">
        <button id="hintBtn" type="button" class="btn">💡 Asosiy Kalit So‘zlar</button>
        <button id="nextQ" class="btn btn-status-ready" type="button">Javob berdim → Keyingi</button>
      </div>
      <div id="hint" class="say" hidden style="margin-top:14px">${esc(q.hint)}</div>
    </div>
  `;

  const timer = setInterval(() => {
    sec = Math.max(0, sec - 1);
    const t = $('#timer');
    if (t) t.textContent = `00:${String(sec).padStart(2, '0')}`;
    if (!sec) {
      clearInterval(timer);
      const h = $('#hint');
      if (h) h.hidden = false;
    }
  }, 1000);

  $('#hintBtn').addEventListener('click', () => { $('#hint').hidden = false; });
  $('#nextQ').addEventListener('click', () => {
    clearInterval(timer);
    state.progress['mock:' + q.id] = { done: true, updated: Date.now() };
    save();
    mock();
  });
}

function search(q) {
  q = q.trim().toLowerCase();
  if (!q) { dashboard(); return; }
  const arr = L.filter(x => (x.id + ' ' + x.title + ' ' + x.summary + ' ' + x.searchText).toLowerCase().includes(q)).slice(0, 50);
  $('#crumb').textContent = 'Qidiruv natijalari';
  view.innerHTML = `
    <div class="section-title">
      <h2>Qidiruv</h2>
      <span class="muted">${arr.length} ta natija topildi</span>
    </div>
    <div class="lesson-grid">${arr.map(card).join('')}</div>
  `;
  bindCards();
}

function openModal() { modal.hidden = false; }
function closeModal() { modal.hidden = true; }
$('#closeModal').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

$('#search').addEventListener('input', e => search(e.target.value));
$('#reviewBtn').addEventListener('click', () => go('/review'));
$('#mockBtn').addEventListener('click', () => go('/mock'));
$('#topGraphBtn').addEventListener('click', () => go('/graph'));
$('#topResumeBtn').addEventListener('click', () => go('/resume'));
$('#navDashboard').addEventListener('click', () => go('/'));
$('#navGraph').addEventListener('click', () => go('/graph'));
$('#navResume').addEventListener('click', () => go('/resume'));
$('#navReview').addEventListener('click', () => go('/review'));
$('#menuBtn').addEventListener('click', () => $('.sidebar').classList.toggle('open'));

function route() {
  renderModules();
  $('.sidebar').classList.remove('open');
  const p = (location.hash || '#/').slice(1).split('/').filter(Boolean);
  if (!p.length) {
    $('#crumb').textContent = 'Dashboard';
    dashboard();
  } else if (p[0] === 'module') {
    moduleView(p[1]);
  } else if (p[0] === 'lesson') {
    lessonView(p[1]);
  } else if (p[0] === 'graph') {
    graphView();
  } else if (p[0] === 'resume') {
    resumeView();
  } else if (p[0] === 'review') {
    review();
  } else if (p[0] === 'mock') {
    mock();
  } else {
    dashboard();
  }
}

window.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (!modal.hidden) {
    if (e.key === 'Escape') closeModal();
    return;
  }
  const hash = location.hash || '';
  if (hash.startsWith('#/lesson/')) {
    const curId = hash.slice('#/lesson/'.length);
    const curIdx = L.findIndex(l => l.id === curId);
    if (curIdx !== -1) {
      if ((e.key === 'ArrowRight' || e.key === 'l' || e.key === 'L') && !e.ctrlKey && !e.metaKey) {
        if (curIdx < L.length - 1) go('/lesson/' + L[curIdx + 1].id);
      } else if ((e.key === 'ArrowLeft' || e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey) {
        if (curIdx > 0) go('/lesson/' + L[curIdx - 1].id);
      }
    }
  }
});

window.addEventListener('hashchange', route);
route();
})();
