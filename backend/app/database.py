"""Conexão com o MongoDB Atlas e coleções usadas na API."""
from pymongo import MongoClient

from app.config import MONGO_DB_NAME, MONGO_URL

client = MongoClient(MONGO_URL)
db = client[MONGO_DB_NAME]

usuarios_collection = db["usuarios"]
empreendedoras_collection = db["empreendedoras"]


def serializar(doc: dict) -> dict:
    """Troca o _id do Mongo (ObjectId) por um campo 'id' em texto."""
    doc["id"] = str(doc.pop("_id"))
    return doc
