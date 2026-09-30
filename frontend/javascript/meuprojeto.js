const $ = id => document.getElementById(id);
const form = $("projectForm");
const fields = ["projectName", "category", "description", "problem", "solution", "audience", "stage", "goal", "differential"];

function preview() {
    $("previewTitle").textContent = $("projectName").value.trim() || "Seu projeto";
    $("previewCategory").textContent = $("category").value || "Sua categoria";
    $("previewDescription").textContent = $("description").value.trim() || "A descrição do seu projeto aparecerá aqui conforme você preencher o formulário.";
    $("previewAudience").textContent = $("audience").value.trim() || "Público-alvo";
    $("previewGoal").textContent = $("goal").value.trim() || "Objetivo";
    $("previewStage").textContent = $("stage").value || "Ideia";
}
fields.forEach(id => $(id).addEventListener("input", () => {
    preview();
    saveDraft()
}));
fields.forEach(id => $(id).addEventListener("change", () => {
    preview();
    saveDraft()
}));

function saveDraft() {
    const d = {};
    fields.forEach(id => d[id.replace("projectName", "name") || id] = $(id).value);
    localStorage.setItem("projetoRascunho", JSON.stringify(d));
}

function loadDraft() {
    try {
        const d = JSON.parse(localStorage.getItem("projetoRascunho") || "null");
        if (!d) return;
        fields.forEach(id => {
            const k = id.replace("projectName", "name") || id;
            if (d[k] !== undefined) $(id).value = d[k]
        });
    } catch { }
}

function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2600)
}
form.addEventListener("submit", async e => {
    e.preventDefault();

    // Mapeia os campos do formulário para os nomes que o FastAPI espera no banco
    const dadosProjeto = {
        nome_negocio: $("projectName").value.trim(),
        categoria: $("category").value,
        descricao: $("description").value,
        problema: $("problem").value.trim(),
        solucao: $("solution").value.trim(),
        publico_alvo: $("audience").value.trim(),
        fase: $("stage").value,
        objetivo: $("goal").value.trim(),
        diferencial: $("differential").value.trim()
    };

    try {
        // Envia os dados para a API do FastAPI
        const resposta = await fetch("http://127.0.0.1:8000/api/empreendedoras", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosProjeto)
        });

        if (resposta.ok) {
            const resultado = await resposta.json();

            // Limpa o rascunho do navegador já que foi salvo com sucesso no servidor
            localStorage.removeItem("projetoRascunho");

            toast("Projeto salvo no banco de dados! ♡");
            setTimeout(() => {
                window.location.href = "home.html"; // Redireciona para a Home ou perfil
            }, 1000);
        } else {
            alert("Erro ao salvar o projeto no servidor.");
        }
    } catch (erro) {
        console.error("Erro de conexão:", erro);
        alert("Não foi possível conectar ao backend. Verifique se o Uvicorn está rodando.");
    }
});

function goProfile() {
    window.location.href = "perfil.html"
}

function goHome() {
    window.location.href = "home.html"
}
loadDraft();
preview();