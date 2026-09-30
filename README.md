# Elas em Rede

Plataforma de empreendedoras. Front-end em HTML, CSS e JavaScript; API em Python (FastAPI) com MongoDB Atlas.

## Estrutura

```
feira2/
├── backend/
│   ├── app/
│   │   ├── main.py            # cria o app e registra as rotas
│   │   ├── config.py          # variáveis do .env
│   │   ├── database.py        # conexão com o MongoDB
│   │   ├── security.py        # senha (bcrypt) e token JWT
│   │   ├── schemas.py         # formato dos dados recebidos
│   │   └── routers/
│   │       ├── auth.py            # /api/cadastrar e /api/login
│   │       ├── usuarios.py        # /api/usuarios
│   │       └── empreendedoras.py  # /api/empreendedoras
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── *.html
    ├── css/
    └── javascript/
```

## Como rodar

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows  (Linux/Mac: source venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env         # Linux/Mac: cp .env.example .env  -> depois preencha o .env
uvicorn app.main:app --reload
```
A documentação automática (Swagger) fica em http://127.0.0.1:8000/docs

### 2. Frontend
Abra a pasta `frontend` com o Live Server do VS Code (ou abra o `login.html` no navegador).
