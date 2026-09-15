from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
import jwt
from pymongo import MongoClient

# Configuração do JWT (proteção de dados)
SECRET_KEY = "sua_chave_secreta_super_segura_aqui"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Criptografia de senhas - proteje a senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# Configuração do MongoDB Atlas (Nuvem)
MONGO_URL = "mongodb+srv://AnaLuiza:AnaLuiza@cluster0.elo3l5s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URL)
db = client["elas_em_rede_db"]  # Nome do banco de dados na nuvem

# Coleções (cria as coleções)
usuarios_collection = db["usuarios"]
empreendedoras_collection = db["empreendedoras"]

# Inicializa o aplicativo FastAPI - swwagger
app = FastAPI(title="Elas em Rede API - MongoDB")

# Configuração de CORS para o Frontend (Live Server na porta 5500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Funções auxiliares de Token e Senha
def verificar_senha(senha_pura, senha_hash):
    return pwd_context.verify(senha_pura, senha_hash)

def criar_token_acesso(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt


# --- ROTAS DA API ---


 #--- essa rota serve para criar um novo usuario --
@app.post("/api/cadastrar")
def cadastrar_usuario(dados: dict):
    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")

    # Verifica se o e-mail já existe no MongoDB
    usuario_existente = usuarios_collection.find_one({"email": email})
    if usuario_existente:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado.")

    senha_hash = pwd_context.hash(senha)
    novo_usuario = {
        "nome": nome,
        "email": email,
        "senha_hash": senha_hash
    }
    
    usuarios_collection.insert_one(novo_usuario)

    return {"mensagem": "Usuária cadastrada com sucesso!"}


#--- rota do login --------
@app.post("/api/login")
def login(dados: dict):
    print("DADOS RECEBIDOS:", dados)
    email = dados.get("email")
    senha = dados.get("senha")

    usuario = usuarios_collection.find_one({"email": email})
    if not usuario:
        print("--> ERRO: O e-mail não existe no banco de dados!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verificar_senha(senha, usuario["senha_hash"]):
        print("--> ERRO: A senha está incorreta!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = criar_token_acesso(data={"sub": usuario["email"]})
    return {"access_token": access_token, "token_type": "bearer", "nome": usuario["nome"]}

# Rota de diagnóstico para ver os usuários cadastrados
@app.get("/api/usuarios")
def listar_usuarios():
    usuarios = []
    for usuario in usuarios_collection.find():
        usuario["id"] = str(usuario["_id"])  # Converte o ID do Mongo para string
        del usuario["_id"]
        del usuario["senha_hash"]  # Oculta a senha por segurança
        usuarios.append(usuario)
    return usuarios

# ------ tem que arrumar ------
# Rotas do Feed de Empreendedoras
@app.get("/api/empreendedoras")
def listar_empreendedoras():
    empresas = []
    for empresa in empreendedoras_collection.find():
        empresa["id"] = str(empresa["_id"])
        del empresa["_id"]
        empresas.append(empresa)
    return empresas


@app.post("/api/empreendedoras")
def cadastrar_negocio(dados: dict):
    # Como o MongoDB aceita qualquer dicionário, todos os campos enviados pelo formulário entram direto!
    novo_negocio = {
        "nome_negocio": dados.get("nome_negocio"),
        "categoria": dados.get("categoria"),
        "descricao": dados.get("descricao"),
        "problema": dados.get("problema"),
        "solucao": dados.get("solucao"),
        "publico_alvo": dados.get("publico_alvo"),
        "fase": dados.get("fase"),
        "objetivo": dados.get("objetivo"),
        "diferencial": dados.get("diferencial"),
        "usuario_id": "1"  # Temporário
    }
    
    resultado = empreendedoras_collection.insert_one(novo_negocio)
    novo_negocio["id"] = str(resultado.inserted_id)
    del novo_negocio["_id"]
    
    return {"mensagem": "Projeto cadastrado com sucesso!", "negocio": novo_negocio}