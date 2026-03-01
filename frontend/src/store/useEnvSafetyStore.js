import { create } from "zustand";

// 기존 SAMPLE_ISSUES 그대로 가져옴
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
      {
        id: 131,
        text: "소음 측정 기록 보관",
        category: "소음",
        checked: true,
      },
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

export const useEnvSafetyStore = create((set, get) => ({
  issues: [],
  layout: [],
  isLoading: false,

  // 데이터 로드
  loadAllData: async () => {
    set({ isLoading: true });
    // 실제 API 연동 시 /api/issues 호출로 변경 가능
    await new Promise((r) => setTimeout(r, 600)); // 로딩 효과
    set({ issues: JSON.parse(JSON.stringify(SAMPLE_ISSUES)) });
    set({ isLoading: false });
  },

  // 레이아웃 관련
  setLayout: (newLayout) => set({ layout: newLayout }),
  saveLayout: () => {
    const { layout } = get();
    localStorage.setItem("env_safety_panel_layout_v1", JSON.stringify(layout));
  },
  loadLayout: () => {
    const saved = localStorage.getItem("env_safety_panel_layout_v1");
    if (saved) {
      set({ layout: JSON.parse(saved) });
    } else {
      // 기본 layout (PANEL_CONFIG 순서)
      const defaultLayout = [
        { id: "dom2", x: 0, y: 0, w: 6, h: 8 },
        { id: "dom8", x: 6, y: 0, w: 6, h: 6 },
        { id: "dom9", x: 12, y: 0, w: 6, h: 8 },
        { id: "dom3", x: 0, y: 8, w: 4, h: 6 },
        { id: "dom4", x: 4, y: 8, w: 4, h: 6 },
        { id: "dom6", x: 8, y: 8, w: 4, h: 6 },
        { id: "dom5", x: 12, y: 8, w: 4, h: 5 },
        { id: "dom7", x: 16, y: 8, w: 4, h: 5 },
      ];
      set({ layout: defaultLayout });
    }
  },

  // 이슈 관련 액션들 (추후 확장)
  addIssue: (newIssue) =>
    set((state) => ({ issues: [...state.issues, newIssue] })),
  updateIssue: (id, updated) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, ...updated } : i)),
    })),
  deleteIssue: (id) =>
    set((state) => ({
      issues: state.issues.filter((i) => i.id !== id),
    })),
}));

// PANEL_CONFIG (React용)
export const PANEL_CONFIG = {
  dom2: { title: "이슈 목록", icon: "📋", component: "IssueListPanel" },
  dom3: { title: "체크리스트 현황", icon: "✅", component: "ChecklistPanel" },
  dom4: { title: "To-Do 현황", icon: "📝", component: "TodoPanel" },
  dom5: { title: "카테고리별 현황", icon: "📊", component: "CategoryPanel" },
  dom6: { title: "최근 활동", icon: "🕒", component: "TimelinePanel" },
  dom7: { title: "위험도 요약", icon: "⚠️", component: "RiskPanel" },
  dom8: { title: "위험도 차트", icon: "📈", component: "EchartPanel" },
  dom9: { title: "전체 이슈 테이블", icon: "📋", component: "TablePanel" },
};
