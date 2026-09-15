
        (() => {

            "use strict";

            /* =============================================================
               01. DADOS
            ============================================================= */
            const empreendedoras = [{
                nome: "Ana Moda",
                categoria: "Moda",
                descricao: "Empreendedora especializada em moda feminina, com foco em peças autorais e identidade de marca."
            }, {
                nome: "Beatriz Beauty",
                categoria: "Beleza",
                descricao: "Produtos e serviços de beleza desenvolvidos para mulheres, com atenção à experiência e ao cuidado."
            }, {
                nome: "Camila Tech",
                categoria: "Tecnologia",
                descricao: "Soluções digitais e tecnologia aplicadas a pequenos negócios e novos projetos."
            }, {
                nome: "Diana Gourmet",
                categoria: "Gastronomia",
                descricao: "Gastronomia artesanal e produtos criados para transformar receitas em experiências."
            }, {
                nome: "Elisa Artes",
                categoria: "Artesanato",
                descricao: "Artesanato autoral e peças personalizadas que valorizam criatividade e produção manual."
            }, {
                nome: "Fernanda Edu",
                categoria: "Educação",
                descricao: "Conteúdos, cursos e iniciativas voltadas ao desenvolvimento profissional."
            }, {
                nome: "Gabriela Business",
                categoria: "Negócios",
                descricao: "Consultoria e estratégias para organização, posicionamento e crescimento de negócios."
            }, {
                nome: "Helena Marketing",
                categoria: "Marketing",
                descricao: "Marketing digital e posicionamento de marcas com foco em comunicação clara."
            }, {
                nome: "Isabela Moda",
                categoria: "Moda",
                descricao: "Marca independente de roupas femininas com proposta autoral e modelagem inclusiva."
            }, {
                nome: "Juliana Beauty",
                categoria: "Beleza",
                descricao: "Cosméticos e cuidados pessoais com foco em inovação e experiência."
            }, {
                nome: "Karina Digital",
                categoria: "Tecnologia",
                descricao: "Produtos digitais e soluções inovadoras para fortalecer novas ideias."
            }, {
                nome: "Larissa Doces",
                categoria: "Gastronomia",
                descricao: "Doces artesanais e confeitaria com foco em encomendas e experiências."
            }, {
                nome: "Mariana Criativa",
                categoria: "Artesanato",
                descricao: "Produtos artesanais personalizados para presentes, eventos e decoração."
            }, {
                nome: "Natália Cursos",
                categoria: "Educação",
                descricao: "Cursos e conteúdos educacionais direcionados ao empreendedorismo feminino."
            }, {
                nome: "Olívia Negócios",
                categoria: "Negócios",
                descricao: "Estratégias de planejamento, organização e crescimento empresarial."
            }, {
                nome: "Paula Marketing",
                categoria: "Marketing",
                descricao: "Estratégias de comunicação e presença digital para pequenos negócios."
            }, {
                nome: "Renata Fashion",
                categoria: "Moda",
                descricao: "Moda autoral e coleções com foco em identidade, criatividade e tendências."
            }, {
                nome: "Sofia Beauty",
                categoria: "Beleza",
                descricao: "Cuidados pessoais e produtos de beleza voltados a uma rotina prática."
            }, {
                nome: "Tatiana Tech",
                categoria: "Tecnologia",
                descricao: "Tecnologia aplicada ao empreendedorismo, com foco em processos e automação."
            }, {
                nome: "Valentina Gourmet",
                categoria: "Gastronomia",
                descricao: "Culinária artesanal e experiências gastronômicas para diferentes ocasiões."
            }];

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
                return nome.trim().charAt(0).toUpperCase();
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

                    card.innerHTML = `
                        <div class="card-image ${variation === 1 ? "alt-1" : ""} ${variation === 2 ? "alt-2" : ""} ${variation === 3 ? "alt-3" : ""}">
                            <div class="card-orbit"></div>
                            <span class="card-badge">${item.categoria}</span>
                            <div class="card-initial">${primeiraLetra(item.nome)}</div>
                        </div>

                        <div class="card-info">
                            <div class="card-name">${item.nome}</div>
                            <div class="card-category">${item.categoria}</div>
                            <div class="card-description">${item.descricao}</div>
                            <div class="card-link">Ver detalhes</div>
                        </div>
                    `;

                    card.addEventListener("click", () => {
                        abrirModal(item);
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

                    const categoriaOk =
                        categoriaAtual === "Todos" ||
                        item.categoria === categoriaAtual;

                    const texto =
                        normalizar(
                            `${item.nome} ${item.categoria} ${item.descricao}`
                        );

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
               19. INICIALIZAÇÃO
            ============================================================= */
            atualizarCategoriasAtivas();
            filtrar();

        })();
   