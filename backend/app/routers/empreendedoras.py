"""Feed de empreendedoras / projetos."""
from fastapi import APIRouter

from app.database import empreendedoras_collection, serializar
from app.modelos import NegocioIn

router = APIRouter(prefix="/api/empreendedoras", tags=["Empreendedoras"])


@router.get("")
def listar_empreendedoras():
    return [serializar(e) for e in empreendedoras_collection.find()]


@router.post("")
def cadastrar_negocio(dados: NegocioIn):
    novo_negocio = dados.model_dump() if hasattr(dados, "model_dump") else dados.dict()
    novo_negocio["usuario_id"] = "1"  # TODO: pegar a usuária logada pelo token

    empreendedoras_collection.insert_one(novo_negocio)
    return {
        "mensagem": "Projeto cadastrado com sucesso!",
        "negocio": serializar(novo_negocio),
    }


@router.get("/usuario/{usuario_id}")
def listar_projetos_por_usuario(usuario_id: str):
    filtro = {"usuario_id": usuario_id}
    return [serializar(e) for e in empreendedoras_collection.find(filtro)]
