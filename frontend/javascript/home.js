(() => {

            "use strict";

            /* =============================================================
               01. DADOS (Agora carregados dinamicamente da API)
            ============================================================= */
            let empreendedoras = [];

            /* =============================================================
               02. ELEMENTOS
            ============================================================= */
            const grid = document.getElementById("entrepreneurGrid");
            const searchForm = document.getElementById("searchForm");
            const searchInput = document.getElementById("searchInput");
            const resultsStatus = document.getElementById("resultsStatus");
            const clearSearch = document.getElementById("clearSearch");

            const categoryButtons = [
                ...document.querySelectorAll(".category-chip[data-category]")
            ];

            const topicCards = [
                ...document.querySelectorAll(".topic-card[data-topic]")
            ];

            const modalLayer = document.getElementById("modalLayer");
            const modalClose = document.getElementById("modalClose");
            const modalTitle = document.getElementById("modalTitle");
            const modalKicker = document.getElementById("modalKicker");
            const modalDescription = document.getElementById("modalDescription");
            const modalCover = document.getElementById("modalCover");

            const profileButton = document.getElementById("profileButton");
            const profileDropdown = document.getElementById("profileDropdown");

            let categoriaAtual = "Todos";
            let ultimaBusca = "";

            /* =============================================================
               03. UTILITÁRIOS
            ============================================================= */
            function normalizar(texto) {
                return String(texto)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .trim();
            }

            function primeiraLetra(nome) {
                const textoNome = nome || "Empreendedora";
                return textoNome.trim().charAt(0).toUpperCase();
            }

            function atualizarCategoriasAtivas() {
                categoryButtons.forEach(button => {
                    const ativa = button.dataset.category === categoriaAtual;
                    button.classList.toggle("active", ativa);
                });
            }

            /* =============================================================
               04. RENDERIZAÇÃO DOS CARDS
            ============================================================= */
            function renderCards(lista) {

                grid.innerHTML = "";

                if (!lista.length) {
                    grid.innerHTML = `
                        <div class="empty-state">
                            <strong>Nenhuma empreendedora encontrada.</strong>
                            <p>Tente outra palavra ou escolha uma categoria diferente.</p>
                        </div>
                    `;
                    return;
                }

                lista.forEach((item, index) => {

                    const card = document.createElement("article");
                    card.className = "entrepreneur-card";
                    const variation = index % 4;

                    // Compatibilidade com os campos do MongoDB (nome_negocio vs nome)
                    const nomeExibicao = item.nome_negocio || item.nome;
                    const categoriaExibicao = item.categoria || "Geral";
                    const descricaoExibicao = item.descricao || "";

                    card.innerHTML = `
                        <div class="card-image ${variation === 1 ? "alt-1" : ""} ${variation === 2 ? "alt-2" : ""} ${variation === 3 ? "alt-3" : ""}">
                            <div class="card-orbit"></div>
                            <span class="card-badge">${categoriaExibicao}</span>
                            <div class="card-initial">${primeiraLetra(nomeExibicao)}</div>
                        </div>

                        <div class="card-info">
                            <div class="card-name">${nomeExibicao}</div>
                            <div class="card-category">${categoriaExibicao}</div>
                            <div class="card-description">${descricaoExibicao}</div>
                            <div class="card-link">Ver detalhes</div>
                        </div>
                    `;

                    card.addEventListener("click", () => {
                        abrirModal({
                            nome: nomeExibicao,
                            categoria: categoriaExibicao,
                            descricao: descricaoExibicao
                        });
                    });

                    grid.appendChild(card);
                });
            }

            /* =============================================================
               05. FILTRO
            ============================================================= */
            function filtrar() {

                const termo = normalizar(searchInput.value);
                ultimaBusca = termo;

                const resultado = empreendedoras.filter(item => {
                    const nomeItem = item.nome_negocio || item.nome || "";
                    const categoriaItem = item.categoria || "";
                    const descricaoItem = item.descricao || "";

                    const categoriaOk =
                        categoriaAtual === "Todos" ||
                        categoriaItem === categoriaAtual;

                    const texto = normalizar(`${nomeItem} ${categoriaItem} ${descricaoItem}`);

                    const buscaOk = !termo || texto.includes(termo);

                    return categoriaOk && buscaOk;
                });

                renderCards(resultado);

                const quantidade = resultado.length;

                resultsStatus.innerHTML =
                    `Exibindo <strong>${quantidade}</strong> ${quantidade === 1 ? "perfil" : "perfis"} de referência.`;

                clearSearch.classList.toggle(
                    "visible",
                    Boolean(termo) || categoriaAtual !== "Todos"
                );
            }

            /* =============================================================
               06. CATEGORIAS DO HEADER
            ============================================================= */
            categoryButtons.forEach(button => {
                button.addEventListener("click", () => {
                    categoriaAtual = button.dataset.category;
                    atualizarCategoriasAtivas();
                    searchInput.value = "";
                    filtrar();

                    document.getElementById("destaques")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            });

            /* =============================================================
               07. CATEGORIAS DO CORPO
            ============================================================= */
            topicCards.forEach(card => {
                card.addEventListener("click", () => {
                    categoriaAtual = card.dataset.topic;
                    atualizarCategoriasAtivas();
                    searchInput.value = "";
                    filtrar();

                    document.getElementById("destaques")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
            });

            /* =============================================================
               08. PESQUISA
            ============================================================= */
            searchForm.addEventListener("submit", event => {
                event.preventDefault();
                filtrar();

                document.getElementById("destaques")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            searchInput.addEventListener("input", () => {
                filtrar();
            });

            clearSearch.addEventListener("click", () => {
                categoriaAtual = "Todos";
                searchInput.value = "";
                atualizarCategoriasAtivas();
                filtrar();
            });

            /* =============================================================
               09. MODAL
            ============================================================= */
            function abrirModal(item) {
                modalKicker.textContent = item.categoria;
                modalTitle.textContent = item.nome;
                modalDescription.textContent = item.descricao;
                modalCover.textContent = primeiraLetra(item.nome);
                modalLayer.classList.add("show");
                document.body.style.overflow = "hidden";
                modalClose.focus();
            }

            function fecharModal() {
                modalLayer.classList.remove("show");
                document.body.style.overflow = "";
            }

            modalClose.addEventListener("click", fecharModal);

            modalLayer.addEventListener("click", event => {
                if (event.target === modalLayer) {
                    fecharModal();
                }
            });

            /* =============================================================
               13. DROPDOWN DO PERFIL
            ============================================================= */
            profileButton.addEventListener("click", event => {
                event.stopPropagation();
                const aberto = profileDropdown.classList.toggle("open");
                profileButton.setAttribute("aria-expanded", String(aberto));
            });

            document.addEventListener("click", event => {
                if (
                    profileDropdown.classList.contains("open") &&
                    !profileDropdown.contains(event.target) &&
                    event.target !== profileButton
                ) {
                    profileDropdown.classList.remove("open");
                    profileButton.setAttribute("aria-expanded", "false");
                }
            });

            /* =============================================================
               14. BOTÕES DA HERO
            ============================================================= */
            document.getElementById("exploreButton")?.addEventListener("click", () => {
                document.getElementById("destaques")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            function biblioteca() {
                window.location.href = "biblioteca.html";
            }

            document.getElementById("heroBooksButton")?.addEventListener("click", biblioteca);
            document.getElementById("booksTopButton")?.addEventListener("click", biblioteca);

            document.getElementById("ctaButton")?.addEventListener("click", () => {
                document.getElementById("destaques")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            document.getElementById("brandButton")?.addEventListener("click", () => {
                categoriaAtual = "Todos";
                searchInput.value = "";
                atualizarCategoriasAtivas();
                filtrar();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

            /* =============================================================
               15. LOGOUT
            ============================================================= */
            function sair() {
                localStorage.removeItem("usuarioLogado");
                window.location.href = "index_novo.html";
            }

            document.getElementById("logoutButton")?.addEventListener("click", sair);

            /* =============================================================
               16. TECLADO
            ============================================================= */
            document.addEventListener("keydown", event => {
                if (event.key !== "Escape") return;

                if (modalLayer.classList.contains("show")) {
                    fecharModal();
                }

                if (profileDropdown.classList.contains("open")) {
                    profileDropdown.classList.remove("open");
                    profileButton.setAttribute("aria-expanded", "false");
                }
            });

            /* =============================================================
               17. PERFIL — NOME DO CADASTRO
            ============================================================= */
            try {
                const usuarioSalvo = JSON.parse(
                    localStorage.getItem("usuario") || "null"
                );

                if (usuarioSalvo && usuarioSalvo.nome) {
                    const nome = String(usuarioSalvo.nome).trim();
                    if (nome) {
                        const elemName = document.getElementById("profileName");
                        const elemInit = document.getElementById("profileInitial");
                        if (elemName) elemName.textContent = nome;
                        if (elemInit) elemInit.textContent = primeiraLetra(nome);
                    }
                }
            } catch (erro) {
                console.warn("Não foi possível ler o usuário salvo.", erro);
            }

            /* =============================================================
               19. INICIALIZAÇÃO (BUSCANDO DA API DO FASTAPI)
            ============================================================= */
            async function carregarEmpreendedorasDaAPI() {
                try {
                    const resposta = await fetch("http://127.0.0.1:8000/api/empreendedoras");
                    if (!resposta.ok) {
                        throw new Error("Erro ao buscar dados da API");
                    }
                    const dados = await resposta.json();
                    
                    // Atualiza a lista com os dados vindos do MongoDB
                    empreendedoras = dados;
                    
                    atualizarCategoriasAtivas();
                    filtrar();
                } catch (erro) {
                    console.error("Erro na conexão com o backend:", erro);
                    resultsStatus.innerHTML = `<span style="color: red;">Erro ao carregar dados do servidor. O FastAPI está ligado?</span>`;
                }
            }

            carregarEmpreendedorasDaAPI();

        })();