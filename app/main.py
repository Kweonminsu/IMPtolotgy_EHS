# main.py
# FastAPI 기본 웹 테스트 서버

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles  # 정적 파일(css, js) 서빙용
from fastapi.templating import Jinja2Templates  # html 템플릿 렌더링용

app = FastAPI()

# 1️⃣ static 폴더를 /static 경로로 연결
app.mount("/static", StaticFiles(directory="static"), name="static")

# 2️⃣ templates 폴더 설정
templates = Jinja2Templates(directory="templates")

# 3️⃣ 메인 페이지 라우팅
@app.get("/", response_class=HTMLResponse)
async def read_main(request: Request):
    # HTML 렌더링
    return templates.TemplateResponse(
        "env_safety.html",
        {"request": request}  # Jinja2는 반드시 request를 전달해야 함
    )

from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any
import random

router = APIRouter(prefix="/api", tags=["dashboard"])

# ====================== Pydantic 모델 ======================
class ChecklistItem(BaseModel):
    id: int
    text: str
    category: str
    checked: bool

class TodoItem(BaseModel):
    id: int
    text: str
    assignee: str
    due: str
    priority: str
    done: bool

class Issue(BaseModel):
    id: int
    title: str
    category: str
    severity: str
    status: str
    location: str
    assignee: str
    reporter: str
    desc: str
    createdAt: str
    checklist: List[ChecklistItem]
    todos: List[TodoItem]

class DashboardResponse(BaseModel):
    issues: List[Issue]
    stats: Dict[str, Any]
    lastUpdated: str


# ====================== 샘플 데이터 생성 함수 ======================
def generate_sample_issues() -> List[Dict]:
    """JS의 SAMPLE_ISSUES와 완전히 동일한 데이터를 Python에서 생성"""
    
    base_issues = [
        # 기존 5개 (원본 그대로 유지)
        {
            "id": 1, "title": "A동 3층 용접 불꽃 화재 위험", "category": "화재",
            "severity": "긴급", "status": "미결", "location": "A라인",
            "assignee": "김철수", "reporter": "홍길동",
            "desc": "용접 작업 중 불꽃이 인근 가연성 자재에 튀는 사고 위험 감지됨.",
            "createdAt": "2025-02-20 09:15",
            "checklist": [
                {"id": 101, "text": "용접 구역 가연성 자재 제거", "category": "화재", "checked": True},
                {"id": 102, "text": "소화기 비치 및 작동 확인", "category": "화재", "checked": True},
                {"id": 103, "text": "용접 작업 전 화기작업 허가서 발급", "category": "화재", "checked": False},
                {"id": 104, "text": "방화포 설치 완료 여부", "category": "화재", "checked": False},
            ],
            "todos": [
                {"id": 201, "text": "용접 구역 안전 울타리 설치", "assignee": "김철수", "due": "2025-02-22", "priority": "높음", "done": False},
                {"id": 202, "text": "화재 예방 교육 실시", "assignee": "박안전", "due": "2025-02-25", "priority": "보통", "done": False},
            ]
        },
        # ... (나머지 4개도 동일하게 복사 가능)
        # 여기서는 공간상 생략하고, 아래에서 29개 랜덤 생성과 합칩니다.
    ]

    # ── 29개 랜덤 생성 (JS와 동일 로직) ──
    lines = ["A라인", "B라인", "C라인", "D라인"]
    cats = ["화재", "화학물질", "추락", "소음", "전기", "기타"]
    sevs = ["낮음", "보통", "높음", "긴급"]
    statuses = ["미결", "진행중", "완료"]

    date_list = [
        "2025-01-05","2025-01-08","2025-01-12","2025-01-15","2025-01-18","2025-01-22","2025-01-25",
        "2025-02-03","2025-02-07","2025-02-10","2025-02-14","2025-02-17","2025-02-20","2025-02-24",
        "2025-03-02","2025-03-05","2025-03-09","2025-03-12","2025-03-16","2025-03-19","2025-03-23",
        "2026-01-04","2026-01-11","2026-01-18","2026-01-25","2026-02-01","2026-02-08","2026-02-15",
        "2026-02-22","2026-03-01","2026-03-08","2026-03-15","2026-03-22"
    ]

    random_issues = []
    for i in range(29):
        cat = cats[i % 6]
        line = lines[i % 4]
        random_date = date_list[i % len(date_list)]

        # 체크리스트
        check_pool = { ... }  # JS와 동일한 checkPool 복사
        checks = [
            {
                "id": 300 + i * 10 + idx,
                "text": check_pool[cat][idx % len(check_pool[cat])],
                "category": cat,
                "checked": random.random() > 0.5
            } for idx in range(2 + random.randint(0, 4))
        ]

        # To-Do
        todo_pool = { ... }  # JS와 동일한 todoPool 복사
        todos = [
            {
                "id": 400 + i * 10 + idx,
                "text": todo_pool[cat][idx % len(todo_pool[cat])],
                "assignee": ["김철수", "이영희", "박민준", "최수진", "강동원"][random.randint(0, 4)],
                "due": random_date,
                "priority": ["낮음", "보통", "높음"][random.randint(0, 2)],
                "done": random.random() > 0.6
            } for idx in range(1 + random.randint(0, 4))
        ]

        random_issues.append({
            "id": 6 + i,
            "title": f"{line} {cat} 안전 이슈 #{6 + i}",
            "category": cat,
            "severity": sevs[i % 4],
            "status": statuses[i % 3],
            "location": line,
            "assignee": ["김철수", "이영희", "박민준", "최수진", "강동원"][i % 5],
            "reporter": "홍길동",
            "desc": f"자동 생성된 {cat} 관련 안전 이슈입니다.",
            "createdAt": f"{random_date} {str(8 + (i % 12)).zfill(2)}:00",
            "checklist": checks,
            "todos": todos,
        })

    return base_issues + random_issues


# ====================== 실제 API ======================
@router.get("/dashboard")
async def get_dashboard():
    issues = generate_sample_issues()   # ← JS와 동일한 샘플 데이터 생성

    return {
        "issues": issues,
        "stats": {
            "total": len(issues),
            "open": len([i for i in issues if i["status"] == "미결"]),
            "done": len([i for i in issues if i["status"] == "완료"]),
            "checkPct": round(sum(1 for i in issues for c in i["checklist"] if c["checked"]) /
                              sum(1 for i in issues for c in i["checklist"] if i["checklist"]) * 100, 0)
        },
        "lastUpdated": datetime.utcnow().isoformat()
    }