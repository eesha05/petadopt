import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:Mithoo21@localhost:5432/petadoption")

def run_migration():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()

    # 1. Create wishlists table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS wishlists (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_pet_wishlist UNIQUE (user_id, pet_id)
    );
    """)

    # 2. Add columns to adoption_requests
    columns_to_add = [
        ("full_name", "VARCHAR(255)"),
        ("phone", "VARCHAR(50)"),
        ("city", "VARCHAR(100)"),
        ("address", "TEXT"),
        ("housing_type", "VARCHAR(50)"),
        ("own_or_rent", "VARCHAR(20)"),
        ("pets_permitted", "BOOLEAN DEFAULT TRUE"),
        ("experience", "TEXT"),
        ("other_pets", "TEXT"),
        ("daily_availability", "VARCHAR(100)"),
        ("reason", "TEXT"),
        ("agreed_to_terms", "BOOLEAN DEFAULT TRUE")
    ]

    for col_name, col_type in columns_to_add:
        cur.execute("""
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'adoption_requests' AND column_name = %s
        """, (col_name,))
        if not cur.fetchone():
            cur.execute(f"ALTER TABLE adoption_requests ADD COLUMN {col_name} {col_type};")
            print(f"Added column {col_name} to adoption_requests")

    conn.commit()
    print("Database migration completed successfully!")
    conn.close()

if __name__ == "__main__":
    run_migration()
