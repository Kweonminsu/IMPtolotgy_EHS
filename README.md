```markdown
# 환경안전 운영 시스템 - API 설계 가이드

**백엔드 엔지니어를 위한 완전 구현 가이드**  
**README.md** (바로 복사해서 사용하세요)

---

## 📋 목차
- [전체 구조](#전체-구조)
- [API 엔드포인트](#api-엔드포인트)
- [데이터 모델](#데이터-모델)
- [FastAPI 구현 예시](#fastapi-구현-예시)
- [프론트엔드 연동](#프론트엔드-연동)
- [테스트 방법](#테스트-방법)
- [에러 처리](#에러-처리)
- [배포 체크리스트](#배포-체크리스트)
- [참고 사항](#참고-사항)

---

## 전체 구조

**프론트엔드 데이터 흐름**
```
사용자 액션 → JS 함수 → apiRequest() → 서버 API → DB
                                    ↓
                           응답 수신 → issues 배열 업데이트 → renderAll()
```

**핵심 데이터 구조**
```javascript
{
  id, title, category, severity, status, location,
  assignee, reporter, desc, createdAt,
  checklist: [{id, text, category, checked}],
  todos: [{id, text, assignee, due, priority, done}]
}
```

---

## API 엔드포인트

### 1. 대시보드 조회 (모든 데이터 한 번에)
```http
GET /api/dashboard
```
응답: `{ "issues": [ ... ] }` (전체 이슈 + checklist + todos 포함)

### 2. 이슈 CRUD
- **생성** `POST /api/issues`
- **수정** `PUT /api/issues/{issue_id}`
- **삭제** `DELETE /api/issues/{issue_id}` → `204 No Content`

### 3. 체크리스트
- **추가** `POST /api/issues/{issue_id}/checklist`
- **토글** `PATCH /api/issues/{issue_id}/checklist/{check_id}`
- **삭제** `DELETE /api/issues/{issue_id}/checklist/{check_id}`

### 4. To-Do
- **추가** `POST /api/issues/{issue_id}/todos`
- **토글** `PATCH /api/issues/{issue_id}/todos/{todo_id}`
- **삭제** `DELETE /api/issues/{issue_id}/todos/{todo_id}`

---

## 데이터 모델 (PostgreSQL)

```sql
CREATE TABLE issues (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    location VARCHAR(100),
    assignee VARCHAR(100),
    reporter VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE checklists (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    category VARCHAR(50),
    checked BOOLEAN DEFAULT FALSE
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES issues(id) ON DELETE CASCADE,
    text VARCHAR(500) NOT NULL,
    assignee VARCHAR(100),
    due_date DATE,
    priority VARCHAR(20),
    done BOOLEAN DEFAULT FALSE
);
```

---

## FastAPI 구현 예시 (main.py)

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import asyncpg

app = FastAPI()

class ChecklistItem(BaseModel):
    id: Optional[int] = None
    text: str
    category: str
    checked: bool = False

class TodoItem(BaseModel):
    id: Optional[int] = None
    text: str
    assignee: str
    due: str
    priority: str
    done: bool = False

class Issue(BaseModel):
    id: Optional[int] = None
    title: str
    category: str
    severity: str
    status: str
    location: str
    assignee: str
    reporter: str
    desc: str
    createdAt: Optional[str] = None
    checklist: List[ChecklistItem] = []
    todos: List[TodoItem] = []

async def get_db():
    return await asyncpg.connect(user='user', password='password',
                                 database='env_safety', host='localhost')

# 대시보드 조회
@app.get("/api/dashboard")
async def get_dashboard():
    conn = await get_db()
    try:
        issues = await conn.fetch("SELECT id, title, category, severity, status, location, assignee, reporter, description as desc, to_char(created_at, 'YYYY-MM-DD HH24:MI') as createdAt FROM issues ORDER BY created_at DESC")
        result = []
        for issue in issues:
            issue_dict = dict(issue)
            issue_dict['checklist'] = [dict(c) for c in await conn.fetch("SELECT id, text, category, checked FROM checklists WHERE issue_id = $1", issue['id'])]
            issue_dict['todos'] = [dict(t) for t in await conn.fetch("SELECT id, text, assignee, to_char(due_date, 'YYYY-MM-DD') as due, priority, done FROM todos WHERE issue_id = $1", issue['id'])]
            result.append(issue_dict)
        return {"issues": result}
    finally:
        await conn.close()

# 이슈 생성
@app.post("/api/issues")
async def create_issue(issue: Issue):
    conn = await get_db()
    try:
        issue_id = await conn.fetchval("INSERT INTO issues (title, category, severity, status, location, assignee, reporter, description) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id", issue.title, issue.category, issue.severity, issue.status, issue.location, issue.assignee, issue.reporter, issue.desc)
        for c in issue.checklist:
            await conn.execute("INSERT INTO checklists (issue_id, text, category, checked) VALUES ($1,$2,$3,$4)", issue_id, c.text, c.category, c.checked)
        for t in issue.todos:
            await conn.execute("INSERT INTO todos (issue_id, text, assignee, due_date, priority, done) VALUES ($1,$2,$3,$4,$5,$6)", issue_id, t.text, t.assignee, t.due, t.priority, t.done)
        created_at = await conn.fetchval("SELECT to_char(created_at, 'YYYY-MM-DD HH24:MI') FROM issues WHERE id = $1", issue_id)
        return {"id": issue_id, "createdAt": created_at, **issue.dict()}
    finally:
        await conn.close()

# 나머지 엔드포인트 (수정, 삭제, 체크리스트/To-Do 추가·토글·삭제)는 위와 동일 패턴으로 구현
# 전체 코드는 필요 시 요청해주세요.
```

---

## 프론트엔드 연동 (env_safety.js)

**62번째 줄부터 수정:**
- 샘플 모드 코드 (77~80줄) 삭제
- 실제 `apiRequest` 함수 (64~76줄) 주석 해제

**각 함수 주석 해제:**
- `apiCreateIssue`, `apiUpdateIssue`, `apiDeleteIssue`
- `apiToggleCheck`, `apiDeleteCheck`, `apiAddCheck`
- `apiToggleTodo`, `apiDeleteTodo`, `apiAddTodo`

`BASE_URL`은 이미 `/api`로 설정되어 있습니다.

---

## 테스트 방법

```bash
# 서버 실행
uvicorn main:app --reload --port 8000

# 대시보드 조회
curl http://localhost:8000/api/dashboard

# 이슈 생성 테스트
curl -X POST http://localhost:8000/api/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트","category":"화재","severity":"보통","status":"미결","location":"A라인","assignee":"김철수","reporter":"홍길동","desc":"테스트","checklist":[],"todos":[]}'
```

---

## 에러 처리

| 코드 | 의미     | 처리 방법          |
|------|----------|--------------------|
| 200  | 성공     | 정상 처리          |
| 400  | 잘못된 요청 | 입력 검증          |
| 404  | 없음     | ID 확인            |
| 500  | 서버 에러 | 재시도 (최대 3회)  |

---

## 배포 체크리스트

- [ ] DB 마이그레이션 실행
- [ ] 환경변수 (DB 연결 정보)
- [ ] CORS 설정 (프론트엔드 도메인 허용)
- [ ] 에러 로깅 설정
- [ ] 백업 정책 수립

---

## 참고 사항

- 날짜 형식: `YYYY-MM-DD HH:mm`
- 이슈 삭제 시 checklist, todos 자동 삭제 (`CASCADE`)
- API 재시도: 최대 3회, 지수 백오프 적용
- 모든 엔드포인트는 위 FastAPI 예시와 동일한 패턴으로 구현 가능

---

**완료!**  
이 파일을 그대로 `README.md`로 저장하면 됩니다.  
필요한 부분 있으면 언제든 말씀해주세요!
```

**복사 방법**: 위 전체를 드래그해서 복사 → 새 파일 `README.md`에 붙여넣기 하면 끝!  
한 페이지에 깔끔하게 정리했습니다.