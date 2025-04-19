from app.db.database import engine, Base

if __name__ == "__main__":
    print("⚠️ Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped.")

    print("🛠 Creating new tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created.")
