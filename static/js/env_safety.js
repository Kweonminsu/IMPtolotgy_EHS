/**
 * env_safety.js  v4 (개선 버전)
 * ─────────────────────────────────────────────
 * 개선사항:
 * 1. IIFE 패턴으로 전역 스코프 오염 방지
 * 2. 드래그 앤 드롭 중복 리스너 방어 코드
 * 3. 동적 패널 cleanup 로직
 * 4. API 재시도 및 타임아웃 처리
 * 5. 날짜 유효성 검증
 * ─────────────────────────────────────────────
 */

(function () {
  "use strict";
  /* ══════════════════════════════════════════════
   ① 샘플 데이터 (서버에서 왔다고 가정)
══════════════════════════════════════════════ */
  // TESTTEST 샘플데이터
  // const SAMPLE_ISSUES = [
  //   // ── 기존 5개 (원본 그대로 유지) ──
  //   {
  //     id: 1,
  //     title: "A동 3층 용접 불꽃 화재 위험",
  //     category: "화재",
  //     severity: "긴급",
  //     status: "미결",
  //     location: "A라인",
  //     assignee: "김철수",
  //     reporter: "홍길동",
  //     desc: "용접 작업 중 불꽃이 인근 가연성 자재에 튀는 사고 위험 감지됨.",
  //     createdAt: "2025-02-20 09:15",
  //     checklist: [
  //       {
  //         id: 101,
  //         text: "용접 구역 가연성 자재 제거",
  //         category: "화재",
  //         checked: true,
  //       },
  //       {
  //         id: 102,
  //         text: "소화기 비치 및 작동 확인",
  //         category: "화재",
  //         checked: true,
  //       },
  //       {
  //         id: 103,
  //         text: "용접 작업 전 화기작업 허가서 발급",
  //         category: "화재",
  //         checked: false,
  //       },
  //       {
  //         id: 104,
  //         text: "방화포 설치 완료 여부",
  //         category: "화재",
  //         checked: false,
  //       },
  //     ],
  //     todos: [
  //       {
  //         id: 201,
  //         text: "용접 구역 안전 울타리 설치",
  //         assignee: "김철수",
  //         due: "2025-02-22",
  //         priority: "높음",
  //         done: false,
  //       },
  //       {
  //         id: 202,
  //         text: "화재 예방 교육 실시",
  //         assignee: "박안전",
  //         due: "2025-02-25",
  //         priority: "보통",
  //         done: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     title: "화학약품 보관함 누출 흔적 발견",
  //     category: "화학물질",
  //     severity: "높음",
  //     status: "진행중",
  //     location: "B라인",
  //     assignee: "이영희",
  //     reporter: "최점검",
  //     desc: "염산 보관함 하단부에 누액 흔적 발견.",
  //     createdAt: "2025-02-21 11:30",
  //     checklist: [
  //       {
  //         id: 111,
  //         text: "보호구 착용 확인",
  //         category: "화학물질",
  //         checked: true,
  //       },
  //       {
  //         id: 112,
  //         text: "누출 구역 접근 통제",
  //         category: "화학물질",
  //         checked: true,
  //       },
  //       {
  //         id: 113,
  //         text: "환기 시스템 작동 확인",
  //         category: "화학물질",
  //         checked: false,
  //       },
  //     ],
  //     todos: [
  //       {
  //         id: 211,
  //         text: "화학약품 보관함 신규 교체",
  //         assignee: "이영희",
  //         due: "2025-02-27",
  //         priority: "높음",
  //         done: false,
  //       },
  //       {
  //         id: 212,
  //         text: "MSDS 게시판 업데이트",
  //         assignee: "박안전",
  //         due: "2025-03-01",
  //         priority: "보통",
  //         done: true,
  //       },
  //     ],
  //   },
  //   {
  //     id: 3,
  //     title: "작업발판 난간 고정 불량",
  //     category: "추락",
  //     severity: "높음",
  //     status: "미결",
  //     location: "C라인",
  //     assignee: "박민준",
  //     reporter: "홍길동",
  //     desc: "비계 작업발판 난간 볼트 2개 누락.",
  //     createdAt: "2025-02-21 14:00",
  //     checklist: [
  //       {
  //         id: 121,
  //         text: "비계 구조 안전 점검",
  //         category: "추락",
  //         checked: false,
  //       },
  //       {
  //         id: 122,
  //         text: "추락 방지망 설치 확인",
  //         category: "추락",
  //         checked: false,
  //       },
  //       {
  //         id: 123,
  //         text: "작업자 안전벨트 착용 확인",
  //         category: "추락",
  //         checked: true,
  //       },
  //     ],
  //     todos: [
  //       {
  //         id: 221,
  //         text: "난간 볼트 교체 작업",
  //         assignee: "박민준",
  //         due: "2025-02-23",
  //         priority: "높음",
  //         done: false,
  //       },
  //     ],
  //   },
  //   {
  //     id: 4,
  //     title: "압착기 소음 기준치 초과",
  //     category: "소음",
  //     severity: "보통",
  //     status: "완료",
  //     location: "D라인",
  //     assignee: "최수진",
  //     reporter: "이관리",
  //     desc: "압착기 소음 92dB, 법적 기준 초과.",
  //     createdAt: "2025-02-19 08:00",
  //     checklist: [
  //       {
  //         id: 131,
  //         text: "소음 측정 기록 보관",
  //         category: "소음",
  //         checked: true,
  //       },
  //       {
  //         id: 132,
  //         text: "귀마개 전 작업자 지급",
  //         category: "소음",
  //         checked: true,
  //       },
  //     ],
  //     todos: [
  //       {
  //         id: 231,
  //         text: "방음 패널 설치 검토",
  //         assignee: "최수진",
  //         due: "2025-03-10",
  //         priority: "보통",
  //         done: true,
  //       },
  //     ],
  //   },
  //   {
  //     id: 5,
  //     title: "소화기 유효기간 만료 3개",
  //     category: "화재",
  //     severity: "낮음",
  //     status: "미결",
  //     location: "A라인",
  //     assignee: "강동원",
  //     reporter: "김점검",
  //     desc: "F동 내 소화기 3대 유효기간 경과.",
  //     createdAt: "2025-02-22 10:20",
  //     checklist: [
  //       {
  //         id: 141,
  //         text: "만료 소화기 위치 파악",
  //         category: "화재",
  //         checked: true,
  //       },
  //       {
  //         id: 142,
  //         text: "교체용 소화기 발주",
  //         category: "화재",
  //         checked: false,
  //       },
  //     ],
  //     todos: [
  //       {
  //         id: 241,
  //         text: "소화기 3개 신규 구매",
  //         assignee: "강동원",
  //         due: "2025-02-28",
  //         priority: "보통",
  //         done: false,
  //       },
  //     ],
  //   },

  //   // ── 아래부터 29개 완전 랜덤 생성 (체크리스트·To-Do 모두 다양하게) ──
  //   ...Array.from({ length: 29 }, (_, i) => {
  //     const lines = ["A라인", "B라인", "C라인", "D라인"];
  //     const cats = ["화재", "화학물질", "추락", "소음", "전기", "기타"];
  //     const sevs = ["낮음", "보통", "높음", "긴급"];
  //     const statuses = ["미결", "진행중", "완료"];

  //     const cat = cats[i % 6];
  //     const line = lines[i % 4];
  //     const dateList = [
  //       "2025-01-05",
  //       "2025-01-08",
  //       "2025-01-12",
  //       "2025-01-15",
  //       "2025-01-18",
  //       "2025-01-22",
  //       "2025-01-25",
  //       "2025-02-03",
  //       "2025-02-07",
  //       "2025-02-10",
  //       "2025-02-14",
  //       "2025-02-17",
  //       "2025-02-20",
  //       "2025-02-24",
  //       "2025-03-02",
  //       "2025-03-05",
  //       "2025-03-09",
  //       "2025-03-12",
  //       "2025-03-16",
  //       "2025-03-19",
  //       "2025-03-23",
  //       "2025-03-27",
  //       "2026-01-04",
  //       "2026-01-11",
  //       "2026-01-18",
  //       "2026-01-25",
  //       "2026-02-01",
  //       "2026-02-08",
  //       "2026-02-15",
  //       "2026-02-22",
  //       "2026-03-01",
  //       "2026-03-08",
  //       "2026-03-15",
  //       "2026-03-22",
  //     ];

  //     const randomDate = dateList[i % dateList.length]; // 순차적으로 날짜 할당

  //     // 체크리스트 랜덤 생성 (2~5개)
  //     const checkPool = {
  //       화재: [
  //         "용접 구역 가연물 제거",
  //         "소화기 압력 확인",
  //         "화기작업 허가서 발급",
  //         "방화문 작동 테스트",
  //         "비상조명 점검",
  //       ],
  //       화학물질: [
  //         "보호구 착용 확인",
  //         "누출 감지기 작동",
  //         "환기 시스템 점검",
  //         "MSDS 게시",
  //         "중화제 비치",
  //       ],
  //       추락: [
  //         "안전벨트 착용",
  //         "난간 고정 볼트 확인",
  //         "추락 방지망 설치",
  //         "작업발판 안정성 점검",
  //       ],
  //       소음: [
  //         "소음 측정 기록",
  //         "귀마개 지급",
  //         "방음 패널 설치",
  //         "작업자 청력 검사",
  //       ],
  //       전기: [
  //         "접지 확인",
  //         "누전차단기 테스트",
  //         "전선 피복 상태 점검",
  //         "배전반 청소",
  //       ],
  //       기타: [
  //         "안전 표지판 부착",
  //         "비상구 통로 확보",
  //         "소방로 확보",
  //         "작업자 안전교육",
  //       ],
  //     };

  //     const checks = Array.from(
  //       { length: 2 + Math.floor(Math.random() * 4) },
  //       (_, idx) => ({
  //         id: 300 + i * 10 + idx,
  //         text: checkPool[cat][idx % checkPool[cat].length],
  //         category: cat,
  //         checked: Math.random() > 0.5,
  //       }),
  //     );

  //     // To-Do 랜덤 생성 (1~4개)
  //     const todoPool = {
  //       화재: [
  //         "화재 예방 교육 실시",
  //         "소화기 교체",
  //         "용접 작업 허가 프로세스 개선",
  //       ],
  //       화학물질: ["누출 센서 교체", "화학물질 보관 기준 강화", "MSDS 최신화"],
  //       추락: ["난간 보강 공사", "안전망 추가 설치", "작업자 안전벨트 점검"],
  //       소음: [
  //         "방음 패널 설치",
  //         "작업자 청력 보호구 지급",
  //         "소음 저감 장치 검토",
  //       ],
  //       전기: ["배전반 점검", "접지 저항 측정", "전기 설비 정기 점검"],
  //       기타: ["안전 표지판 교체", "비상구 조명 교체", "작업자 안전교육 실시"],
  //     };

  //     const todos = Array.from(
  //       { length: 1 + Math.floor(Math.random() * 4) },
  //       (_, idx) => ({
  //         id: 400 + i * 10 + idx,
  //         text: todoPool[cat][idx % todoPool[cat].length],
  //         assignee: ["김철수", "이영희", "박민준", "최수진", "강동원"][
  //           Math.floor(Math.random() * 5)
  //         ],
  //         due: `${randomDate}`,
  //         priority: ["낮음", "보통", "높음"][Math.floor(Math.random() * 3)],
  //         done: Math.random() > 0.6,
  //       }),
  //     );

  //     return {
  //       id: 6 + i,
  //       title: `${line} ${cat} 안전 이슈 #${6 + i}`,
  //       category: cat,
  //       severity: sevs[i % 4],
  //       status: statuses[i % 3],
  //       location: line,
  //       assignee: ["김철수", "이영희", "박민준", "최수진", "강동원"][i % 5],
  //       reporter: "홍길동",
  //       desc: `자동 생성된 ${cat} 관련 안전 이슈입니다.`,
  //       createdAt: `${randomDate} ${String(8 + (i % 12)).padStart(2, "0")}:00`,
  //       checklist: checks,
  //       todos: todos,
  //     };
  //   }),
  // ];

  /* ══════════════════════════════════════════════
   ② API 레이어
   ── FastAPI 연동 시 각 함수 내부의 주석을 해제하고
      return SAMPLE_... 줄을 제거하면 됩니다. ──
══════════════════════════════════════════════ */
  // 추가: API 레이어에 재시도 및 타임아웃 로직 추가
  const BASE_URL = "/api";
  const API_TIMEOUT = 10000; // 10초
  const MAX_RETRIES = 3;

  async function apiRequest(method, path, body = null, retries = MAX_RETRIES) {
    /* ── 실제 fetch 호출 (연동 시 주석 해제) ──────────────
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const res = await fetch(`${BASE_URL}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) {
        // 5xx 에러는 재시도
        if (res.status >= 500 && attempt < retries) {
          await new Promise(r => setTimeout(r, 1000 * attempt)); // 지수 백오프
          continue;
        }
        throw new Error(`API Error ${res.status}: ${path}`);
      }
      
      return method === 'DELETE' ? null : res.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.');
      }
      
      // 마지막 시도였으면 에러 throw
      if (attempt === retries) {
        throw err;
      }
      
      // 재시도 전 대기 (지수 백오프)
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  ──────────────────────────────────────────────── */

    // 샘플 모드
    await new Promise((r) => setTimeout(r, 300));
    return null;
  }

  /* 이슈 전체 조회 */
  /* ====================== 대시보드 API ====================== */
  async function apiGetDashboard() {
    return apiRequest("GET", "/dashboard");
  }

  /* 기존 apiGetIssues는 dashboard를 통해 가져오도록 래퍼로 유지 */
  async function apiGetIssues() {
    const data = await apiGetDashboard();
    return data.issues || [];
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

  /* 날짜 유효성 검증 */
  function validateDate(dateStr) {
    if (!dateStr) return true;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date);
  }

  function validateDateRange(
    dateStr,
    minDaysFromNow = 0,
    maxDaysFromNow = 365,
  ) {
    if (!dateStr) return { valid: true };

    const date = new Date(dateStr);
    if (isNaN(date)) {
      return { valid: false, message: "올바른 날짜 형식이 아닙니다." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays < minDaysFromNow) {
      return { valid: false, message: `마감일은 최소 오늘 이후여야 합니다.` };
    }
    if (diffDays > maxDaysFromNow) {
      return { valid: false, message: `마감일은 1년 이내로 설정해주세요.` };
    }

    return { valid: true };
  }

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
          <tr onclick="EnvSafety.openDetailModal(${i.id})">
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

  /* ==================== 작업 통계 그래프 ==================== */
  let currentTypes = ["전체"];

  function renderRiskChart() {
    const container = document.getElementById("echart-risk");
    if (!container) return;

    let html = `
    <div style="padding:12px 20px 10px; border-bottom:1px solid var(--border); background:var(--lighter-bg);">
      <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap; font-size:0.85rem;">
        <span style="font-weight:600; color:var(--gray-color);">조회 타입:</span>
        <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
          <input type="checkbox" value="전체" ${currentTypes.includes("전체") ? "checked" : ""} onchange="toggleRiskType(this)"> 전체
        </label>
        ${["화재", "화학물질", "추락", "소음", "전기", "기타"]
          .map(
            (cat) => `
          <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
            <input type="checkbox" value="${cat}" ${currentTypes.includes(cat) ? "checked" : ""} onchange="toggleRiskType(this)"> ${cat}
          </label>
        `,
          )
          .join("")}
      </div>
    </div>
    <div id="risk-charts-container" style="padding:8px 0px 4px; overflow-y:auto; overflow-x:hidden; transition:height 0.35s ease;">
    </div>
  `;

    container.innerHTML = html;
    const containerEl = document.getElementById("risk-charts-container");

    const numTypes = currentTypes.length;
    const HEIGHT_PER_BLOCK = 290; // 실제 그래프 4개 높이 + 여백 최소화
    const MAX_VISIBLE = 3;

    const targetHeight = HEIGHT_PER_BLOCK * Math.min(numTypes, MAX_VISIBLE) + 8;

    containerEl.style.height = targetHeight + "px";
    container.style.height = targetHeight + 72 + "px"; // echart-risk 전체

    const panel8 = document.getElementById("dom8");
    if (panel8) {
      panel8.style.height = "auto";
      panel8.style.minHeight = targetHeight + 210 + "px";
    }

    currentTypes.forEach((type, index) => {
      const block = document.createElement("div");
      block.style = `
      border:1px solid var(--border); 
      border-radius:10px; 
      background:var(--lighter-bg); 
      padding:14px; 
      margin-bottom: ${index === currentTypes.length - 1 ? "0" : "12px"};
    `;
      block.innerHTML = `

      <div style="display:flex; gap:16px; overflow-x:auto; padding-bottom:4px;">
        <div style="min-width:340px;"><div style="text-align:center; font-size:0.8rem; color:var(--gray-color); margin-bottom:6px;">월간 발생 횟수</div><div id="chart-${type}-month-total" style="height:245px;"></div></div>
        <div style="min-width:340px;"><div style="text-align:center; font-size:0.8rem; color:var(--gray-color); margin-bottom:6px;">주간 발생 횟수</div><div id="chart-${type}-week-total" style="height:245px;"></div></div>
        <div style="min-width:340px;"><div style="text-align:center; font-size:0.8rem; color:var(--gray-color); margin-bottom:6px;">월간 라인별</div><div id="chart-${type}-month-line" style="height:245px;"></div></div>
        <div style="min-width:340px;"><div style="text-align:center; font-size:0.8rem; color:var(--gray-color); margin-bottom:6px;">주간 라인별</div><div id="chart-${type}-week-line" style="height:245px;"></div></div>
      </div>
    `;
      containerEl.appendChild(block);
      renderFourCharts(type);
    });

    containerEl.style.overflowY = numTypes > MAX_VISIBLE ? "auto" : "hidden";
  }

  window.toggleRiskType = function (checkbox) {
    const type = checkbox.value;
    if (type === "전체") {
      currentTypes = checkbox.checked
        ? ["전체"]
        : currentTypes.filter((t) => t !== "전체");
    } else {
      if (checkbox.checked) {
        currentTypes = currentTypes.filter((t) => t !== "전체");
        if (!currentTypes.includes(type)) currentTypes.push(type);
      } else {
        currentTypes = currentTypes.filter((t) => t !== type);
      }
    }
    if (currentTypes.length === 0) currentTypes = ["전체"];
    renderRiskChart();
  };

  window.toggleRiskType = function (checkbox) {
    const type = checkbox.value;
    if (type === "전체") {
      currentTypes = checkbox.checked
        ? ["전체"]
        : currentTypes.filter((t) => t !== "전체");
    } else {
      if (checkbox.checked) {
        currentTypes = currentTypes.filter((t) => t !== "전체");
        if (!currentTypes.includes(type)) currentTypes.push(type);
      } else {
        currentTypes = currentTypes.filter((t) => t !== type);
      }
    }
    if (currentTypes.length === 0) currentTypes = ["전체"];
    renderRiskChart();
  };

  // 타입 체크박스 토글
  window.toggleRiskType = function (checkbox) {
    const type = checkbox.value;

    if (type === "전체") {
      if (checkbox.checked) {
        currentTypes = ["전체", ...currentTypes.filter((t) => t !== "전체")];
      } else {
        currentTypes = currentTypes.filter((t) => t !== "전체");
      }
    } else {
      if (checkbox.checked) {
        if (!currentTypes.includes(type)) currentTypes.push(type);
      } else {
        currentTypes = currentTypes.filter((t) => t !== type);
      }
    }

    // "전체"가 없으면 기본으로 다시 넣기 (사용자 경험 위해)
    // if (currentTypes.length === 0) currentTypes = ["전체"];

    renderRiskChart();
  };

  // 4개 그래프 생성 함수
  function renderFourCharts(type) {
    const filteredIssues =
      type === "전체" ? issues : issues.filter((i) => i.category === type);

    // 월/주 그룹핑
    const monthMap = {},
      weekMap = {};
    filteredIssues.forEach((issue) => {
      const d = new Date(issue.createdAt);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const weekKey = `${d.getFullYear()}-W${String(Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7)).padStart(2, "0")}`;

      if (!monthMap[monthKey]) monthMap[monthKey] = [];
      if (!weekMap[weekKey]) weekMap[weekKey] = [];
      monthMap[monthKey].push(issue);
      weekMap[weekKey].push(issue);
    });

    const months = Object.keys(monthMap).sort();
    const weeks = Object.keys(weekMap).sort();
    const lines = ["A라인", "B라인", "C라인", "D라인"];

    // ==================== 1. 월간 전체 발생 ====================
    const c1 = echarts.init(
      document.getElementById(`chart-${type}-month-total`),
    );
    c1.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: months.map((m) => monthMap[m]?.length || 0),
          itemStyle: { color: "#2f6fed" },
          label: { show: true, position: "top", fontSize: 11 },
        },
      ],
    });
    c1.on("click", (params) => showPeriodDetailModal(params.name, true, type)); // 월간 클릭

    // ==================== 2. 주간 전체 발생 ====================
    const c2 = echarts.init(
      document.getElementById(`chart-${type}-week-total`),
    );
    c2.setOption({
      tooltip: { trigger: "axis" },
      xAxis: { type: "category", data: weeks },
      yAxis: { type: "value" },
      series: [
        {
          type: "bar",
          data: weeks.map((w) => weekMap[w]?.length || 0),
          itemStyle: { color: "#2f6fed" },
          label: { show: true, position: "top", fontSize: 11 },
        },
      ],
    });
    c2.on("click", (params) => showPeriodDetailModal(params.name, false, type)); // 주간 클릭

    // ==================== 3. 월간 라인별 (Line) ====================
    const c3 = echarts.init(
      document.getElementById(`chart-${type}-month-line`),
    );
    c3.setOption({
      tooltip: { trigger: "axis" },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: months },
      yAxis: { type: "value" },
      series: lines.map((line) => ({
        name: line,
        type: "line",
        smooth: true,
        data: months.map(
          (m) => monthMap[m]?.filter((i) => i.location === line).length || 0,
        ),
        label: { show: true, position: "top", fontSize: 10 },
      })),
    });
    c3.on("click", (params) => showPeriodDetailModal(params.name, true, type));

    // ==================== 4. 주간 라인별 (Line) ====================
    const c4 = echarts.init(document.getElementById(`chart-${type}-week-line`));
    c4.setOption({
      tooltip: { trigger: "axis" },
      legend: { bottom: 0 },
      xAxis: { type: "category", data: weeks },
      yAxis: { type: "value" },
      series: lines.map((line) => ({
        name: line,
        type: "line",
        smooth: true,
        data: weeks.map(
          (w) => weekMap[w]?.filter((i) => i.location === line).length || 0,
        ),
        label: { show: true, position: "top", fontSize: 10 },
      })),
    });
    c4.on("click", (params) => showPeriodDetailModal(params.name, false, type));
  }

  function showPeriodDetailModal(periodKey, isMonth, typeFilter) {
    let filtered = issues;
    if (typeFilter !== "전체") {
      filtered = filtered.filter((i) => i.category === typeFilter);
    }

    const periodIssues = filtered.filter((issue) => {
      const d = new Date(issue.createdAt);
      const key = isMonth
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        : `${d.getFullYear()}-W${String(Math.ceil(((d - new Date(d.getFullYear(), 0, 1)) / 86400000 + 1) / 7)).padStart(2, "0")}`;
      return key === periodKey;
    });

    const modalHTML = `
    <div class="modal modal-xl" style="max-width:1180px;">
      <div class="modal-header">
        <h3>
          ${periodKey} ${typeFilter === "전체" ? "" : `(${typeFilter})`} 발생 이슈 
          <span style="color:#2f6fed;">(${periodIssues.length}건)</span>
        </h3>
        <button class="modal-close" onclick="closePeriodModal()">×</button>
      </div>
      <div class="modal-body" style="padding:0;">
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:14px 12px; text-align:left; border-bottom:1px solid var(--border);">ID</th>
              <th style="padding:14px 12px; text-align:left; border-bottom:1px solid var(--border);">제목</th>
              <th style="padding:14px 12px; text-align:left; border-bottom:1px solid var(--border);">카테고리</th>
              <th style="padding:14px 12px; text-align:left; border-bottom:1px solid var(--border);">라인</th>
              <th style="padding:14px 12px; text-align:left; border-bottom:1px solid var(--border);">위험도</th>
              <th style="padding:14px 12px; text-align:left; border-bottom:1px solid var(--border);">등록일</th>
            </tr>
          </thead>
          <tbody>
            ${periodIssues
              .map(
                (i) => `
              <tr onclick="EnvSafety.openDetailModal(${i.id}); closePeriodModal()" 
                  style="cursor:pointer;">
                <td style="padding:13px 12px; border-bottom:1px solid var(--border);">${i.id}</td>
                <td style="padding:13px 12px; border-bottom:1px solid var(--border);">${esc(i.title)}</td>
                <td style="padding:13px 12px; border-bottom:1px solid var(--border);">${esc(i.category)}</td>
                <td style="padding:13px 12px; border-bottom:1px solid var(--border);">${esc(i.location)}</td>
                <td style="padding:13px 12px; border-bottom:1px solid var(--border);">${esc(i.severity)}</td>
                <td style="padding:13px 12px; border-bottom:1px solid var(--border);">${esc(i.createdAt)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <div class="modal-footer">
        <button class="btn-ghost" onclick="closePeriodModal()">닫기</button>
      </div>
    </div>
  `;

    let overlay = document.getElementById("period-modal");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "period-modal";
      overlay.className = "modal-overlay env-safety-page"; // 스타일 적용 목적
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = modalHTML;
    overlay.style.display = "flex";
  }

  // 모달 닫기 함수
  window.closePeriodModal = function () {
    const overlay = document.getElementById("period-modal");
    if (overlay) overlay.style.display = "none";
  };

  // 모달 닫기 함수
  window.closePeriodModal = function () {
    const overlay = document.getElementById("period-modal");
    if (overlay) overlay.style.display = "none";
  };

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
      (i) =>
        (!catF || i.category === catF) && (!statusF || i.status === statusF),
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
    <div class="issue-card" data-id="${issue.id}" onclick="EnvSafety.openDetailModal(${issue.id})">
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
        <button class="btn-icon" onclick="EnvSafety.openFormModal(${issue.id})" title="편집">${ICONS.edit}</button>
        <button class="btn-icon danger" onclick="EnvSafety.handleDeleteIssue(${issue.id})" title="삭제">${ICONS.del}</button>
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
    <div class="rollup-item" onclick="EnvSafety.openDetailModal(${issue.id})">
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
      <div class="todo-rollup-item ${t.done ? "done" : ""}" onclick="event.stopPropagation();EnvSafety.openDetailModal(${issue.id})">
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
    if (PANEL_CONFIG.dom5.enabled === false) return;
    const el = document.getElementById("category-stats");
    if (!el) return;
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
    if (PANEL_CONFIG.dom7.enabled === false) return;
    const el = document.getElementById("risk-summary");
    if (!el) return;
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

  /* ====================== DOM10 : 연도별 생산라인별 라인 그래프 (너비 문제 완전 해결) ====================== */
  function renderYearlyLineCharts() {
    const container = document.getElementById("yearly-charts-container");
    if (!container) return;

    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexWrap = "wrap";
    container.style.gap = "24px";
    container.style.padding = "16px 12px";
    container.style.width = "100%"; // ← 추가

    const COLOR_PALETTE = [
      "#2f6fed",
      "#16a34a",
      "#f59e0b",
      "#e5484d",
      "#8b5cf6",
      "#ec4899",
      "#14b8a6",
    ];

    const uniqueLines = [
      ...new Set(issues.map((i) => i.location).filter(Boolean)),
    ].sort();

    const yearly = {};
    issues.forEach((issue) => {
      const year = issue.createdAt.substring(0, 4);
      const month = parseInt(issue.createdAt.substring(5, 7));
      if (!yearly[year]) yearly[year] = {};
      if (!yearly[year][month]) {
        yearly[year][month] = {};
        uniqueLines.forEach((l) => (yearly[year][month][l] = 0));
      }
      const line = issue.location || "기타";
      if (yearly[year][month][line] !== undefined) yearly[year][month][line]++;
    });

    const years = Object.keys(yearly).sort();

    years.forEach((year) => {
      const yearData = yearly[year] || {};
      const yearTotal = issues.filter((i) =>
        i.createdAt.startsWith(year),
      ).length;

      const months = Array.from({ length: 12 }, (_, i) => `${i + 1}월`);

      const series = uniqueLines.map((line, idx) => ({
        name: line,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3 },
        itemStyle: { color: COLOR_PALETTE[idx % COLOR_PALETTE.length] },
        emphasis: { lineStyle: { width: 6 } },
        label: {
          show: true,
          position: "top",
          fontSize: 10,
          fontWeight: 600,
          color: "#222",
          formatter: (p) => (p.data > 0 ? p.data : ""),
        },
        data: months.map((_, i) => {
          const m = i + 1;
          return yearData[m] ? yearData[m][line] || 0 : 0;
        }),
      }));

      const block = document.createElement("div");
      block.style.flex = "1 1 720px";
      block.style.minWidth = "720px";
      block.style.maxWidth = "calc(50% - 12px)"; // ← 강제 반반 제한
      block.style.background = "var(--lighter-bg)";
      block.style.border = "1px solid var(--border)";
      block.style.borderRadius = "var(--radius)";
      block.style.boxShadow = "var(--shadow)";
      block.style.padding = "18px 20px 26px";
      block.style.boxSizing = "border-box";

      block.innerHTML = `
      <div style="text-align:center; font-size:1rem; font-weight:700; margin-bottom:16px; color:var(--light-color);">
        ${year}년 월간 발생 횟수
        <span style="margin-left:10px; background:var(--primary-dim); color:var(--primary-color); font-size:0.82rem; padding:3px 11px; border-radius:999px;">
          총 ${yearTotal}건
        </span>
      </div>
      <div id="year-chart-${year}" style="height: 410px; width: 100%;"></div>
    `;

      container.appendChild(block);

      // ECharts 초기화 + 너비 강제 보정
      const chartDom = document.getElementById(`year-chart-${year}`);
      const chart = echarts.init(chartDom);

      chart.setOption({
        tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
        legend: {
          left: "center",
          bottom: 12,
          itemWidth: 20,
          itemHeight: 4,
          textStyle: { fontSize: 12.5 },
        },
        grid: { left: "3%", right: "4%", bottom: "24%", containLabel: true },
        xAxis: {
          type: "category",
          data: months,
          axisLabel: { fontSize: 12.5, interval: 0 },
        },
        yAxis: {
          type: "value",
          name: "발생 건수",
          minInterval: 1,
          axisLabel: { fontSize: 12 },
        },
        series: series,
      });

      // ← 핵심 해결: DOM 렌더링 후 resize 강제 호출
      setTimeout(() => {
        chart.resize();
      }, 30);

      // 클릭 모달 (기존 DOM8 재활용)
      chart.on("click", (params) => {
        if (params.componentType === "series") {
          const monthNum = parseInt(params.name);
          const periodKey = `${year}-${String(monthNum).padStart(2, "0")}`;
          showPeriodDetailModal(periodKey, true, "전체");
        }
      });
    });

    if (years.length === 0) {
      container.innerHTML = `<div class="empty-msg">데이터가 없습니다.</div>`;
    }
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
    renderYearlyLineCharts();
    forceFixedPanelWidth();

    // 창 크기 변경 시 모든 그래프 자동 리사이즈
    window.addEventListener("resize", () => {
      document
        .querySelectorAll("#yearly-charts-container .echarts")
        .forEach((el) => {
          if (el.__echarts_instance__) el.__echarts_instance__.resize();
        });
    });
  }

  /* ══════════════════════════════════════════════
   ⑦ 데이터 초기 로드 (API)
══════════════════════════════════════════════ */
  // TESTTEST 데이터 TESTTEST
  // async function loadAllData() {
  //   const activePanels = Object.keys(PANEL_CONFIG).filter(
  //     (id) => PANEL_CONFIG[id].enabled !== false,
  //   );

  //   activePanels.forEach((id) => setLoading(id, true));
  //   try {
  //     issues = await apiGetIssues();
  //     nextIssueId = Math.max(...issues.map((i) => i.id), 0) + 1;
  //     nextSubId =
  //       Math.max(
  //         ...issues.flatMap((i) =>
  //           [...i.checklist, ...i.todos].map((x) => x.id),
  //         ),
  //         999,
  //       ) + 1;
  //     renderAll();
  //   } catch (e) {
  //     showToast("데이터 로드 실패: " + e.message, "error");
  //   } finally {
  //     activePanels.forEach((id) => setLoading(id, false));
  //   }
  // }
  // TESTTEST 데이터 TESTTEST

  /* ══════════════════════════════════════════════
   ⑦ 데이터 초기 로드 (대시보드 API - 안전 버전)
══════════════════════════════════════════════ */
  async function loadAllData() {
    const activePanels = Object.keys(PANEL_CONFIG).filter(
      (id) => PANEL_CONFIG[id].enabled !== false,
    );

    activePanels.forEach((id) => setLoading(id, true));

    try {
      console.log("📡 대시보드 API 호출 중...");

      const dashboard = await apiGetDashboard();

      // 🔥 안전 처리 추가
      if (!dashboard || typeof dashboard !== "object") {
        throw new Error(
          "대시보드 API가 null 또는 잘못된 데이터를 반환했습니다.",
        );
      }

      if (!Array.isArray(dashboard.issues)) {
        throw new Error("issues 배열이 없습니다. 백엔드 응답을 확인하세요.");
      }

      // 성공 시 데이터 적용
      issues = dashboard.issues;

      nextIssueId = Math.max(...issues.map((i) => i.id || 0), 0) + 1;
      nextSubId =
        Math.max(
          ...issues.flatMap((i) => [
            ...(i.checklist || []).map((c) => c.id || 0),
            ...(i.todos || []).map((t) => t.id || 0),
          ]),
          999,
        ) + 1;

      console.log(`✅ 대시보드 로드 성공 | 총 ${issues.length}개 이슈`);

      renderAll();
    } catch (e) {
      console.error("❌ 대시보드 로드 실패:", e);

      showToast(
        "서버에서 데이터를 불러오지 못했습니다. 샘플 데이터를 사용합니다.",
        "error",
      );

      // 🔥 백엔드 실패 시 임시로 샘플 데이터 사용 (개발 중 매우 편리)
      issues = generateSampleIssues(); // 아래에 함수 추가 예정

      renderAll();
    } finally {
      activePanels.forEach((id) => setLoading(id, false));
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
      <div class="custom-checkbox ${c.checked ? "checked" : ""}" onclick="EnvSafety.toggleFormCheck(${idx})"></div>
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
      <button class="btn-icon danger" onclick="EnvSafety.removeFormTodo(${idx})">${ICONS.del}</button>
    </div>`,
      )
      .join("");
  }

  function toggleFormCheck(i) {
    formChecks[i].checked = !formChecks[i].checked;
    renderFormChecklist();
  }

  function removeFormCheck(i) {
    formChecks.splice(i, 1);
    renderFormChecklist();
  }

  function removeFormTodo(i) {
    formTodos.splice(i, 1);
    renderFormTodos();
  }

  // saveIssue 함수
  async function saveIssue() {
    const title = document.getElementById("issue-title").value.trim();
    if (!title) {
      showToast("제목을 입력해주세요.", "error");
      setActiveTab("info");
      return;
    }

    // To-Do 날짜 유효성 검증
    for (const todo of formTodos) {
      const validation = validateDateRange(todo.due);
      if (!validation.valid) {
        showToast(validation.message, "error");
        setActiveTab("todo");
        return;
      }
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

  async function handleDeleteIssue(id) {
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
  }

  /* ══════════════════════════════════════════════
   ⑨ 모달 B : 이슈 상세 보기
══════════════════════════════════════════════ */
  function openDetailModal(id) {
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
  }

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
      <div class="custom-checkbox ${c.checked ? "checked" : ""}" onclick="EnvSafety.handleToggleCheck(${c.id})"></div>
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
      <div class="custom-checkbox ${t.done ? "checked" : ""}" onclick="EnvSafety.handleToggleTodo(${t.id})"></div>
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
  async function handleToggleCheck(checkId) {
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
  }

  async function handleDeleteCheck(checkId) {
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
  }

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
  async function handleToggleTodo(todoId) {
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
  }

  async function handleDeleteTodo(todoId) {
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
  }

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

  // 날짜 검증 추가된 함수
  async function confirmDetailTodoAdd() {
    const text = document.getElementById("detail-todo-input").value.trim();
    if (!text) {
      showToast("할 일을 입력해주세요.", "error");
      return;
    }

    const dueDate = document.getElementById("detail-todo-due").value;
    const validation = validateDateRange(dueDate);
    if (!validation.valid) {
      showToast(validation.message, "error");
      return;
    }

    const payload = {
      id: ++nextSubId,
      text,
      done: false,
      assignee:
        document.getElementById("detail-todo-assignee").value.trim() || "-",
      due: dueDate || "-",
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

  /* ══════════════════════════════════════════════
   패널 설정 통합 관리
   ── 패널 추가/삭제/순서/크기를 여기서만 관리 ──
   
   설정 항목:
   - order: 배치 순서 (숫자가 작을수록 앞에 배치)
   - width: 초기 너비 (예: '500px', 'auto')
   - height: 초기 높이 (예: '450px', 'auto')
   - label: 패널 설명 (디버깅/문서화용)
   - enabled: true/false (false면 패널 숨김, 기본값 true)
══════════════════════════════════════════════ */
  const PANEL_CONFIG = {
    dom2: {
      order: 3,
      width: "490px",
      height: "490px",
      label: "이슈 목록",
      icon: `
      <!-- 목록 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="8" y1="6" x2="20" y2="6"/>
        <line x1="8" y1="12" x2="20" y2="12"/>
        <line x1="8" y1="18" x2="20" y2="18"/>
        <circle cx="4" cy="6" r="1.5"/>
        <circle cx="4" cy="12" r="1.5"/>
        <circle cx="4" cy="18" r="1.5"/>
      </svg>
    `,
      enabled: true,
    },

    dom8: {
      order: 5,
      width: "1500px",
      height: "auto",
      label: "작업 통계",
      icon: `
      <!-- 바 차트 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="4" y1="20" x2="20" y2="20"/>
        <rect x="6" y="10" width="3" height="8"/>
        <rect x="11" y="6" width="3" height="12"/>
        <rect x="16" y="13" width="3" height="5"/>
      </svg>
    `,
      enabled: true,
    },

    dom3: {
      order: 2,
      width: "490px",
      height: "490px",
      label: "체크리스트 현황",
      icon: `
      <!-- 체크 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="4 12 9 17 20 6"/>
      </svg>
    `,
      enabled: true,
    },

    dom4: {
      order: 1,
      width: "490px",
      height: "490px",
      label: "To-Do 현황",
      icon: `
      <!-- 클립보드 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2">
        <rect x="5" y="4" width="14" height="16" rx="2"/>
        <line x1="9" y1="2" x2="15" y2="2"/>
        <line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
      </svg>
    `,
      enabled: true,
    },

    dom6: {
      order: 4,
      width: "490px",
      height: "490px",
      label: "활동 타임라인",
      icon: `
      <!-- 타임라인 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="12" y1="4" x2="12" y2="20"/>
        <circle cx="12" cy="7" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="12" cy="17" r="2"/>
      </svg>
    `,
      enabled: true,
    },

    dom5: {
      order: 99,
      width: "400px",
      height: "350px",
      label: "카테고리 통계",
      icon: `
      <!-- 파이 차트 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2 A10 10 0 0 1 22 12 L12 12 Z"/>
      </svg>
    `,
      enabled: false,
    },

    dom7: {
      order: 99,
      width: "400px",
      height: "300px",
      label: "위험도 요약",
      icon: `
      <!-- 경고 삼각형 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polygon points="12 2 22 20 2 20"/>
        <line x1="12" y1="8" x2="12" y2="14"/>
        <circle cx="12" cy="18" r="1"/>
      </svg>
    `,
      enabled: false,
    },

    dom9: {
      order: 7,
      width: "1500px",
      height: "620px",
      label: "이슈 테이블",
      icon: `
      <!-- 테이블 아이콘 -->
      <svg width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="4" width="18" height="16"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <line x1="9" y1="4" x2="9" y2="20"/>
        <line x1="15" y1="4" x2="15" y2="20"/>
      </svg>
    `,
      enabled: true,
    },

    dom10: {
      order: 6,
      width: "1500px",
      height: "620px",
      label: "연도별 발생 추이",
      icon: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M3 3v18h18"/>
          <path d="M3 12h4l3-9 3 18 3-9 3 6"/>
        </svg>
      `,
      enabled: true,
    },
  };

  /* ====================== enabled: false 패널 완전 숨김 ====================== */
  function hideDisabledPanels() {
    Object.keys(PANEL_CONFIG).forEach((id) => {
      const panel = document.getElementById(id);
      if (panel) {
        panel.style.display = PANEL_CONFIG[id].enabled !== false ? "" : "none";
      }
    });
  }

  // PANEL_CONFIG의 width/height를 "콘텐츠보다 작게 만들지 않도록" 안전하게 적용
  function forceFixedPanelWidth() {
    Object.keys(PANEL_CONFIG).forEach((id) => {
      const config = PANEL_CONFIG[id];
      if (!config.enabled) return;

      const panel = document.getElementById(id);
      if (!panel) return;

      // 1. 현재 콘텐츠의 자연 크기 측정 (스크롤 포함)
      const naturalWidth = panel.scrollWidth || 400;
      const naturalHeight = panel.scrollHeight || 300;

      // 2. width 처리
      if (config.width && config.width !== "auto") {
        const configW = parseInt(config.width);
        // config가 자연 크기보다 크면 config 적용, 작으면 자연 크기 유지
        const finalW = Math.max(configW, naturalWidth);
        panel.style.width = finalW + "px";
        panel.style.minWidth = finalW + "px";
        panel.style.maxWidth = finalW + "px";
        panel.style.flex = `0 0 ${finalW}px`;
      }

      // 3. height 처리
      if (config.height && config.height !== "auto") {
        const configH = parseInt(config.height);
        const finalH = Math.max(configH, naturalHeight);
        panel.style.height = finalH + "px";
        panel.style.minHeight = finalH + "px";
        panel.style.maxHeight = finalH + "px";
      }
    });
  }

  // ==================== 검색 가능한 패널 빠른 이동 ====================
  function initPanelJump() {
    const input = document.getElementById("panel-jump-input");
    const listEl = document.getElementById("panel-jump-list");
    if (!input || !listEl) return;

    let allPanels = [];

    function renderList(filtered) {
      listEl.innerHTML = "";
      filtered.forEach(([id, config]) => {
        const li = document.createElement("li");
        li.className = "panel-jump-item";
        li.innerHTML = `${config.icon || ""} ${config.label || id}`;
        li.onclick = () => {
          jumpToPanel(id);
          input.value = "";
          listEl.classList.remove("show");
        };
        listEl.appendChild(li);
      });
    }

    function filterAndSort(query) {
      if (!query) {
        renderList(allPanels);
        return;
      }
      const q = query.toLowerCase().trim();
      const filtered = allPanels.filter(([id, config]) => {
        return (
          (config.label || "").toLowerCase().includes(q) ||
          id.toLowerCase().includes(q)
        );
      });

      filtered.sort((a, b) => {
        const la = (a[1].label || a[0]).toLowerCase();
        const lb = (b[1].label || b[0]).toLowerCase();
        if (la === q) return -1;
        if (lb === q) return 1;
        if (la.startsWith(q)) return -1;
        if (lb.startsWith(q)) return 1;
        return la.indexOf(q) - lb.indexOf(q);
      });

      renderList(filtered);
    }

    function updateListPosition() {
      const rect = input.getBoundingClientRect();
      listEl.style.top = `${rect.bottom + 6}px`; // 입력창 바로 아래
      listEl.style.left = `${rect.left}px`;
      listEl.style.width = `${rect.width}px`;
    }

    function jumpToPanel(id) {
      const panel = document.getElementById(id);
      if (!panel) return;
      panel.scrollIntoView({ behavior: "smooth", block: "center" });

      panel.style.transition = "all 0.25s";
      panel.style.boxShadow = "0 0 0 6px rgba(47, 111, 237, 0.65)";
      panel.style.transform = "scale(1.035)";
      setTimeout(() => {
        panel.style.boxShadow = "";
        panel.style.transform = "";
      }, 1600);
    }

    // 패널 목록 생성
    allPanels = Object.entries(PANEL_CONFIG)
      .filter(([_, c]) => c.enabled !== false)
      .sort((a, b) => a[1].order - b[1].order);

    renderList(allPanels);

    // 입력 이벤트
    input.addEventListener("input", () => {
      filterAndSort(input.value);
      listEl.classList.add("show");
      updateListPosition();
    });

    input.addEventListener("focus", () => {
      filterAndSort(input.value);
      listEl.classList.add("show");
      updateListPosition();
    });

    // 창 크기 변경 or 스크롤 시 위치 재계산
    window.addEventListener("resize", updateListPosition);
    window.addEventListener("scroll", updateListPosition);

    // 바깥 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (!input.contains(e.target) && !listEl.contains(e.target)) {
        listEl.classList.remove("show");
      }
    });

    // 키보드
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && listEl.children.length > 0) {
        listEl.children[0].click();
        e.preventDefault();
      }
      if (e.key === "Escape") {
        listEl.classList.remove("show");
        input.blur();
      }
    });
  }

  // PANEL_CONFIG에서 활성화된 패널만 순서대로 추출
  // 역할: order 기준 정렬 + enabled=true인 패널만 반환
  function getDefaultLayout() {
    return Object.entries(PANEL_CONFIG)
      .filter(([id, config]) => config.enabled !== false)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([id]) => id);
  }

  let layout = [];
  let dragState = null;
  let cloneEl = null;
  let placeholderEl = null; // 드롭 위치를 표시하는 placeholder
  let lastPlaceholderPosition = null; // 마지막 placeholder 위치 (깜빡임 방지)
  let placeholderUpdateTimer = null; // throttle용 타이머

  // 저장된 레이아웃 불러오기
  // 역할: localStorage에서 사용자가 조정한 순서/크기 복원, 없으면 PANEL_CONFIG 기본값 사용
  function loadLayout() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

      // 새 형식 (객체 배열)
      if (
        Array.isArray(saved) &&
        saved.length > 0 &&
        typeof saved[0] === "object"
      ) {
        // 저장된 패널 중 현재 PANEL_CONFIG에 있고 enabled=true인 것만 필터링
        return saved.filter((item) => {
          const config = PANEL_CONFIG[item.id];
          return config && config.enabled !== false;
        });
      }

      // 구 형식 (문자열 배열) - 호환성 유지
      if (
        Array.isArray(saved) &&
        saved.length > 0 &&
        typeof saved[0] === "string"
      ) {
        return saved
          .filter((id) => {
            const config = PANEL_CONFIG[id];
            return config && config.enabled !== false;
          })
          .map((id) => ({ id, width: null, height: null }));
      }
    } catch {}

    // 기본값: PANEL_CONFIG에서 생성
    return getDefaultLayout().map((id) => ({
      id,
      width: null,
      height: null,
    }));
  }

  // DOM 실제 순서 기반으로 저장
  //  순서 + 크기 정보 저장
  function saveLayout() {
    try {
      const container = document.getElementById("panel-canvas");
      const panels = Array.from(container.querySelectorAll(".draggable-panel"));

      layout = panels.map((p) => ({
        id: p.id,
        width: p.style.width || null,
        height: p.style.height || null,
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch {}
  }
  // 레이아웃 순서 + 크기 복원
  // 역할: layout 배열 순서대로 패널 배치 + 저장된 커스텀 크기 적용
  function applyLayout() {
    const container = document.getElementById("panel-canvas");

    layout.forEach((item) => {
      const id = typeof item === "string" ? item : item.id;
      const el = document.getElementById(id);
      const config = PANEL_CONFIG[id];

      // 패널이 DOM에 있고 + PANEL_CONFIG에 정의되어 있고 + enabled=true인 경우만
      if (el && config && config.enabled !== false) {
        container.appendChild(el);

        // 저장된 크기 복원
        if (typeof item === "object" && item.width && item.height) {
          el.style.width = item.width;
          el.style.height = item.height;
          el.style.flex = "0 0 auto";
        }
      } else if (el) {
        // enabled=false인 패널은 숨김 처리
        el.style.display = "none";
      }
    });
  }
  /* ====================== 패널 초기화 공통 함수 ====================== */
  function initializePanels() {
    applyLayout(); // 순서 + 저장된 크기 복원
    hideDisabledPanels(); // enabled: false 패널 완전 숨김
    initPanelJump(); // 검색 가능한 입력창 버전
    initDragAndDrop();
    initResize();

    // config 설정에 맞춰 패널 사이즈 조절(원본 값보다 크게만 설정 가능)
    forceFixedPanelWidth();
    // (항상 PANEL_CONFIG 순서 강제 적용)
    forceSortByPanelConfigOrder();

    // 크기/제목 처리
    const hasCustomSizes = layout.some(
      (item) => typeof item === "object" && item.width && item.height,
    );
    if (localStorage.getItem(STORAGE_KEY) === null) {
      setInitialPanelSizes();
    }
    if (!hasCustomSizes) {
      console.log("localStorage에 크기 정보 없음 → PANEL_CONFIG 적용");
      setInitialPanelSizes();
    } else {
      console.log("localStorage에서 크기 복원 → 제목만 업데이트");
      updatePanelTitles();
    }
  }

  // (항상 PANEL_CONFIG 순서 강제 적용)
  function forceSortByPanelConfigOrder() {
    const container = document.getElementById("panel-canvas");
    const sortedIds = Object.entries(PANEL_CONFIG)
      .filter(([_, c]) => c.enabled !== false)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([id]) => id);

    sortedIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) container.appendChild(el);
    });
  }

  /* 드래그 시작 - 클론만 내부 콘텐츠 삭제 + drag-handle, block-header 스타일 완전 유지 */
  function onDragStart(e, panelEl) {
    if (e.button !== 0) return;
    e.preventDefault();

    const rect = panelEl.getBoundingClientRect();

    dragState = {
      panelId: panelEl.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };

    // 원본 패널 완전히 숨기기 + DOM 흐름에서 제거
    panelEl.style.display = "none";
    panelEl.classList.add("is-dragging");

    // 클론 생성 - 빈 패널로 만들기
    cloneEl = document.createElement("div");
    cloneEl.className = "drag-clone";

    // 스타일 - 빈 하얀 패널
    cloneEl.style.position = "fixed";
    cloneEl.style.width = rect.width + "px";
    cloneEl.style.height = rect.height + "px";
    cloneEl.style.left = rect.left + "px";
    cloneEl.style.top = rect.top + "px";
    cloneEl.style.pointerEvents = "none";
    cloneEl.style.zIndex = "10000";
    cloneEl.style.background = "#ffffff";
    cloneEl.style.border = "2px solid var(--primary-color)";
    cloneEl.style.borderRadius = "var(--radius)";
    cloneEl.style.opacity = "0.8";
    cloneEl.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.2)";

    document.body.appendChild(cloneEl);

    // Placeholder 생성 - 드롭될 위치를 미리 보여줌
    // 역할: 원본 패널 크기만큼 빈 공간을 만들어 다른 패널들이 자리를 비켜주게 함
    const container = document.getElementById("panel-canvas");
    placeholderEl = document.createElement("div");
    placeholderEl.className = "drag-placeholder";
    placeholderEl.style.cssText = `
      width: ${rect.width}px;
      height: ${rect.height}px;
      background: rgba(47, 111, 237, 0.12);
      border: 2px dashed var(--primary-color);
      border-radius: var(--radius);
      pointer-events: none;
      box-sizing: border-box;
      flex: 0 0 auto;
    `;

    // 원본이 있던 위치에 placeholder 삽입
    container.insertBefore(placeholderEl, panelEl.nextSibling);

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
  }

  /* 드롭 위치 시각적 표시 */
  // 역할: 마우스 이동 시 clone 위치 업데이트 + placeholder를 실시간으로 이동시켜 드롭 위치 표시
  function onDragMove(e) {
    if (!dragState || !cloneEl) return;

    // 1. 클론 위치는 즉시 업데이트 (부드러운 움직임)
    const x = e.clientX - dragState.offsetX;
    const y = e.clientY - dragState.offsetY;

    cloneEl.style.left = x + "px";
    cloneEl.style.top = y + "px";

    // 2. Placeholder 업데이트는 throttle 적용 (깜빡임 방지)
    if (!placeholderEl) return;

    // 이전 타이머 취소
    if (placeholderUpdateTimer) {
      return; // 이미 예약된 업데이트가 있으면 스킵
    }

    // 50ms마다 한 번씩만 placeholder 위치 업데이트
    placeholderUpdateTimer = setTimeout(() => {
      updatePlaceholderPosition(e.clientX, e.clientY);
      placeholderUpdateTimer = null;
    }, 50);
  }

  // Placeholder 위치 업데이트 (분리된 함수)
  // 역할: 깜빡임을 줄이기 위해 위치가 실제로 변경될 때만 DOM 조작
  function updatePlaceholderPosition(mouseX, mouseY) {
    if (!placeholderEl) return;

    const container = document.getElementById("panel-canvas");
    const afterElement = getDragAfterElement(container, mouseX, mouseY);

    // 새로운 위치 식별자 생성
    const newPosition = afterElement ? afterElement.id : "end";

    // 위치가 실제로 변경되었을 때만 DOM 조작 (깜빡임 방지)
    if (newPosition === lastPlaceholderPosition) {
      return;
    }

    lastPlaceholderPosition = newPosition;

    // Placeholder를 적절한 위치로 이동
    if (afterElement === null) {
      // 맨 뒤에 배치
      container.appendChild(placeholderEl);
    } else if (afterElement !== placeholderEl) {
      // afterElement 앞에 배치
      container.insertBefore(placeholderEl, afterElement);
    }
  }

  function onDragEnd(e) {
    if (!dragState) return;

    try {
      const panelEl = document.getElementById(dragState.panelId);
      const container = document.getElementById("panel-canvas");

      if (panelEl && placeholderEl) {
        // Placeholder 위치에 원본 패널 복원
        // 역할: 드롭 시 placeholder가 있던 자리에 원본 패널을 정확히 배치
        container.insertBefore(panelEl, placeholderEl);

        // 원본 패널 스타일 복원
        panelEl.style.display = "";
        panelEl.classList.remove("is-dragging");

        // Placeholder 제거
        placeholderEl.remove();
        placeholderEl = null;
      }

      saveLayout();

      if (cloneEl) {
        cloneEl.remove();
        cloneEl = null;
      }

      // 타이머 정리
      if (placeholderUpdateTimer) {
        clearTimeout(placeholderUpdateTimer);
        placeholderUpdateTimer = null;
      }

      // 위치 캐시 초기화
      lastPlaceholderPosition = null;
    } finally {
      cleanupDragListeners();
      dragState = null;
    }
  }

  function cleanupDragListeners() {
    document.removeEventListener("mousemove", onDragMove);
    document.removeEventListener("mouseup", onDragEnd);
  }

  // 가장 가까운 삽입 위치 계산 (개선 버전)
  // 역할: 마우스와 가장 가까운 패널의 가장자리를 찾아 그 앞 또는 뒤에 삽입할 위치 반환
  function getDragAfterElement(container, mouseX, mouseY) {
    const elements = Array.from(
      container.querySelectorAll(".draggable-panel"),
    ).filter(
      (el) => !el.classList.contains("is-dragging") && el !== placeholderEl,
    );

    if (elements.length === 0) return null;

    let bestInsertInfo = null;
    let minDistance = Infinity;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      // 패널의 중심점
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 마우스가 패널 중심 기준 좌측인지 우측인지
      const isLeft = mouseX < centerX;

      // 삽입 경계선 정의 (좌측 경계 또는 우측 경계)
      const boundaryX = isLeft ? rect.left : rect.right;
      const boundaryY = centerY;

      // 경계선까지의 거리 계산
      const distance = Math.sqrt(
        Math.pow(mouseX - boundaryX, 2) + Math.pow(mouseY - boundaryY, 2),
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestInsertInfo = {
          element: element,
          insertBefore: isLeft, // 좌측이면 element 앞에, 우측이면 뒤에
        };
      }
    });

    if (!bestInsertInfo) return null;

    // insertBefore가 false면 다음 요소를 반환 (그 앞에 삽입하는 효과)
    if (bestInsertInfo.insertBefore) {
      return bestInsertInfo.element;
    } else {
      // element 다음 요소 찾기
      const nextSibling = bestInsertInfo.element.nextElementSibling;
      // placeholder가 nextSibling이면 그 다음 요소
      if (nextSibling === placeholderEl) {
        return nextSibling.nextElementSibling;
      }
      return nextSibling;
    }
  }

  /* 패널 이벤트 cleanup (메모리 누수 방지) */
  function cleanupPanelEvents() {
    document.querySelectorAll(".draggable-panel").forEach((panel) => {
      const handle = panel.querySelector(".drag-handle");
      if (handle && handle._dragHandler) {
        handle.removeEventListener("mousedown", handle._dragHandler);
        delete handle._dragHandler;
      }

      const resizeHandle = panel.querySelector(".resize-handle");
      if (resizeHandle && resizeHandle._resizeHandler) {
        resizeHandle.removeEventListener(
          "mousedown",
          resizeHandle._resizeHandler,
        );
        delete resizeHandle._resizeHandler;
      }
    });
  }

  // 핸들러 저장 및 cleanup 추가
  function initDragAndDrop() {
    // 기존 이벤트 cleanup
    cleanupPanelEvents();

    document
      .querySelectorAll(".env-safety-page .draggable-panel")
      .forEach((panel) => {
        const handle = panel.querySelector(".drag-handle");
        if (!handle) return;

        // 핸들러를 저장해서 나중에 제거 가능하도록
        const handler = (e) => onDragStart(e, panel);
        handle._dragHandler = handler;
        handle.addEventListener("mousedown", handler);
      });
  }

  // 핸들러 저장 및 재사용 로직 추가

  // 독립적인 width/height 조절 + 최소/최대 크기 제한
  function initResize() {
    document.querySelectorAll(".draggable-panel").forEach((panel) => {
      let resizeHandle = panel.querySelector(".resize-handle");

      if (!resizeHandle) {
        resizeHandle = document.createElement("div");
        resizeHandle.classList.add("resize-handle");
        panel.appendChild(resizeHandle);
      }

      let isResizing = false;
      let startX, startY, startWidth, startHeight;

      const handleMouseDown = (e) => {
        e.stopPropagation();
        isResizing = true;

        startX = e.clientX;
        startY = e.clientY;
        startWidth = panel.offsetWidth;
        startHeight = panel.offsetHeight;

        document.addEventListener("mousemove", resizeMove);
        document.addEventListener("mouseup", stopResize);
      };

      // resizeMove 함수 - 창 크기와 무관하게 패널 크기 자유 조절
      // 역할: maxWidth 계산을 제거해서 창이 작아도 패널이 최소너비 이상으로 자유롭게 늘어나고 줄어들게 함
      function resizeMove(e) {
        if (!isResizing) return;

        // 새로운 크기 계산
        let newWidth = startWidth + (e.clientX - startX);
        let newHeight = startHeight + (e.clientY - startY);

        // 최소/최대 크기 제한 (maxWidth 완전 제거)
        const minWidth = 300;
        const minHeight = 200;
        const maxHeight = 800;

        newWidth = Math.max(minWidth, newWidth); // 최대 너비 제한 없음
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

        // 독립적으로 크기 설정
        panel.style.width = newWidth + "px";
        panel.style.height = newHeight + "px";
        panel.style.flex = "0 0 auto";
      }

      function stopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", resizeMove);
        document.removeEventListener("mouseup", stopResize);

        // 크기 조절 완료 후 레이아웃 저장
        saveLayout();
      }

      resizeHandle._resizeHandler = handleMouseDown;
      resizeHandle.addEventListener("mousedown", handleMouseDown);
    });
  }

  // PANEL_CONFIG 기반 초기 크기 설정
  // 역할: 각 패널의 width, height, title을 PANEL_CONFIG에서 읽어와 적용
  function setInitialPanelSizes() {
    document.querySelectorAll(".draggable-panel").forEach((panel) => {
      const config = PANEL_CONFIG[panel.id];

      if (!config) {
        console.warn(`패널 ${panel.id}가 PANEL_CONFIG에 정의되지 않았습니다.`);
        return;
      }

      // 1. 패널 제목 설정 (PANEL_CONFIG의 label 사용)
      // 역할: PANEL_CONFIG 기준으로 제목과 아이콘을 렌더링
      const titleEl = panel.querySelector(".title-text");

      if (titleEl) {
        titleEl.innerHTML = `
    ${config.icon || ""}
    <span class="title-label">${config.label || ""}</span>
  `;
      }

      // 2. 기본 스타일
      panel.style.minWidth = "300px";
      panel.style.maxWidth = "none";
      panel.style.flex = "0 0 auto";

      // 3. PANEL_CONFIG에서 크기 적용
      if (config.width === "auto") {
        panel.style.width = "450px"; // auto일 경우 기본값
      } else {
        panel.style.width = config.width;
      }

      if (config.height === "auto") {
        // 콘텐츠 기반 자동 높이
        panel.style.height = "auto";
        const headerHeight = 70;
        const contentHeight = panel.scrollHeight;
        let newHeight = Math.max(280, contentHeight + headerHeight + 20);
        newHeight = Math.min(newHeight, 800);
        panel.style.height = newHeight + "px";
      } else {
        panel.style.height = config.height;
      }
    });
  }

  // 패널 제목만 업데이트 (크기는 건드리지 않음)
  // 역할: 각 패널 내부의 제목 텍스트를 PANEL_CONFIG.label로 갱신
  function updatePanelTitles() {
    document.querySelectorAll(".draggable-panel").forEach((panel) => {
      const config = PANEL_CONFIG[panel.id];
      if (!config) return;

      // 역할: PANEL_CONFIG 기준으로 제목과 아이콘을 렌더링
      const titleEl = panel.querySelector(".title-text");

      if (titleEl) {
        titleEl.innerHTML = `
    ${config.icon || ""}
    <span class="title-label">${config.label || ""}</span>
  `;
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
      const category =
        document.getElementById("form-check-cat").value ||
        document.getElementById("issue-category").value; // ← 이 부분 추가
      formChecks.push({
        id: ++nextSubId,
        text,
        category,
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

      const dueDate = document.getElementById("form-todo-due").value;
      const validation = validateDateRange(dueDate);
      if (!validation.valid) {
        showToast(validation.message, "error");
        return;
      }

      formTodos.push({
        id: ++nextSubId,
        text,
        done: false,
        assignee:
          document.getElementById("form-todo-assignee").value.trim() || "-",
        due: dueDate || "-",
        priority: document.getElementById("form-todo-priority").value,
      });
      document.getElementById("form-todo-input").value = "";
      document.getElementById("form-todo-assignee").value = "";
      document.getElementById("form-todo-due").value = "";
      renderFormTodos();
    };

    document.getElementById("form-todo-input").onkeydown = (e) => {
      if (e.key === "Enter")
        document.getElementById("btn-form-add-todo").click();
    };

    /* 모달 B */
    document.getElementById("btn-close-detail-modal").onclick =
      closeDetailModal;
    document.getElementById("btn-close-detail-bottom").onclick =
      closeDetailModal;
    document.getElementById("btn-detail-edit").onclick = () => {
      const id = currentDetailIssueId;
      closeDetailModal();
      openFormModal(id);
    };

    /* 체크리스트 인라인 (상세 모달) */
    document.getElementById("btn-detail-add-check").onclick =
      showDetailCheckAdd;
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
    document.getElementById("btn-detail-todo-cancel").onclick =
      hideDetailTodoAdd;
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
  // 레이아웃 초기화
  // 레이아웃 초기화 - 완전 리셋 버전 (위치 + 크기 모두 초기화)
  function resetLayout() {
    // if (
    //   !confirm(
    //     "레이아웃을 완전히 초기 상태로 되돌리시겠습니까?\n(위치, 크기, 순서 모두 PANEL_CONFIG 기준으로 리셋됩니다)",
    //   )
    // ) {
    //   return;
    // }

    // 1. localStorage 완전 삭제
    localStorage.removeItem(STORAGE_KEY);

    // 2. 모든 패널의 inline 스타일 완전 제거 (가장 중요!)
    document.querySelectorAll(".draggable-panel").forEach((panel) => {
      panel.style.width = "";
      panel.style.height = "";
      panel.style.minWidth = "";
      panel.style.maxWidth = "";
      panel.style.minHeight = "";
      panel.style.maxHeight = "";
      panel.style.flex = "";
      panel.style.order = ""; // 순서도 초기화
    });

    // 3. layout을 PANEL_CONFIG 기본값으로 강제 설정
    layout = getDefaultLayout().map((id) => ({
      id: id,
      width: null,
      height: null,
    }));

    // 4. 저장
    saveLayout();

    // 5. 완전 초기화 실행
    initializePanels();

    // 6. 데이터 다시 렌더링
    renderAll();

    showToast(
      "레이아웃이 완전히 초기화되었습니다. (위치·크기 모두 리셋)",
      "success",
    );
  }

  //  초기 크기 설정 추가
  document.addEventListener("DOMContentLoaded", async () => {
    bindEvents();

    layout = loadLayout(); // 먼저 layout 불러오기

    initializePanels(); // ← 모든 초기화 한 번에

    await loadAllData();

    setTimeout(renderCategoryStats, 150);
  });

  // Public API (window에 노출)
  window.EnvSafety = {
    openFormModal,
    openDetailModal,
    handleDeleteIssue,
    toggleFormCheck,
    removeFormCheck,
    removeFormTodo,
    handleToggleCheck,
    handleDeleteCheck,
    handleToggleTodo,
    handleDeleteTodo,
    // 동적 패널 추가/제거 시 호출
    refreshPanelEvents: () => {
      cleanupPanelEvents();
      setInitialPanelSizes();
      initDragAndDrop();
      initResize();
    },
  };
})();
