from app.db.database import engine, Base

# This script is used to reset the database by dropping all tables and creating new ones.
if __name__ == "__main__":
    print("⚠️ Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped.")

    print("🛠 Creating new tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")
