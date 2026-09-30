"""Rotas de usuárias."""
from fastapi import APIRouter

from app.database import serializar, usuarios_collection

router = APIRouter(prefix="/api", tags=["Usuárias"])


# ATENÇÃO: rota de diagnóstico, aberta para qualquer pessoa. Remova ou proteja antes de publicar.
@router.get("/usuarios")
def listar_usuarios():
    usuarios = []
    for usuario in usuarios_collection.find({}, {"senha_hash": 0}):
        usuarios.append(serializar(usuario))
    return usuarios
