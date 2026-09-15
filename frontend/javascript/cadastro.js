document.getElementById("cadastroForm")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    // 1. Captura os dados usando os IDs exatos do seu HTML
    const usuario = {
        nome: document.getElementById("nome")?.value.trim() || "",
        email: document.getElementById("email-cadastro")?.value.trim() || "",
        senha: document.getElementById("senha-cadastro")?.value || ""
    };

    // 2. Valida se preencheu os campos obrigatórios
    if (!usuario.email || !usuario.senha || !usuario.nome) {
        alert("Por favor, preencha todos os campos!");
        return;
    }

    try {
        // 3. Envia os dados para a API do FastAPI
        const resposta = await fetch("http://127.0.0.1:8000/api/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Cadastro realizado com sucesso!");
            // 4. Redireciona para a tela de Login
            window.location.href = "login.html";
        } else {
            // Mostra o erro retornado pela API (ex: e-mail já cadastrado)
            alert(resultado.detail || "Erro ao realizar o cadastro.");
        }
    } catch (erro) {
        console.error("Erro de conexão:", erro);
        alert("Não foi possível conectar ao servidor. Verifique se o FastAPI está rodando.");
    }
});