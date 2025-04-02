# main.py
import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)


app = FastAPI()

@app.get("/")
def root():
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE TABLE IF NOT EXISTS test_table (id SERIAL PRIMARY KEY, name VARCHAR(50));"))
            return {"message": "Connected to DB and test_table created (if it didn't exist)."}
    except Exception as e:
        return {"error": str(e)}