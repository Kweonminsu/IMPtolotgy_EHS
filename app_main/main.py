from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Any
import random
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

app = FastAPI(title="환경안전 운영 현황판")

# Static 파일 (CSS, JS, 이미지 등)
app.mount(
    "/static",
    StaticFiles(directory=str(BASE_DIR / "static")),   # ← 절대경로로 변경
    name="static"
)

templates = Jinja2Templates(directory="templates")

# 메인 페이지
@app.get("/", response_class=HTMLResponse)
async def read_main(request: Request):
    return templates.TemplateResponse("env_safety.html", {"request": request})


# ====================== API 라우터 ======================
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

    # ── 기존 5개 (원본 그대로 유지) ──
    base_issues = [
        {
            "id": 1,
            "title": "A동 3층 용접 불꽃 화재 위험",
            "category": "화재",
            "severity": "긴급",
            "status": "미결",
            "location": "A라인",
            "assignee": "김철수",
            "reporter": "홍길동",
            "desc": "용접 작업 중 불꽃이 인근 가연성 자재에 튀는 사고 위험 감지됨.",
            "createdAt": "2025-02-20 09:15",
            "checklist": [
                {"id": 101, "text": "용접 구역 가연성 자재 제거", "category": "화재", "checked": True},
                {"id": 102, "text": "소화기 비치 및 작동 확인", "category": "화재", "checked": True},
                {"id": 103, "text": "용접 작업 전 화기작업 허가서 발급", "category": "화재", "checked": False},
                {"id": 104, "text": "방화포 설치 완료 여부", "category": "화재", "checked": False},
            ],
            "todos": [
                {"id": 201, "text": "용접 구역 안전 울타리 설치", "assignee": "김철수", "due": "2025-02-22", "priority": "높음",
                 "done": False},
                {"id": 202, "text": "화재 예방 교육 실시", "assignee": "박안전", "due": "2025-02-25", "priority": "보통",
                 "done": False},
            ]
        },
        {
            "id": 2,
            "title": "화학약품 보관함 누출 흔적 발견",
            "category": "화학물질",
            "severity": "높음",
            "status": "진행중",
            "location": "B라인",
            "assignee": "이영희",
            "reporter": "최점검",
            "desc": "염산 보관함 하단부에 누액 흔적 발견.",
            "createdAt": "2025-02-21 11:30",
            "checklist": [
                {"id": 111, "text": "보호구 착용 확인", "category": "화학물질", "checked": True},
                {"id": 112, "text": "누출 구역 접근 통제", "category": "화학물질", "checked": True},
                {"id": 113, "text": "환기 시스템 작동 확인", "category": "화학물질", "checked": False},
            ],
            "todos": [
                {"id": 211, "text": "화학약품 보관함 신규 교체", "assignee": "이영희", "due": "2025-02-27", "priority": "높음",
                 "done": False},
                {"id": 212, "text": "MSDS 게시판 업데이트", "assignee": "박안전", "due": "2025-03-01", "priority": "보통",
                 "done": True},
            ]
        },
        {
            "id": 3,
            "title": "작업발판 난간 고정 불량",
            "category": "추락",
            "severity": "높음",
            "status": "미결",
            "location": "C라인",
            "assignee": "박민준",
            "reporter": "홍길동",
            "desc": "비계 작업발판 난간 볼트 2개 누락.",
            "createdAt": "2025-02-21 14:00",
            "checklist": [
                {"id": 121, "text": "비계 구조 안전 점검", "category": "추락", "checked": False},
                {"id": 122, "text": "추락 방지망 설치 확인", "category": "추락", "checked": False},
                {"id": 123, "text": "작업자 안전벨트 착용 확인", "category": "추락", "checked": True},
            ],
            "todos": [
                {"id": 221, "text": "난간 볼트 교체 작업", "assignee": "박민준", "due": "2025-02-23", "priority": "높음",
                 "done": False},
            ]
        },
        {
            "id": 4,
            "title": "압착기 소음 기준치 초과",
            "category": "소음",
            "severity": "보통",
            "status": "완료",
            "location": "D라인",
            "assignee": "최수진",
            "reporter": "이관리",
            "desc": "압착기 소음 92dB, 법적 기준 초과.",
            "createdAt": "2025-02-19 08:00",
            "checklist": [
                {"id": 131, "text": "소음 측정 기록 보관", "category": "소음", "checked": True},
                {"id": 132, "text": "귀마개 전 작업자 지급", "category": "소음", "checked": True},
            ],
            "todos": [
                {"id": 231, "text": "방음 패널 설치 검토", "assignee": "최수진", "due": "2025-03-10", "priority": "보통",
                 "done": True},
            ]
        },
        {
            "id": 5,
            "title": "소화기 유효기간 만료 3개",
            "category": "화재",
            "severity": "낮음",
            "status": "미결",
            "location": "A라인",
            "assignee": "강동원",
            "reporter": "김점검",
            "desc": "F동 내 소화기 3대 유효기간 경과.",
            "createdAt": "2025-02-22 10:20",
            "checklist": [
                {"id": 141, "text": "만료 소화기 위치 파악", "category": "화재", "checked": True},
                {"id": 142, "text": "교체용 소화기 발주", "category": "화재", "checked": False},
            ],
            "todos": [
                {"id": 241, "text": "소화기 3개 신규 구매", "assignee": "강동원", "due": "2025-02-28", "priority": "보통",
                 "done": False},
            ]
        }
    ]

    # ── 23개 랜덤 생성 (JS와 동일 로직) ──
    lines = ["A라인", "B라인", "C라인", "D라인"]
    cats = ["화재", "화학물질", "추락", "소음", "전기", "기타"]
    sevs = ["낮음", "보통", "높음", "긴급"]
    statuses = ["미결", "진행중", "완료"]

    date_list = [
        "2025-01-05", "2025-01-08", "2025-01-12", "2025-01-15", "2025-01-18", "2025-01-22", "2025-01-25",
        "2025-02-03", "2025-02-07", "2025-02-10", "2025-02-14", "2025-02-17", "2025-02-20", "2025-02-24",
        "2025-03-02", "2025-03-05", "2025-03-09", "2025-03-12", "2025-03-16", "2025-03-19", "2025-03-23", "2025-03-27"
    ]

    check_pool = {
        "화재": ["용접 구역 가연물 제거", "소화기 압력 확인", "화기작업 허가서 발급", "방화문 작동 테스트", "비상조명 점검"],
        "화학물질": ["보호구 착용 확인", "누출 감지기 작동", "환기 시스템 점검", "MSDS 게시", "중화제 비치"],
        "추락": ["안전벨트 착용", "난간 고정 볼트 확인", "추락 방지망 설치", "작업발판 안정성 점검"],
        "소음": ["소음 측정 기록", "귀마개 지급", "방음 패널 설치", "작업자 청력 검사"],
        "전기": ["접지 확인", "누전차단기 테스트", "전선 피복 상태 점검", "배전반 청소"],
        "기타": ["안전 표지판 부착", "비상구 통로 확보", "소방로 확보", "작업자 안전교육"],
    }

    todo_pool = {
        "화재": ["화재 예방 교육 실시", "소화기 교체", "용접 작업 허가 프로세스 개선"],
        "화학물질": ["누출 센서 교체", "화학물질 보관 기준 강화", "MSDS 최신화"],
        "추락": ["난간 보강 공사", "안전망 추가 설치", "작업자 안전벨트 점검"],
        "소음": ["방음 패널 설치", "작업자 청력 보호구 지급", "소음 저감 장치 검토"],
        "전기": ["배전반 점검", "접지 저항 측정", "전기 설비 정기 점검"],
        "기타": ["안전 표지판 교체", "비상구 조명 교체", "작업자 안전교육 실시"],
    }

    random_issues = []
    for i in range(23):
        cat = cats[i % 6]
        line = lines[i % 4]
        random_date = date_list[random.randint(0, len(date_list) - 1)]

        # 체크리스트 생성 (2~5개)
        checks = [
            {
                "id": 300 + i * 10 + idx,
                "text": check_pool[cat][idx % len(check_pool[cat])],
                "category": cat,
                "checked": random.random() > 0.5
            } for idx in range(2 + random.randint(0, 3))
        ]

        # To-Do 생성 (1~4개)
        todos = [
            {
                "id": 400 + i * 10 + idx,
                "text": todo_pool[cat][idx % len(todo_pool[cat])],
                "assignee": ["김철수", "이영희", "박민준", "최수진", "강동원"][random.randint(0, 4)],
                "due": random_date,
                "priority": ["낮음", "보통", "높음"][random.randint(0, 2)],
                "done": random.random() > 0.6
            } for idx in range(1 + random.randint(0, 3))
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

# ====================== 라우터 등록 (필수!) ======================
app.include_router(router)


# ====================== 개발 서버 실행 ======================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)