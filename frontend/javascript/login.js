document.getElementById("loginForm")?.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
        const resposta = await fetch("http://127.0.0.1:8000/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, senha: senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            // Salva o Token JWT e os dados da usuária no navegador
            localStorage.setItem("userToken", dados.token);
            localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

            alert("Login realizado com sucesso!");
            window.location.href = "Home.html";
        } else {
            alert(dados.detail || "E-mail ou senha incorretos.");
        }
    } catch (erro) {
        console.error("Erro na conexão com o servidor:", erro);
        alert("Não foi possível conectar ao servidor da API.");
    }
});