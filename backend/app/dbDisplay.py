from sqlalchemy import text
from database import SessionLocal

def check_database_size():
    db = SessionLocal()
    size_query = text("SELECT pg_size_pretty(pg_database_size(current_database()));")
    result = db.execute(size_query).fetchone()
    print(f"[INFO] Database Size: {result[0]}")

def list_table_sizes():
    db = SessionLocal()
    table_size_query = text("""
        SELECT 
            table_schema || '.' || table_name AS table_full_name,
            pg_size_pretty(pg_total_relation_size(table_schema || '.' || table_name)) AS total_size
        FROM 
            information_schema.tables
        WHERE 
            table_schema NOT IN ('pg_catalog', 'information_schema')
        ORDER BY 
            pg_total_relation_size(table_schema || '.' || table_name) DESC
        LIMIT 10;
    """)
    results = db.execute(table_size_query).fetchall()
    
    print("[INFO] Top Tables by Size:")
    for row in results:
        print(f" - {row[0]}: {row[1]}")

if __name__ == "__main__":
    check_database_size()
    list_table_sizes()
