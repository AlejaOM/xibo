from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import users, notes
from db.base import init_db

# Llama a init_db() para crear las tablas al iniciar
# En una app de producción, podrías usar Alembic para migraciones.
init_db() 

app = FastAPI(title="Xibo Notes API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"], # Origen de tu app Angular
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(notes.router, prefix="/api/notes", tags=["notes"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Xibo Notes API"}
