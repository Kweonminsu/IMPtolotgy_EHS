/**
 * env_safety.js  v3
 * ─────────────────────────────────────────────
 * 1. API 레이어 : 모든 서버 통신 함수가 여기에 모여 있습니다.
 *    실제 fetch() 호출은 주석 처리되어 있고,
 *    샘플 데이터를 Promise.resolve() 로 즉시 반환합니다.
 *    FastAPI 연동 시 해당 함수 안의 주석만 풀면 됩니다.
 *
 * 2. 드래그 앤 드롭 : 패널 상단 핸들(⠿)을 잡아 자유롭게 이동.
 *    위치는 localStorage 에 저장되어 새로고침 후에도 유지됩니다.
 * ─────────────────────────────────────────────
 */
"use strict";

/* ══════════════════════════════════════════════
   ① 샘플 데이터 (서버에서 왔다고 가정)
══════════════════════════════════════════════ */
const SAMPLE_ISSUES = [
  {
    id: 1,
    title: "A동 3층 용접 불꽃 화재 위험",
    category: "화재",
    severity: "긴급",
    status: "미결",
    location: "A동 3층",
    assignee: "김철수",
    reporter: "홍길동",
    desc: "용접 작업 중 불꽃이 인근 가연성 자재에 튀는 사고 위험 감지됨. 즉각적인 안전 조치 필요.",
    createdAt: "2025-02-20 09:15",
    checklist: [
      {
        id: 101,
        text: "용접 구역 가연성 자재 제거",
        category: "화재",
        checked: true,
      },
      {
        id: 102,
        text: "소화기 비치 및 작동 확인",
        category: "화재",
        checked: true,
      },
      {
        id: 103,
        text: "용접 작업 전 화기작업 허가서 발급",
        category: "화재",
        checked: false,
      },
      {
        id: 104,
        text: "방화포 설치 완료 여부",
        category: "화재",
        checked: false,
      },
    ],
    todos: [
      {
        id: 201,
        text: "용접 구역 안전 울타리 설치",
        assignee: "김철수",
        due: "2025-02-22",
        priority: "높음",
        done: false,
      },
      {
        id: 202,
        text: "화재 예방 교육 실시",
        assignee: "박안전",
        due: "2025-02-25",
        priority: "보통",
        done: false,
      },
    ],
  },
  {
    id: 2,
    title: "화학약품 보관함 누출 흔적 발견",
    category: "화학물질",
    severity: "높음",
    status: "진행중",
    location: "B동 창고",
    assignee: "이영희",
    reporter: "최점검",
    desc: "염산 보관함 하단부에 누액 흔적 발견. 즉시 점검 및 밀폐 조치 필요.",
    createdAt: "2025-02-21 11:30",
    checklist: [
      {
        id: 111,
        text: "보호구(방독마스크, 내화학장갑) 착용",
        category: "화학물질",
        checked: true,
      },
      {
        id: 112,
        text: "누출 구역 접근 통제 조치",
        category: "화학물질",
        checked: true,
      },
      {
        id: 113,
        text: "환기 시스템 작동 확인",
        category: "화학물질",
        checked: false,
      },
    ],
    todos: [
      {
        id: 211,
        text: "화학약품 보관함 신규 교체 발주",
        assignee: "이영희",
        due: "2025-02-27",
        priority: "높음",
        done: false,
      },
      {
        id: 212,
        text: "MSDS 게시판 업데이트",
        assignee: "박안전",
        due: "2025-03-01",
        priority: "보통",
        done: true,
      },
    ],
  },
  {
    id: 3,
    title: "작업발판 난간 고정 불량",
    category: "추락",
    severity: "높음",
    status: "미결",
    location: "C동 외벽",
    assignee: "박민준",
    reporter: "홍길동",
    desc: "비계 작업발판 난간의 볼트 2개 누락 확인. 즉시 작업 중지 및 보수 필요.",
    createdAt: "2025-02-21 14:00",
    checklist: [
      {
        id: 121,
        text: "비계 구조 안전 점검 완료",
        category: "추락",
        checked: false,
      },
      {
        id: 122,
        text: "추락 방지망 설치 확인",
        category: "추락",
        checked: false,
      },
      {
        id: 123,
        text: "작업자 안전벨트 지급 및 착용 확인",
        category: "추락",
        checked: true,
      },
    ],
    todos: [
      {
        id: 221,
        text: "난간 볼트 교체 작업",
        assignee: "박민준",
        due: "2025-02-23",
        priority: "높음",
        done: false,
      },
      {
        id: 222,
        text: "비계 전수 안전 점검",
        assignee: "김안전",
        due: "2025-02-26",
        priority: "높음",
        done: false,
      },
    ],
  },
  {
    id: 4,
    title: "압착기 소음 기준치 초과",
    category: "소음",
    severity: "보통",
    status: "완료",
    location: "D동 생산라인",
    assignee: "최수진",
    reporter: "이관리",
    desc: "압착기 소음 측정값 92dB, 법적 기준 90dB 초과. 청력 보호 조치 완료됨.",
    createdAt: "2025-02-19 08:00",
    checklist: [
      { id: 131, text: "소음 측정 기록 보관", category: "소음", checked: true },
      {
        id: 132,
        text: "귀마개 전 작업자 지급 완료",
        category: "소음",
        checked: true,
      },
    ],
    todos: [
      {
        id: 231,
        text: "방음 패널 설치 검토",
        assignee: "최수진",
        due: "2025-03-10",
        priority: "보통",
        done: true,
      },
    ],
  },
  {
    id: 5,
    title: "소화기 유효기간 만료 3개",
    category: "화재",
    severity: "낮음",
    status: "미결",
    location: "F동 전체",
    assignee: "강동원",
    reporter: "김점검",
    desc: "F동 내 소화기 3대의 유효기간이 경과함. 교체 발주 필요.",
    createdAt: "2025-02-22 10:20",
    checklist: [
      {
        id: 141,
        text: "만료 소화기 위치 파악 완료",
        category: "화재",
        checked: true,
      },
      {
        id: 142,
        text: "교체용 소화기 발주 완료",
        category: "화재",
        checked: false,
      },
      {
        id: 143,
        text: "소화기 배치도 업데이트",
        category: "화재",
        checked: false,
      },
    ],
    todos: [
      {
        id: 241,
        text: "소화기 3개 신규 구매",
        assignee: "강동원",
        due: "2025-02-28",
        priority: "보통",
        done: false,
      },
      {
        id: 242,
        text: "F동 전체 소화기 전수 점검",
        assignee: "강동원",
        due: "2025-03-05",
        priority: "낮음",
        done: false,
      },
    ],
  },
];

/* ══════════════════════════════════════════════
   ② API 레이어
   ── FastAPI 연동 시 각 함수 내부의 주석을 해제하고
      return SAMPLE_... 줄을 제거하면 됩니다. ──
══════════════════════════════════════════════ */
const BASE_URL = "/api";

async function apiRequest(method, path, body = null) {
  /* ── 실제 fetch 호출 (연동 시 주석 해제) ──────────────
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API Error ${res.status}: ${path}`);
  return method === 'DELETE' ? null : res.json();
  ──────────────────────────────────────────────── */

  // 샘플 모드: 즉시 resolve (딜레이 시뮬레이션)
  await new Promise((r) => setTimeout(r, 300));
  return null; // 실제 응답 대신 호출부에서 직접 로컬 상태를 조작
}

/* 이슈 전체 조회 */
async function apiGetIssues() {
  /* ── 연동 시 ──
  return apiRequest('GET', '/issues');
  ──────────── */
  await new Promise((r) => setTimeout(r, 400)); // 로딩 시뮬레이션
  return JSON.parse(JSON.stringify(SAMPLE_ISSUES)); // 깊은 복사
}

/* 이슈 생성 */
async function apiCreateIssue(payload) {
  /* return apiRequest('POST', '/issues', payload); */
  await new Promise((r) => setTimeout(r, 200));
  return { ...payload }; // 서버가 id·createdAt 포함해서 돌려준다고 가정
}

/* 이슈 수정 */
async function apiUpdateIssue(id, payload) {
  /* return apiRequest('PUT', `/issues/${id}`, payload); */
  await new Promise((r) => setTimeout(r, 200));
  return { id, ...payload };
}

/* 이슈 삭제 */
async function apiDeleteIssue(id) {
  /* return apiRequest('DELETE', `/issues/${id}`); */
  await new Promise((r) => setTimeout(r, 150));
  return null;
}

/* 체크 토글 */
async function apiToggleCheck(issueId, checkId, checked) {
  /* return apiRequest('PATCH', `/issues/${issueId}/checklist/${checkId}`, { checked }); */
  await new Promise((r) => setTimeout(r, 100));
  return null;
}

/* 체크 삭제 */
async function apiDeleteCheck(issueId, checkId) {
  /* return apiRequest('DELETE', `/issues/${issueId}/checklist/${checkId}`); */
  await new Promise((r) => setTimeout(r, 100));
  return null;
}

/* 체크 추가 */
async function apiAddCheck(issueId, payload) {
  /* return apiRequest('POST', `/issues/${issueId}/checklist`, payload); */
  await new Promise((r) => setTimeout(r, 150));
  return { id: ++nextSubId, ...payload };
}

/* 투두 토글 */
async function apiToggleTodo(issueId, todoId, done) {
  /* return apiRequest('PATCH', `/issues/${issueId}/todos/${todoId}`, { done }); */
  await new Promise((r) => setTimeout(r, 100));
  return null;
}

/* 투두 삭제 */
async function apiDeleteTodo(issueId, todoId) {
  /* return apiRequest('DELETE', `/issues/${issueId}/todos/${todoId}`); */
  await new Promise((r) => setTimeout(r, 100));
  return null;
}

/* 투두 추가 */
async function apiAddTodo(issueId, payload) {
  /* return apiRequest('POST', `/issues/${issueId}/todos`, payload); */
  await new Promise((r) => setTimeout(r, 150));
  return { id: ++nextSubId, ...payload };
}

/* ══════════════════════════════════════════════
   ③ 클라이언트 상태
══════════════════════════════════════════════ */
let issues = [];
let nextIssueId = 100;
let nextSubId = 1000;

let currentDetailIssueId = null;
let formChecks = [];
let formTodos = [];

/* ══════════════════════════════════════════════
   ④ 유틸
══════════════════════════════════════════════ */
const esc = (str) =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function nowStr() {
  const d = new Date();
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}`;
}
const p2 = (n) => String(n).padStart(2, "0");

let toastTimer = null;
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.className = "toast";
  }, 2600);
}

function setLoading(panelId, show) {
  const el = document.getElementById(`loading-${panelId}`);
  if (el) el.classList.toggle("hidden", !show);
}

const ICONS = {
  edit: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  del: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>`,
};
const SEV_COLOR = {
  긴급: "var(--danger-color)",
  높음: "var(--warning-color)",
  보통: "var(--primary-color)",
  낮음: "var(--success-color)",
};

/* ══════════════════════════════════════════════
   ⑤ 집계 헬퍼
══════════════════════════════════════════════ */
function allChecks() {
  return issues.flatMap((i) => i.checklist);
}
function checkPct(cks) {
  return cks.length
    ? Math.round((cks.filter((c) => c.checked).length / cks.length) * 100)
    : 0;
}
function todoPct(tds) {
  return tds.length
    ? Math.round((tds.filter((t) => t.done).length / tds.length) * 100)
    : 0;
}

/* ══════════════════════════════════════════════
   ⑥ 렌더링
══════════════════════════════════════════════ */
function renderIssueTable() {
  const el = document.getElementById("issue-table-container");
  if (!el) return;

  if (!issues.length) {
    el.innerHTML = `<div class="empty-msg">등록된 이슈가 없습니다.</div>`;
    return;
  }

  el.innerHTML = `
    <table class="issue-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>제목</th>
          <th>카테고리</th>
          <th>위험도</th>
          <th>상태</th>
          <th>담당자</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
        ${issues
          .map(
            (i) => `
          <tr onclick="openDetailModal(${i.id})">
            <td>${i.id}</td>
            <td>${esc(i.title)}</td>
            <td>${esc(i.category)}</td>
            <td>${esc(i.severity)}</td>
            <td>${esc(i.status)}</td>
            <td>${esc(i.assignee)}</td>
            <td>${esc(i.createdAt)}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderRiskChart() {
  const chartEl = document.getElementById("echart-risk");
  if (!chartEl) return;

  const chart = echarts.init(chartEl);

  const levels = ["긴급", "높음", "보통", "낮음"];
  const data = levels.map((lv) => ({
    name: lv,
    value: issues.filter((i) => i.severity === lv).length,
  }));

  chart.setOption({
    tooltip: {},
    xAxis: { type: "category", data: levels },
    yAxis: { type: "value" },
    series: [
      {
        type: "bar",
        data: data.map((d) => d.value),
      },
    ],
  });
}

function renderStats() {
  document.getElementById("stat-total").textContent = issues.length;
  document.getElementById("stat-open").textContent = issues.filter(
    (i) => i.status === "미결",
  ).length;
  document.getElementById("stat-done").textContent = issues.filter(
    (i) => i.status === "완료",
  ).length;
  document.getElementById("stat-check-pct").textContent =
    checkPct(allChecks()) + "%";
}

function renderIssues() {
  const catF = document.getElementById("filter-category").value;
  const statusF = document.getElementById("filter-status").value;
  const list = document.getElementById("issue-list");
  const filtered = issues.filter(
    (i) => (!catF || i.category === catF) && (!statusF || i.status === statusF),
  );

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-msg">등록된 이슈가 없습니다.</div>`;
    return;
  }

  list.innerHTML = filtered
    .map((issue) => {
      const chkPct = checkPct(issue.checklist);
      const todPct = todoPct(issue.todos);
      const chkDone = issue.checklist.filter((c) => c.checked).length;
      const todDone = issue.todos.filter((t) => t.done).length;
      return `
    <div class="issue-card" data-id="${issue.id}" onclick="openDetailModal(${issue.id})">
      <div class="sev-dot sev-${esc(issue.severity)}"></div>
      <div class="issue-info">
        <div class="issue-title-text">${esc(issue.title)}</div>
        <div class="issue-meta">
          <span class="status-badge status-${esc(issue.status)}">${esc(issue.status)}</span>
          <span class="cat-badge">${esc(issue.category)}</span>
          <span>${esc(issue.location)}</span>
          <span>담당: ${esc(issue.assignee)}</span>
        </div>
        <div class="issue-progress-mini">
          <div class="mini-bar-item">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--success-color)" stroke-width="2.5"><polyline points="9 11 12 14 22 4"/></svg>
            <div class="mini-bar-wrap"><div class="mini-bar check-bar" style="width:${chkPct}%"></div></div>
            <span>${chkDone}/${issue.checklist.length}</span>
          </div>
          <div class="mini-bar-item">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
            <div class="mini-bar-wrap"><div class="mini-bar todo-bar" style="width:${todPct}%"></div></div>
            <span>${todDone}/${issue.todos.length}</span>
          </div>
        </div>
      </div>
      <div class="issue-actions" onclick="event.stopPropagation()">
        <button class="btn-icon" onclick="openFormModal(${issue.id})" title="편집">${ICONS.edit}</button>
        <button class="btn-icon danger" onclick="handleDeleteIssue(${issue.id})" title="삭제">${ICONS.del}</button>
      </div>
    </div>`;
    })
    .join("");
}

function renderChecklistRollup() {
  const all = allChecks();
  const done = all.filter((c) => c.checked).length;
  const pct = checkPct(all);
  document.getElementById("overall-check-done").textContent = done;
  document.getElementById("overall-check-total").textContent = all.length;
  document.getElementById("overall-check-pct").textContent = pct + "%";
  document.getElementById("overall-check-bar").style.width = pct + "%";

  const el = document.getElementById("checklist-rollup");
  const withChecks = issues.filter((i) => i.checklist.length > 0);
  if (!withChecks.length) {
    el.innerHTML = `<div class="empty-msg">체크리스트가 없습니다.</div>`;
    return;
  }
  el.innerHTML = withChecks
    .map((issue) => {
      const d = issue.checklist.filter((c) => c.checked).length;
      const p = checkPct(issue.checklist);
      return `
    <div class="rollup-item" onclick="openDetailModal(${issue.id})">
      <div class="rollup-issue-name"><span class="sev-badge sev-badge-${esc(issue.severity)}">${esc(issue.severity)}</span>&nbsp;${esc(issue.title)}</div>
      <div class="rollup-bar-row">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar" style="width:${p}%"></div></div>
        <span class="rollup-ratio">${d}/${issue.checklist.length} (${p}%)</span>
      </div>
    </div>`;
    })
    .join("");

  // 콘텐츠 영역 보이기
  const content = document.getElementById("dom3-content");
  if (content) content.style.display = "block";
}

function renderTodoRollup() {
  const el = document.getElementById("todo-rollup");
  const withTodo = issues.filter((i) => i.todos.length > 0);
  if (!withTodo.length) {
    el.innerHTML = `<div class="empty-msg">To-Do가 없습니다.</div>`;
    return;
  }
  el.innerHTML = withTodo
    .map((issue) => {
      const items = issue.todos
        .map(
          (t) => `
      <div class="todo-rollup-item ${t.done ? "done" : ""}" onclick="event.stopPropagation();openDetailModal(${issue.id})">
        <div class="prio-dot ${esc(t.priority)}"></div>
        <span class="todo-rollup-text">${esc(t.text)}</span>
        <span class="todo-rollup-meta">${esc(t.assignee)} · ${esc(t.due)}</span>
      </div>`,
        )
        .join("");
      return `<div class="todo-rollup-group"><div class="todo-rollup-issue-name">${esc(issue.title)}</div>${items}</div>`;
    })
    .join("");
}

function renderCategoryStats() {
  const cats = ["화재", "화학물질", "추락", "소음", "전기", "기타"];
  const max = Math.max(
    ...cats.map((c) => issues.filter((i) => i.category === c).length),
    1,
  );
  document.getElementById("category-stats").innerHTML = cats
    .map((cat) => {
      const cnt = issues.filter((i) => i.category === cat).length;
      const pct = Math.round((cnt / max) * 100);
      return `<div class="cat-row">
      <span class="cat-name">${cat}</span>
      <div class="cat-bar-wrap"><div class="cat-bar cat-color-${cat}" style="width:${pct}%"></div></div>
      <span class="cat-count">${cnt}</span>
    </div>`;
    })
    .join("");
}

function renderTimeline() {
  const sorted = [...issues]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 7);
  const typeMap = { 미결: "new", 진행중: "update", 완료: "done" };
  document.getElementById("timeline").innerHTML = sorted
    .map(
      (i) => `
    <div class="timeline-item">
      <div class="tl-dot ${typeMap[i.status] || "new"}"></div>
      <div>
        <div class="tl-title">[${esc(i.category)}] ${esc(i.title)}</div>
        <div class="tl-time">${esc(i.createdAt)} · ${esc(i.status)} · ${esc(i.assignee)}</div>
      </div>
    </div>`,
    )
    .join("");
}

function renderRiskSummary() {
  document.getElementById("risk-summary").innerHTML = [
    "긴급",
    "높음",
    "보통",
    "낮음",
  ]
    .map((lv) => {
      const cnt = issues.filter((i) => i.severity === lv).length;
      return `<div class="risk-card ${lv}"><div class="risk-num">${cnt}</div><div class="risk-label">위험도 ${lv}</div></div>`;
    })
    .join("");
}

function renderAll() {
  renderStats();
  renderIssues();
  renderChecklistRollup();
  renderTodoRollup();
  renderCategoryStats();
  renderTimeline();
  renderRiskSummary();
  renderRiskChart();
  renderIssueTable();
}

/* ══════════════════════════════════════════════
   ⑦ 데이터 초기 로드 (API)
══════════════════════════════════════════════ */
async function loadAllData() {
  /* 모든 패널 로딩 표시 */
  ["dom2", "dom3", "dom4", "dom5", "dom6", "dom7"].forEach((id) =>
    setLoading(id, true),
  );
  try {
    issues = await apiGetIssues();
    nextIssueId = Math.max(...issues.map((i) => i.id), 0) + 1;
    nextSubId =
      Math.max(
        ...issues.flatMap((i) => [...i.checklist, ...i.todos].map((x) => x.id)),
        999,
      ) + 1;
    renderAll();
  } catch (e) {
    showToast("데이터 로드 실패: " + e.message, "error");
  } finally {
    ["dom2", "dom3", "dom4", "dom5", "dom6", "dom7"].forEach((id) =>
      setLoading(id, false),
    );
  }
}

/* ══════════════════════════════════════════════
   ⑧ 모달 A : 이슈 등록 / 편집
══════════════════════════════════════════════ */
function openFormModal(editId = null) {
  formChecks = [];
  formTodos = [];

  if (editId) {
    const issue = issues.find((i) => i.id === editId);
    if (!issue) return;
    document.getElementById("form-modal-title").textContent = "이슈 편집";
    document.getElementById("edit-issue-id").value = editId;
    document.getElementById("issue-title").value = issue.title;
    document.getElementById("issue-category").value = issue.category;
    document.getElementById("issue-severity").value = issue.severity;
    document.getElementById("issue-location").value = issue.location;
    document.getElementById("issue-assignee").value = issue.assignee;
    document.getElementById("issue-reporter").value = issue.reporter || "";
    document.getElementById("issue-status").value = issue.status;
    document.getElementById("issue-desc").value = issue.desc;
    formChecks = issue.checklist.map((c) => ({ ...c }));
    formTodos = issue.todos.map((t) => ({ ...t }));
  } else {
    document.getElementById("form-modal-title").textContent = "이슈 등록";
    document.getElementById("edit-issue-id").value = "";
    [
      "issue-title",
      "issue-location",
      "issue-assignee",
      "issue-reporter",
      "issue-desc",
    ].forEach((id) => {
      document.getElementById(id).value = "";
    });
    ["issue-category", "issue-severity", "issue-status"].forEach((id) => {
      document.getElementById(id).selectedIndex = 0;
    });
  }
  setActiveTab("info");
  renderFormChecklist();
  renderFormTodos();
  document.getElementById("issue-form-modal").style.display = "flex";
}
function closeFormModal() {
  document.getElementById("issue-form-modal").style.display = "none";
}

function setActiveTab(name) {
  document
    .querySelectorAll(".env-safety-page .modal-tab")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document
    .querySelectorAll(".env-safety-page .tab-panel")
    .forEach((p) => p.classList.toggle("active", p.id === `tab-${name}`));
}

function renderFormChecklist() {
  const ul = document.getElementById("form-checklist-items");
  const empty = document.getElementById("form-check-empty");
  document.getElementById("form-check-count").textContent = formChecks.length;
  if (!formChecks.length) {
    ul.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  ul.innerHTML = formChecks
    .map(
      (c, idx) => `
    <li class="form-check-item">
      <div class="custom-checkbox ${c.checked ? "checked" : ""}" onclick="toggleFormCheck(${idx})"></div>
      <span class="form-item-text">${esc(c.text)}</span>
      <span class="form-item-meta">${esc(c.category)}</span>
      <button class="btn-icon danger" onclick="removeFormCheck(${idx})">${ICONS.del}</button>
    </li>`,
    )
    .join("");
}

function renderFormTodos() {
  const div = document.getElementById("form-todo-items");
  const empty = document.getElementById("form-todo-empty");
  document.getElementById("form-todo-count").textContent = formTodos.length;
  if (!formTodos.length) {
    div.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  div.innerHTML = formTodos
    .map(
      (t, idx) => `
    <div class="form-todo-item prio-${esc(t.priority)}">
      <div class="prio-dot ${esc(t.priority)}"></div>
      <span class="form-item-text">${esc(t.text)}</span>
      <span class="form-item-meta">${esc(t.assignee)} · ${esc(t.due)}</span>
      <button class="btn-icon danger" onclick="removeFormTodo(${idx})">${ICONS.del}</button>
    </div>`,
    )
    .join("");
}

window.toggleFormCheck = (i) => {
  formChecks[i].checked = !formChecks[i].checked;
  renderFormChecklist();
};
window.removeFormCheck = (i) => {
  formChecks.splice(i, 1);
  renderFormChecklist();
};
window.removeFormTodo = (i) => {
  formTodos.splice(i, 1);
  renderFormTodos();
};

async function saveIssue() {
  const title = document.getElementById("issue-title").value.trim();
  if (!title) {
    showToast("제목을 입력해주세요.", "error");
    setActiveTab("info");
    return;
  }

  const payload = {
    title,
    category: document.getElementById("issue-category").value,
    severity: document.getElementById("issue-severity").value,
    location: document.getElementById("issue-location").value.trim(),
    assignee: document.getElementById("issue-assignee").value.trim(),
    reporter: document.getElementById("issue-reporter").value.trim(),
    status: document.getElementById("issue-status").value,
    desc: document.getElementById("issue-desc").value.trim(),
    checklist: formChecks.map((c) => ({ ...c })),
    todos: formTodos.map((t) => ({ ...t })),
  };

  const editId = parseInt(document.getElementById("edit-issue-id").value);
  try {
    if (editId) {
      await apiUpdateIssue(editId, payload);
      const idx = issues.findIndex((i) => i.id === editId);
      if (idx !== -1) issues[idx] = { ...issues[idx], ...payload };
      showToast("이슈가 수정되었습니다.");
    } else {
      payload.createdAt = nowStr();
      payload.id = nextIssueId++;
      await apiCreateIssue(payload);
      issues.push(payload);
      showToast("이슈가 등록되었습니다.");
    }
  } catch (e) {
    showToast("저장 실패: " + e.message, "error");
    return;
  }
  closeFormModal();
  renderAll();
}

window.handleDeleteIssue = async function (id) {
  if (
    !confirm(
      "이슈와 관련 체크리스트·To-Do가 모두 삭제됩니다. 계속하시겠습니까?",
    )
  )
    return;
  try {
    await apiDeleteIssue(id);
    issues = issues.filter((i) => i.id !== id);
    showToast("이슈가 삭제되었습니다.");
    renderAll();
  } catch (e) {
    showToast("삭제 실패: " + e.message, "error");
  }
};

window.openFormModal = openFormModal;

/* ══════════════════════════════════════════════
   ⑨ 모달 B : 이슈 상세 보기
══════════════════════════════════════════════ */
window.openDetailModal = function (id) {
  const issue = issues.find((i) => i.id === id);
  if (!issue) return;
  currentDetailIssueId = id;

  document.getElementById("detail-sev-dot").style.cssText =
    `background:${SEV_COLOR[issue.severity]};box-shadow:0 0 8px ${SEV_COLOR[issue.severity]};`;
  document.getElementById("detail-title").textContent = issue.title;
  document.getElementById("detail-badges").innerHTML = `
    <span class="status-badge status-${esc(issue.status)}">${esc(issue.status)}</span>
    <span class="cat-badge">${esc(issue.category)}</span>
    <span class="sev-badge sev-badge-${esc(issue.severity)}">${esc(issue.severity)}</span>`;

  document.getElementById("detail-info-grid").innerHTML = [
    { label: "위치", value: issue.location },
    { label: "담당자", value: issue.assignee },
    { label: "등록자", value: issue.reporter || "-" },
    { label: "등록일", value: issue.createdAt },
    { label: "카테고리", value: issue.category },
    { label: "위험도", value: issue.severity },
    { label: "상태", value: issue.status },
    {
      label: "체크 진행",
      value: `${issue.checklist.filter((c) => c.checked).length}/${issue.checklist.length} (${checkPct(issue.checklist)}%)`,
    },
  ]
    .map(
      (item) => `
    <div class="info-cell">
      <div class="info-cell-label">${item.label}</div>
      <div class="info-cell-value">${esc(item.value)}</div>
    </div>`,
    )
    .join("");

  document.getElementById("detail-desc-box").textContent =
    issue.desc || "내용 없음";
  renderDetailChecklist();
  renderDetailTodos();
  hideDetailCheckAdd();
  hideDetailTodoAdd();
  document.getElementById("issue-detail-modal").style.display = "flex";
};

function closeDetailModal() {
  document.getElementById("issue-detail-modal").style.display = "none";
  currentDetailIssueId = null;
  renderAll();
}

function renderDetailChecklist() {
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const cks = issue.checklist;
  const done = cks.filter((c) => c.checked).length;
  const pct = checkPct(cks);
  document.getElementById("detail-check-ratio").textContent =
    `${done}/${cks.length}`;
  document.getElementById("detail-check-bar").style.width = pct + "%";

  const ul = document.getElementById("detail-checklist");
  if (!cks.length) {
    ul.innerHTML = `<div class="empty-msg">체크리스트가 없습니다.</div>`;
    return;
  }
  ul.innerHTML = cks
    .map(
      (c) => `
    <li class="detail-check-item ${c.checked ? "checked" : ""}" data-id="${c.id}">
      <div class="custom-checkbox ${c.checked ? "checked" : ""}" onclick="handleToggleCheck(${c.id})"></div>
      <span class="detail-check-text">${esc(c.text)}</span>
      <span class="detail-check-cat">${esc(c.category)}</span>
      <div class="item-actions">
        <button class="btn-icon danger" onclick="handleDeleteCheck(${c.id})">${ICONS.del}</button>
      </div>
    </li>`,
    )
    .join("");
}

function renderDetailTodos() {
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const tds = issue.todos;
  const done = tds.filter((t) => t.done).length;
  document.getElementById("detail-todo-ratio").textContent =
    `${done}/${tds.length}`;

  const div = document.getElementById("detail-todo-list");
  if (!tds.length) {
    div.innerHTML = `<div class="empty-msg">To-Do가 없습니다.</div>`;
    return;
  }
  div.innerHTML = tds
    .map(
      (t) => `
    <div class="detail-todo-item prio-${esc(t.priority)} ${t.done ? "done" : ""}" data-id="${t.id}">
      <div class="custom-checkbox ${t.done ? "checked" : ""}" onclick="handleToggleTodo(${t.id})"></div>
      <div class="detail-todo-info">
        <div class="detail-todo-text">${esc(t.text)}</div>
        <div class="detail-todo-meta">${esc(t.assignee)} · ${esc(t.due)} · ${esc(t.priority)}</div>
      </div>
      <div class="item-actions">
        <button class="btn-icon danger" onclick="handleDeleteTodo(${t.id})">${ICONS.del}</button>
      </div>
    </div>`,
    )
    .join("");
}

/* 체크 인라인 CRUD */
window.handleToggleCheck = async function (checkId) {
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const c = issue.checklist.find((c) => c.id === checkId);
  if (!c) return;
  c.checked = !c.checked;
  try {
    await apiToggleCheck(currentDetailIssueId, checkId, c.checked);
  } catch (e) {
    c.checked = !c.checked;
    showToast("저장 실패", "error");
  }
  renderDetailChecklist();
  renderStats();
  renderChecklistRollup();
};

window.handleDeleteCheck = async function (checkId) {
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const backup = [...issue.checklist];
  issue.checklist = issue.checklist.filter((c) => c.id !== checkId);
  try {
    await apiDeleteCheck(currentDetailIssueId, checkId);
    showToast("항목이 삭제되었습니다.");
  } catch (e) {
    issue.checklist = backup;
    showToast("삭제 실패", "error");
  }
  renderDetailChecklist();
};

function showDetailCheckAdd() {
  document.getElementById("detail-check-add-row").style.display = "flex";
  document.getElementById("detail-check-input").focus();
}
function hideDetailCheckAdd() {
  document.getElementById("detail-check-add-row").style.display = "none";
  document.getElementById("detail-check-input").value = "";
}

async function confirmDetailCheckAdd() {
  const text = document.getElementById("detail-check-input").value.trim();
  if (!text) {
    showToast("항목을 입력해주세요.", "error");
    return;
  }
  const cat = document.getElementById("detail-check-cat").value;
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const newItem = { id: ++nextSubId, text, category: cat, checked: false };
  issue.checklist.push(newItem);
  try {
    await apiAddCheck(currentDetailIssueId, {
      text,
      category: cat,
      checked: false,
    });
    showToast("체크리스트 항목이 추가되었습니다.");
  } catch (e) {
    issue.checklist.pop();
    showToast("추가 실패", "error");
  }
  hideDetailCheckAdd();
  renderDetailChecklist();
}

/* 투두 인라인 CRUD */
window.handleToggleTodo = async function (todoId) {
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const t = issue.todos.find((t) => t.id === todoId);
  if (!t) return;
  t.done = !t.done;
  try {
    await apiToggleTodo(currentDetailIssueId, todoId, t.done);
  } catch (e) {
    t.done = !t.done;
    showToast("저장 실패", "error");
  }
  renderDetailTodos();
};

window.handleDeleteTodo = async function (todoId) {
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  const backup = [...issue.todos];
  issue.todos = issue.todos.filter((t) => t.id !== todoId);
  try {
    await apiDeleteTodo(currentDetailIssueId, todoId);
    showToast("To-Do가 삭제되었습니다.");
  } catch (e) {
    issue.todos = backup;
    showToast("삭제 실패", "error");
  }
  renderDetailTodos();
};

function showDetailTodoAdd() {
  document.getElementById("detail-todo-add-row").style.display = "flex";
  document.getElementById("detail-todo-input").focus();
}
function hideDetailTodoAdd() {
  document.getElementById("detail-todo-add-row").style.display = "none";
  ["detail-todo-input", "detail-todo-assignee", "detail-todo-due"].forEach(
    (id) => {
      document.getElementById(id).value = "";
    },
  );
  document.getElementById("detail-todo-priority").selectedIndex = 0;
}

async function confirmDetailTodoAdd() {
  const text = document.getElementById("detail-todo-input").value.trim();
  if (!text) {
    showToast("할 일을 입력해주세요.", "error");
    return;
  }
  const payload = {
    id: ++nextSubId,
    text,
    done: false,
    assignee:
      document.getElementById("detail-todo-assignee").value.trim() || "-",
    due: document.getElementById("detail-todo-due").value || "-",
    priority: document.getElementById("detail-todo-priority").value,
  };
  const issue = issues.find((i) => i.id === currentDetailIssueId);
  if (!issue) return;
  issue.todos.push(payload);
  try {
    await apiAddTodo(currentDetailIssueId, payload);
    showToast("To-Do가 추가되었습니다.");
  } catch (e) {
    issue.todos.pop();
    showToast("추가 실패", "error");
  }
  hideDetailTodoAdd();
  renderDetailTodos();
}

/* ══════════════════════════════════════════════
   ⑩ 드래그 앤 드롭 패널 시스템
══════════════════════════════════════════════ */
const STORAGE_KEY = "env_safety_panel_layout_v1";

/* 기본 레이아웃 (col x row 기준, 각 패널 크기 포함) */
/* 패널 순서 기반 레이아웃 */
const DEFAULT_LAYOUT = [
  "dom2",
  "dom3",
  "dom4",
  "dom5",
  "dom6",
  "dom7",
  "dom8",
  "dom9",
];

let layout = [];
let dragState = null;
let cloneEl = null;

function loadLayout() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

    // 배열인지 확인
    if (Array.isArray(saved)) return saved;
  } catch {}

  return [...DEFAULT_LAYOUT];
}

function saveLayout() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {}
}
function applyLayout() {
  const container = document.getElementById("panel-canvas");
  layout.forEach((id) => {
    const el = document.getElementById(id);
    if (el) container.appendChild(el);
  });
}
/* 그리드 기반 자동 정렬 */

function resetLayout() {
  layout = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
  saveLayout();
  applyLayout();
  showToast("레이아웃이 초기화되었습니다.");
}

/* 드래그 시작 */
function onDragStart(e, panelEl) {
  if (e.button !== 0) return;
  e.preventDefault();

  const rect = panelEl.getBoundingClientRect();

  dragState = {
    panelId: panelEl.id,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
  };

  /* 드래그 클론 */
  cloneEl = panelEl.cloneNode(true);
  cloneEl.classList.add("drag-clone");
  cloneEl.style.position = "fixed";
  cloneEl.style.width = rect.width + "px";
  cloneEl.style.height = rect.height + "px";
  cloneEl.style.left = rect.left + "px";
  cloneEl.style.top = rect.top + "px";
  cloneEl.style.pointerEvents = "none";
  document.body.appendChild(cloneEl);

  panelEl.classList.add("is-dragging");

  document.addEventListener("mousemove", onDragMove);
  document.addEventListener("mouseup", onDragEnd);
}

function onDragMove(e) {
  if (!dragState || !cloneEl) return;

  const x = e.clientX - dragState.offsetX;
  const y = e.clientY - dragState.offsetY;

  cloneEl.style.left = x + "px";
  cloneEl.style.top = y + "px";
}

function onDragEnd(e) {
  if (!dragState) return;

  const panelEl = document.getElementById(dragState.panelId);

  panelEl.classList.remove("is-dragging");

  // 자동 재정렬 실행
  reorderPanels(e);

  saveLayout();

  if (cloneEl) {
    cloneEl.remove();
    cloneEl = null;
  }

  document.getElementById("drop-ghost").classList.remove("visible");
  dragState = null;

  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
}

//  패널 자동 정렬
function reorderPanels() {
  const container = document.getElementById("panel-canvas");
  const panels = Array.from(container.querySelectorAll(".draggable-panel"));

  // dragging 중이던 패널
  const dragged = panels.find((p) => p.id === dragState.panelId);

  if (!dragged) return;

  // 마우스 위치 기준으로 삽입 위치 계산
  const afterElement = getDragAfterElement(container, event.clientY);

  if (afterElement == null) {
    container.appendChild(dragged);
  } else {
    container.insertBefore(dragged, afterElement);
  }

  saveLayout();
}
// 현재 마우스 위치 아래에 있어야 할 패널 계산
function getDragAfterElement(container, y) {
  const elements = [
    ...container.querySelectorAll(".draggable-panel:not(.is-dragging)"),
  ];

  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}
function initDragAndDrop() {
  document
    .querySelectorAll(".env-safety-page .draggable-panel")
    .forEach((panel) => {
      const handle = panel.querySelector(".drag-handle");
      if (!handle) return;
      handle.addEventListener("mousedown", (e) => onDragStart(e, panel));
    });
}
function initResize() {
  document.querySelectorAll(".draggable-panel").forEach((panel) => {
    const handle = document.createElement("div");
    handle.classList.add("resize-handle");
    panel.appendChild(handle);

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    handle.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      isResizing = true;

      startX = e.clientX;
      startY = e.clientY;
      startWidth = panel.offsetWidth;
      startHeight = panel.offsetHeight;

      document.addEventListener("mousemove", resizeMove);
      document.addEventListener("mouseup", stopResize);
    });

    function resizeMove(e) {
      if (!isResizing) return;

      panel.style.width = startWidth + (e.clientX - startX) + "px";
      panel.style.height = startHeight + (e.clientY - startY) + "px";
    }

    function stopResize() {
      isResizing = false;
      document.removeEventListener("mousemove", resizeMove);
      document.removeEventListener("mouseup", stopResize);
    }
  });
}
/* ══════════════════════════════════════════════
   ⑪ 이벤트 바인딩
══════════════════════════════════════════════ */
function bindEvents() {
  /* 헤더 */
  document.getElementById("btn-open-issue-modal").onclick = () =>
    openFormModal();
  document.getElementById("btn-reset-layout").onclick = resetLayout;

  /* 모달 A */
  document.getElementById("btn-close-form-modal").onclick = closeFormModal;
  document.getElementById("btn-cancel-form-modal").onclick = closeFormModal;
  document.getElementById("btn-save-issue").onclick = saveIssue;

  /* 탭 전환 */
  document.querySelectorAll(".env-safety-page .modal-tab").forEach((btn) => {
    btn.onclick = () => setActiveTab(btn.dataset.tab);
  });

  /* 체크 추가 (등록 폼) */
  document.getElementById("btn-form-add-check").onclick = () => {
    const text = document.getElementById("form-check-input").value.trim();
    if (!text) return;
    formChecks.push({
      id: ++nextSubId,
      text,
      category: document.getElementById("form-check-cat").value,
      checked: false,
    });
    document.getElementById("form-check-input").value = "";
    renderFormChecklist();
  };
  document.getElementById("form-check-input").onkeydown = (e) => {
    if (e.key === "Enter")
      document.getElementById("btn-form-add-check").click();
  };

  /* 투두 추가 (등록 폼) */
  document.getElementById("btn-form-add-todo").onclick = () => {
    const text = document.getElementById("form-todo-input").value.trim();
    if (!text) return;
    formTodos.push({
      id: ++nextSubId,
      text,
      done: false,
      assignee:
        document.getElementById("form-todo-assignee").value.trim() || "-",
      due: document.getElementById("form-todo-due").value || "-",
      priority: document.getElementById("form-todo-priority").value,
    });
    document.getElementById("form-todo-input").value = "";
    document.getElementById("form-todo-assignee").value = "";
    document.getElementById("form-todo-due").value = "";
    renderFormTodos();
  };
  document.getElementById("form-todo-input").onkeydown = (e) => {
    if (e.key === "Enter") document.getElementById("btn-form-add-todo").click();
  };

  /* 모달 B */
  document.getElementById("btn-close-detail-modal").onclick = closeDetailModal;
  document.getElementById("btn-close-detail-bottom").onclick = closeDetailModal;
  document.getElementById("btn-detail-edit").onclick = () => {
    const id = currentDetailIssueId;
    closeDetailModal();
    openFormModal(id);
  };

  /* 체크리스트 인라인 (상세 모달) */
  document.getElementById("btn-detail-add-check").onclick = showDetailCheckAdd;
  document.getElementById("btn-detail-check-confirm").onclick =
    confirmDetailCheckAdd;
  document.getElementById("btn-detail-check-cancel").onclick =
    hideDetailCheckAdd;
  document.getElementById("detail-check-input").onkeydown = (e) => {
    if (e.key === "Enter") confirmDetailCheckAdd();
    if (e.key === "Escape") hideDetailCheckAdd();
  };

  /* 투두 인라인 (상세 모달) */
  document.getElementById("btn-detail-add-todo").onclick = showDetailTodoAdd;
  document.getElementById("btn-detail-todo-confirm").onclick =
    confirmDetailTodoAdd;
  document.getElementById("btn-detail-todo-cancel").onclick = hideDetailTodoAdd;
  document.getElementById("detail-todo-input").onkeydown = (e) => {
    if (e.key === "Enter") confirmDetailTodoAdd();
    if (e.key === "Escape") hideDetailTodoAdd();
  };

  /* 필터 */
  document.getElementById("filter-category").onchange = renderIssues;
  document.getElementById("filter-status").onchange = renderIssues;

  /* 모달 배경 클릭 닫기 */
  ["issue-form-modal", "issue-detail-modal"].forEach((id) => {
    document.getElementById(id).addEventListener("click", (e) => {
      if (e.target.id === id) {
        if (id === "issue-form-modal") closeFormModal();
        if (id === "issue-detail-modal") closeDetailModal();
      }
    });
  });

  /* ESC 키 */
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeFormModal();
    closeDetailModal();
  });
}

/* ══════════════════════════════════════════════
   ⑫ 초기화
══════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();

  /* 레이아웃 복원 → 적용 */
  layout = loadLayout();
  applyLayout();

  /* 드래그 초기화 */
  initDragAndDrop();
  initResize();

  /* 데이터 로드 (API 호출) */
  await loadAllData();

  /* 카테고리 바 진입 애니메이션 */
  setTimeout(renderCategoryStats, 150);
});
