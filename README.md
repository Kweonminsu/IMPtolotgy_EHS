# 환경안전 운영 현황판

**산업현장 안전 이슈 관리 + 체크리스트 + To-Do + 실시간 대시보드**

드래그 앤 드롭으로 자유롭게 패널 배치가 가능한 실시간 환경안전 운영 현황판입니다.

---

## 주요 기능

- **드래그 & 드롭**으로 패널 자유 배치 및 크기 조절
- **레이아웃 저장** (localStorage 자동 저장)
- **실시간 통계** (전체 이슈, 미결, 완료, 체크리스트 진행률)
- **이슈 등록/수정/삭제** (모달 기반)
- **체크리스트 & To-Do** 인라인 관리
- **다양한 시각화 패널**
  - 이슈 목록
  - 체크리스트 롤업
  - To-Do 롤업
  - 카테고리별 통계
  - 활동 타임라인
  - 위험도 요약
  - 작업 통계 (ECharts)
  - 이슈 테이블
  - **연도별 발생 추이** (2025년, 2026년 라인 그래프)

---

## 패널 목록 (현재 구현된 DOM)

| DOM   | 패널명           | 주요 내용                            | 상태     |
| ----- | ---------------- | ------------------------------------ | -------- |
| DOM1  | 페이지 헤더      | 타이틀, 통계 칩, 이슈 등록 버튼      | 완료     |
| DOM2  | 이슈 목록        | 카드 형태 리스트 + 필터              | 완료     |
| DOM3  | 체크리스트 현황  | 전체 진행률 + 롤업                   | 완료     |
| DOM4  | To-Do 현황       | 전체 To-Do 롤업                      | 완료     |
| DOM5  | 카테고리 통계    | 바 차트                              | 비활성화 |
| DOM6  | 활동 타임라인    | 최근 활동                            | 완료     |
| DOM7  | 위험도 요약      | 위험도별 카운트                      | 비활성화 |
| DOM8  | 작업 통계        | 월간/주간 바 + 라인 차트             | 완료     |
| DOM9  | 이슈 테이블      | 전체 테이블                          | 완료     |
| DOM10 | 연도별 발생 추이 | 2025년·2026년 생산라인별 라인 그래프 | 완료     |

---

## 기술 스택

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **차트**: ECharts 5
- **레이아웃**: Flex + Drag & Drop + Resize (커스텀 구현)
- **상태 관리**: 전역 `issues` 배열 (Single Source of Truth)
- **저장소**: localStorage (레이아웃 저장)
- **예정**: FastAPI 백엔드 연동

---

## 현재 구현 상태

- **샘플 데이터** 기반으로 모든 기능 정상 동작
- **모의 API** (`apiGetIssues`, `apiCreateIssue` 등) 구현 완료
- **실제 API 연동 준비** 완료 (`apiRequest` 함수에 실제 fetch 코드 주석 처리됨)
- 드래그/리사이즈/레이아웃 저장/복원 완벽 동작
- 모달, 토스트, 로딩 스피너 등 UX 완성

---

## 향후 FastAPI 연동 계획

### 추천 API 엔드포인트

```http
GET    /api/issues                  # 전체 이슈 (필터 지원)
GET    /api/issues/{id}
POST   /api/issues
PUT    /api/issues/{id}
DELETE /api/issues/{id}

POST   /api/issues/{id}/checklist
PATCH  /api/issues/{id}/checklist/{check_id}
DELETE /api/issues/{id}/checklist/{check_id}

POST   /api/issues/{id}/todos
PATCH  /api/issues/{id}/todos/{todo_id}
DELETE /api/issues/{id}/todos/{todo_id}

# 성능 최적화용 집계 API (추천)
GET    /api/stats/dashboard
GET    /api/stats/yearly            # DOM10용
```
