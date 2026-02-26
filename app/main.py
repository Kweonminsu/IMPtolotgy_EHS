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