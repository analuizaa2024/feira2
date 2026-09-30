"""Configurações lidas do arquivo .env (nunca deixe senhas direto no código)."""
import os

from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "elas_em_rede_db")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Origens permitidas no CORS, separadas por vírgula. "*" libera tudo (ok só em desenvolvimento).
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "*").split(",")]

if not MONGO_URL or not SECRET_KEY:
    raise RuntimeError(
        "Faltam variáveis no .env: MONGO_URL e SECRET_KEY. "
        "Copie o arquivo .env.example para .env e preencha."
    )
