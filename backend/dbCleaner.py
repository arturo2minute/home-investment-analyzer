# reset database
from app.models import Base
from app.database import engine

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# clear database
from app.models import Property
from app.database import SessionLocal

def clear_database():
    db = SessionLocal()
    deleted = db.query(Property).delete()
    db.commit()
    print(f"[INFO] Deleted {deleted} properties from the database.")

    

if __name__ == "__main__":
    clear_database()


