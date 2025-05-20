from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os,sys
# sys.path.append(os.getcwd()+"/amns")
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.api import router
from mangum import Mangum
import uvicorn
import json
from fastapi.responses import JSONResponse
from src.api import router

load_dotenv()


app = FastAPI()
handler = Mangum(app)

# Add CORS middleware if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://beta.kolpulse.com"],
    allow_credentials=True,
    allow_methods=["GET", "OPTIONS", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)




# Custom OPTIONS handler for /querying/model_response
@app.options("/querying/model_response")
async def handle_options(request: Request):
    # You can perform additional logging or processing here if necessary
    return JSONResponse(status_code=204)  # Respond with 204 No Content for pre-flight

app.include_router(router.app)

# def run_server():
#     uvicorn.run("main:app", host="127.0.0.1", port=int(os.getenv("PORT", 8000)), reload=True, debug = True)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
# Entry point
# if __name__ == "__main__":
#     # uvicorn.run("main:app", host="127.0.0.1", port=int(os.getenv("PORT", 8000)), reload=True)
#
#     test_event = {
#         'body': json.dumps({
#             'user_query': ''
#         })
#     }
#     context = {}  # Context can be an empty dict or mock if needed
#
#     response = lambda_handler(test_event, context)
