function goProject() {
    window.location.href = "meuprojeto.html";
}

(() => {
    const API = "http://127.0.0.1:8000";
    const KEY = "perfilElas";
    const $ = (id) => document.getElementById(id);
    const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    // ---------- Dados do perfil (salvos no navegador) ----------
    const logada = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
    const padrao = {
        name: logada.nome || "Elas Empreendedoras",
        username: "@" + (logada.email ? logada.email.split("@")[0] : "elasempreendedoras"),
        category: "Empreendedorismo feminino",
        role: "", location: "", photo: "",
        bio: "Organizando ideias, aprendizados e projetos para transformar inspiração em possibilidade.",
        about: "", formacoes: [], experiencias: [],
        goal: [false, false, false, false], atividades: [],
    };
    let perfil = { ...padrao, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    let projetos = [];
    const salvar = () => localStorage.setItem(KEY, JSON.stringify(perfil));
    const toast = (msg) => { const t = $("toast"); t.textContent = msg; t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 2200); };
    const registrar = (texto) => { perfil.atividades.unshift({ texto, data: Date.now() }); perfil.atividades = perfil.atividades.slice(0, 30); };
    const dataBr = (ms) => new Date(ms).toLocaleDateString("pt-BR");
    const fotoCss = (el) => { el.style.background = perfil.photo ? `url(${perfil.photo}) center / cover` : ""; el.firstElementChild && (el.firstElementChild.style.display = perfil.photo ? "none" : ""); };

    // ---------- Renderização ----------
    function renderPerfil() {
        const letra = (perfil.name || "E").trim().charAt(0).toUpperCase();
        $("profileName").textContent = perfil.name;
        $("profileUsername").textContent = perfil.username;
        $("profileCategory").textContent = perfil.category;
        $("profileBio").textContent = perfil.bio;
        $("avatarLetter").textContent = letra;
        fotoCss($("avatar"));
        $("aboutName").textContent = "Sobre mim";
        $("aboutRole").textContent = perfil.role;
        $("aboutPhoto").textContent = perfil.photo ? "" : letra;
        $("aboutPhoto").style.background = perfil.photo ? `url(${perfil.photo}) center / cover` : "";
        $("aboutText").textContent = perfil.about || perfil.bio;
        $("aboutArea").textContent = perfil.category;
        $("aboutLocation").textContent = perfil.location || "Local não informado";
        $("aboutHandle").textContent = perfil.username;
        renderLista("formacoes", "listFormacoes", "Nenhuma formação adicionada ainda.");
        renderLista("experiencias", "listExperiencias", "Nenhuma experiência adicionada ainda.");
    }

    function renderLista(chave, destino, vazio) {
        const itens = perfil[chave];
        $(destino).innerHTML = itens.length ? itens.map((i, n) => `
            <div class="cv-item">
                <button class="cv-del" data-del="${chave}:${n}" aria-label="Remover">×</button>
                <strong>${esc(i.titulo)}</strong>
                <span>${esc([i.lugar, i.periodo].filter(Boolean).join(" · "))}</span>
                ${i.desc ? `<p>${esc(i.desc)}</p>` : ""}
            </div>`).join("") : `<div class="cv-empty">${vazio}</div>`;
    }

    function renderProjetos(erro) {
        $("metaProjects").textContent = $("projectCount").textContent = projetos.length;
        $("projectsGrid").innerHTML = erro ? `<div class="empty"><h3>Não consegui carregar seus projetos</h3><p>Confira se a API está rodando.</p></div>`
            : projetos.length ? projetos.map((p) => `
                <article class="project-card">
                    <div class="project-top"><span class="project-badge">${esc(p.categoria || "Projeto")}</span></div>
                    <div class="project-name">${esc(p.nome_negocio)}</div>
                    <p class="project-description">${esc(p.descricao || p.solucao || "")}</p>
                    <div class="project-foot"><span class="project-stage">${esc(p.fase || "Ideia")}</span></div>
                </article>`).join("")
            : `<div class="empty"><h3>Nenhum projeto ainda</h3><p>Clique em “+ Novo projeto” para começar.</p></div>`;
        renderAtividade();
    }

    function renderAtividade() {
        const dosProjetos = projetos.map((p) => ({
            icone: "✦", texto: `Você cadastrou o projeto “${p.nome_negocio}”`, detalhe: p.categoria || "",
            data: parseInt(String(p.id).slice(0, 8), 16) * 1000 || 0, // o _id do Mongo guarda a data de criação
        }));
        const locais = perfil.atividades.map((a) => ({ icone: "✎", texto: a.texto, detalhe: "", data: a.data }));
        const todas = [...dosProjetos, ...locais].sort((a, b) => b.data - a.data);
        $("activityList").innerHTML = todas.length ? todas.map((a) => `
            <div class="activity"><div class="activity-icon">${a.icone}</div>
            <div><strong>${esc(a.texto)}</strong><span>${esc(a.detalhe)}</span></div>
            <time>${a.data ? dataBr(a.data) : ""}</time></div>`).join("")
            : `<div class="cv-empty">Sua atividade aparece aqui: projetos criados e mudanças no perfil.</div>`;
    }

    function renderMeta() {
        const feitas = perfil.goal.filter(Boolean).length, pct = Math.round((feitas / 4) * 100);
        document.querySelectorAll("[data-goal]").forEach((c) => (c.checked = perfil.goal[c.dataset.goal - 1]));
        $("goalBar").style.width = pct + "%";
        $("goalText").textContent = `${feitas} de 4 etapas`;
        $("goalPercent").textContent = pct + "%";
        $("metaProgress").textContent = pct + "%";
    }

    async function carregarProjetos() {
        try {
            const r = await fetch(`${API}/api/empreendedoras/usuario/1`); // TODO: trocar pelo id da usuária logada
            projetos = r.ok ? await r.json() : [];
            renderProjetos(!r.ok);
        } catch { renderProjetos(true); }
    }

    // ---------- Abas ----------
    function abrirAba(nome) {
        document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === nome));
        document.querySelectorAll(".tab-content").forEach((c) => c.classList.toggle("active", c.id === nome));
    }
    document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => abrirAba(t.dataset.tab)));

    // ---------- Editar perfil ----------
    const campos = { editName: "name", editUsername: "username", editCategory: "category", editLocation: "location", editBio: "bio", editAbout: "about", editRole: "role" };
    function abrirPerfil() {
        for (const [id, chave] of Object.entries(campos)) $(id).value = perfil[chave] || "";
        $("profileModal").classList.add("show");
    }
    const fecharPerfil = () => $("profileModal").classList.remove("show");
    ["editProfileBtn2", "quickProfile"].forEach((id) => $(id).addEventListener("click", abrirPerfil));
    ["closeProfile", "cancelProfile"].forEach((id) => $(id).addEventListener("click", fecharPerfil));

    // Reduz a foto para 300px antes de guardar, para não lotar o armazenamento do navegador
    const lerFoto = (arquivo) => new Promise((ok) => {
        const img = new Image(), url = URL.createObjectURL(arquivo);
        img.onload = () => {
            const lado = Math.min(img.width, img.height), c = document.createElement("canvas");
            c.width = c.height = 300;
            c.getContext("2d").drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, 300, 300);
            URL.revokeObjectURL(url);
            ok(c.toDataURL("image/jpeg", 0.8));
        };
        img.src = url;
    });

    $("saveProfile").addEventListener("click", async () => {
        for (const [id, chave] of Object.entries(campos)) perfil[chave] = $(id).value.trim();
        if (perfil.username && !perfil.username.startsWith("@")) perfil.username = "@" + perfil.username;
        const arq = $("editPhoto").files[0];
        if (arq) perfil.photo = await lerFoto(arq);
        registrar("Você atualizou seu perfil");
        salvar(); renderPerfil(); renderAtividade(); fecharPerfil();
        toast("Perfil atualizado!");
    });

    // ---------- Formação e experiência ----------
    let tipoAtual = "formacoes";
    const rotulos = { formacoes: ["Adicionar formação", "Curso", "Instituição"], experiencias: ["Adicionar experiência", "Cargo", "Empresa"] };
    document.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
        tipoAtual = b.dataset.add;
        [$("itemModalTitle").textContent, $("lblTitulo").textContent, $("lblLugar").textContent] = rotulos[tipoAtual];
        ["itemTitulo", "itemLugar", "itemPeriodo", "itemDesc"].forEach((id) => ($(id).value = ""));
        $("itemModal").classList.add("show");
    }));
    const fecharItem = () => $("itemModal").classList.remove("show");
    ["closeItem", "cancelItem"].forEach((id) => $(id).addEventListener("click", fecharItem));
    $("saveItem").addEventListener("click", () => {
        const titulo = $("itemTitulo").value.trim();
        if (!titulo) return toast("Preencha o " + rotulos[tipoAtual][1].toLowerCase());
        perfil[tipoAtual].push({ titulo, lugar: $("itemLugar").value.trim(), periodo: $("itemPeriodo").value.trim(), desc: $("itemDesc").value.trim() });
        registrar(`Você adicionou “${titulo}” ao seu currículo`);
        salvar(); renderPerfil(); renderAtividade(); fecharItem();
    });
    $("about").addEventListener("click", (e) => {
        const d = e.target.dataset.del;
        if (!d) return;
        const [chave, n] = d.split(":");
        perfil[chave].splice(Number(n), 1);
        salvar(); renderPerfil();
    });

    // ---------- Meta, atalhos e compartilhar ----------
    document.querySelectorAll("[data-goal]").forEach((c) => c.addEventListener("change", () => {
        perfil.goal[c.dataset.goal - 1] = c.checked; salvar(); renderMeta();
    }));
    $("resetGoal").addEventListener("click", () => { perfil.goal = [false, false, false, false]; salvar(); renderMeta(); });
    $("quickProject").addEventListener("click", goProject);
    $("emptyCreateBtn") && $("emptyCreateBtn").addEventListener("click", goProject);
    $("quickHome").addEventListener("click", () => (window.location.href = "Home.html"));
    $("quickScroll").addEventListener("click", () => { abrirAba("projects"); $("projects").scrollIntoView({ behavior: "smooth" }); });
    $("shareProfileBtn").addEventListener("click", () => {
        navigator.clipboard?.writeText(window.location.href).then(() => toast("Link copiado!"), () => toast("Não foi possível copiar o link"));
    });

    // ---------- Início ----------
    renderPerfil(); renderMeta(); carregarProjetos();
})();
