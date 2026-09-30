"""Cadastro e login de usuárias."""
from fastapi import APIRouter, HTTPException, status

from app.database import usuarios_collection
from feira2.backend.app.modelos import CadastroIn, LoginIn
from feira2.backend.app.seguranca import criar_token_acesso, gerar_hash, verificar_senha

router = APIRouter(prefix="/api", tags=["Autenticação"])


@router.post("/cadastrar")
def cadastrar_usuario(dados: CadastroIn):
    if usuarios_collection.find_one({"email": dados.email}):
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    usuarios_collection.insert_one(
        {
            "nome": dados.nome,
            "email": dados.email,
            "senha_hash": gerar_hash(dados.senha),
        }
    )
    return {"mensagem": "Usuária cadastrada com sucesso!"}


@router.post("/login")
def login(dados: LoginIn):
    usuario = usuarios_collection.find_one({"email": dados.email})

    # Mesma mensagem para e-mail inexistente e senha errada (não revela qual deu erro)
    if not usuario or not verificar_senha(dados.senha, usuario["senha_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = criar_token_acesso({"sub": usuario["email"]})
    return {"access_token": token, "token_type": "bearer", "nome": usuario["nome"]}
