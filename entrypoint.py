import uvicorn
from app.main import app  # endpoint.py에서 라우터 가져오기

# ====================== 메인 실행 블록 ======================
if __name__ == "__main__":
    import uvicorn
    from main import app

    # 라우터 등록
    app.include_router(router)

    # 서버 실행
    uvicorn.run(
        "main:app",  # 문자열로 변경
        host="0.0.0.0",
        port=8000,
        reload=True
    )