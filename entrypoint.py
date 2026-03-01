import uvicorn
import os

if __name__ == "__main__":
    uvicorn.run(
        "app_main.main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "development") == "development",
        log_level=os.getenv("LOG_LEVEL", "info")
    )