# # clear database
from models import Property
from database import SessionLocal, engine

from dotenv import load_dotenv
load_dotenv()

# Get engine URL used by SQLAlchemy (actual one in use)
print(f"[DEBUG] Connected to DB: {engine.url}")

def clear_database():
    db = SessionLocal()
    count = db.query(Property).count()
    print(f"[DEBUG] Number of properties before deletion: {count}")
    deleted = db.query(Property).delete()
    db.commit()
    print(f"[INFO] Deleted {deleted} properties from the database.")


if __name__ == "__main__":
    clear_database()
