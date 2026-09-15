 <!-- =========================================================
         JAVASCRIPT DA BIBLIOTECA
    ========================================================== -->

    <script>
        (() => {

            "use strict";


            /* =========================================================
               DADOS
            ========================================================== */

            const livros = [

                {
                    id: 1,
                    titulo: "Comece Onde Está",
                    autora: "Cleone",
                    categoria: "Inspiração",
                    descricao: "Uma leitura para quem precisa transformar a ideia de começar em uma decisão possível.",
                    cor: "c1",
                    destaque: true
                },

                {
                    id: 2,
                    titulo: "Mulheres que Lideram",
                    autora: "Ana Martins",
                    categoria: "Liderança",
                    descricao: "Reflexões sobre liderança, posicionamento e construção de confiança.",
                    cor: "c2",
                    destaque: true
                },

                {
                    id: 3,
                    titulo: "Negócio com Propósito",
                    autora: "Marina Costa",
                    categoria: "Gestão",
                    descricao: "Estratégias para conectar propósito, organização e crescimento.",
                    cor: "c3",
                    destaque: true
                },

                {
                    id: 4,
                    titulo: "A Arte de Empreender",
                    autora: "Luiza Ferreira",
                    categoria: "Gestão",
                    descricao: "Uma introdução leve à visão estratégica necessária para empreender.",
                    cor: "c4"
                },

                {
                    id: 5,
                    titulo: "Marca que Fala",
                    autora: "Helena Souza",
                    categoria: "Marketing",
                    descricao: "Como transformar identidade em comunicação clara e memorável.",
                    cor: "c5"
                },

                {
                    id: 6,
                    titulo: "Dinheiro sem Medo",
                    autora: "Paula Ribeiro",
                    categoria: "Finanças",
                    descricao: "Princípios para olhar para dinheiro, planejamento e decisões com mais segurança.",
                    cor: "c1"
                },

                {
                    id: 7,
                    titulo: "Elas Fazem Acontecer",
                    autora: "Carolina Mendes",
                    categoria: "Histórias",
                    descricao: "Trajetórias inspiradoras de mulheres que transformaram ideias em negócios.",
                    cor: "c2"
                },

                {
                    id: 8,
                    titulo: "Conectadas",
                    autora: "Rafaela Lima",
                    categoria: "Tecnologia",
                    descricao: "Tecnologia, presença digital e novas possibilidades para pequenas iniciativas.",
                    cor: "c3"
                },

                {
                    id: 9,
                    titulo: "A Coragem de Liderar",
                    autora: "Beatriz Nunes",
                    categoria: "Liderança",
                    descricao: "Uma leitura sobre decisões difíceis, confiança e liderança humana.",
                    cor: "c4"
                },

                {
                    id: 10,
                    titulo: "Manual da Primeira Ideia",
                    autora: "Isabela Torres",
                    categoria: "Inspiração",
                    descricao: "Do pensamento inicial ao primeiro plano de ação.",
                    cor: "c5"
                },

                {
                    id: 11,
                    titulo: "Marketing com Identidade",
                    autora: "Juliana Alves",
                    categoria: "Marketing",
                    descricao: "Posicionamento e comunicação para marcas que desejam ser lembradas.",
                    cor: "c1"
                },

                {
                    id: 12,
                    titulo: "Visão de Futuro",
                    autora: "Camila Rocha",
                    categoria: "Tecnologia",
                    descricao: "Inovação, adaptação e construção de projetos preparados para o futuro.",
                    cor: "c2"
                }

            ];


            /* =========================================================
               ELEMENTOS
            ========================================================== */

            const searchForm =
                document.getElementById("searchForm");

            const searchInput =
                document.getElementById("searchInput");

            const navPills = [
                ...document.querySelectorAll(".nav-pill")
            ];

            const featuredGrid =
                document.getElementById("featuredGrid");

            const libraryGrid =
                document.getElementById("libraryGrid");

            const resultCount =
                document.getElementById("resultCount");

            const sortSelect =
                document.getElementById("sortSelect");

            const modalLayer =
                document.getElementById("modalLayer");

            const modalClose =
                document.getElementById("modalClose");

            const closeModalSecondary =
                document.getElementById("closeModalSecondary");

            const modalKicker =
                document.getElementById("modalKicker");

            const modalTitle =
                document.getElementById("modalTitle");

            const modalAuthor =
                document.getElementById("modalAuthor");

            const modalDescription =
                document.getElementById("modalDescription");

            const modalCover =
                document.getElementById("modalCover");

            const modalCoverType =
                document.getElementById("modalCoverType");

            const modalCoverTitle =
                document.getElementById("modalCoverTitle");

            const modalCoverAuthor =
                document.getElementById("modalCoverAuthor");

            const saveModal =
                document.getElementById("saveModal");


            let categoriaAtual = "Todos";
            let livroAtual = null;


            /* =========================================================
               FAVORITOS
            ========================================================== */

            function getFavorites() {

                try {

                    return JSON.parse(
                        localStorage.getItem(
                            "elasBibliotecaFavoritos"
                        ) || "[]"
                    );

                } catch (error) {

                    return [];

                }
            }


            function isFavorite(id) {

                return getFavorites().includes(id);

            }


            function toggleFavorite(id) {

                const favoritos =
                    getFavorites();

                const index =
                    favoritos.indexOf(id);


                if (index >= 0) {

                    favoritos.splice(index, 1);

                } else {

                    favoritos.push(id);

                }


                localStorage.setItem(
                    "elasBibliotecaFavoritos",
                    JSON.stringify(favoritos)
                );


                renderLibrary();


                if (livroAtual && livroAtual.id === id) {

                    saveModal.textContent =
                        isFavorite(id) ?
                        "Remover dos favoritos" :
                        "Salvar nos favoritos";

                }

            }


            /* =========================================================
               UTILIDADES
            ========================================================== */

            function normalizar(texto) {

                return String(texto)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .trim();

            }


            function getFilteredBooks() {

                const termo =
                    normalizar(searchInput.value);


                return livros.filter(livro => {

                    const categoriaOk =
                        categoriaAtual === "Todos" ||
                        livro.categoria === categoriaAtual;


                    const buscaOk = !termo ||
                        normalizar(
                            `${livro.titulo} ${livro.autora} ${livro.categoria} ${livro.descricao}`
                        ).includes(termo);


                    return categoriaOk && buscaOk;

                });

            }


            /* =========================================================
               CARD
            ========================================================== */

            function criarCard(livro, indice) {

                const card =
                    document.createElement("article");

                card.className =
                    "library-card";


                const favorito =
                    isFavorite(livro.id);


                card.innerHTML = `

                    <div class="mini-cover ${livro.cor}">

                        <div class="mini-number">
                            ELAS · ${String(indice + 1).padStart(2, "0")}
                        </div>

                        <div class="mini-title">
                            ${livro.titulo}
                        </div>

                        <div class="mini-author">
                            ${livro.autora}
                        </div>

                    </div>


                    <div class="library-info">

                        <div class="library-title">
                            ${livro.titulo}
                        </div>

                        <div class="library-meta">
                            ${livro.categoria}
                        </div>

                        <div class="library-desc">
                            ${livro.descricao}
                        </div>

                        <div class="library-footer">

                            <span class="read-tag">
                                Ver detalhes
                            </span>

                            <button
                                class="bookmark ${favorito ? "saved" : ""}"
                                type="button"
                                aria-label="${
                                    favorito
                                        ? "Remover dos favoritos"
                                        : "Salvar nos favoritos"
                                }"
                                title="${
                                    favorito
                                        ? "Remover dos favoritos"
                                        : "Salvar nos favoritos"
                                }"
                            >
                                ${favorito ? "♥" : "♡"}
                            </button>

                        </div>

                    </div>

                `;


                card.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest(".bookmark")
                        ) {
                            return;
                        }

                        abrirModal(livro);

                    }
                );


                const bookmark =
                    card.querySelector(".bookmark");


                bookmark.addEventListener(
                    "click",
                    () => {
                        toggleFavorite(livro.id);
                    }
                );


                return card;

            }


            /* =========================================================
               DESTAQUES
            ========================================================== */

            function renderFeatured() {

                featuredGrid.innerHTML = "";


                livros
                    .filter(livro => livro.destaque)
                    .forEach((livro, index) => {

                        const card =
                            document.createElement("article");

                        card.className =
                            "book-card";


                        card.innerHTML = `

                            <div class="book-cover ${livro.cor}">

                                <div class="cover-series">
                                    Biblioteca · ${String(index + 1).padStart(2, "0")}
                                </div>

                                <div class="cover-line"></div>

                                <div class="cover-title">
                                    ${livro.titulo}
                                </div>

                                <div class="cover-author">
                                    ${livro.autora}
                                </div>

                            </div>


                            <div class="book-info">

                                <span class="badge">
                                    ${livro.categoria}
                                </span>

                                <div class="book-name">
                                    ${livro.titulo}
                                </div>

                                <div class="book-author">
                                    ${livro.autora}
                                </div>

                                <div class="book-desc">
                                    ${livro.descricao}
                                </div>

                                <div class="book-bottom">

                                    <span class="rating">
                                        ★ Curadoria
                                    </span>

                                    <span class="read-link">
                                        Abrir →
                                    </span>

                                </div>

                            </div>

                        `;


                        card.addEventListener(
                            "click",
                            () => abrirModal(livro)
                        );


                        featuredGrid.appendChild(card);

                    });

            }


            /* =========================================================
               BIBLIOTECA
            ========================================================== */

            function renderLibrary() {

                let lista =
                    getFilteredBooks();


                switch (sortSelect.value) {

                    case "az":

                        lista.sort(
                            (a, b) =>
                            a.titulo.localeCompare(
                                b.titulo,
                                "pt-BR"
                            )
                        );

                        break;


                    case "za":

                        lista.sort(
                            (a, b) =>
                            b.titulo.localeCompare(
                                a.titulo,
                                "pt-BR"
                            )
                        );

                        break;


                    case "author":

                        lista.sort(
                            (a, b) =>
                            a.autora.localeCompare(
                                b.autora,
                                "pt-BR"
                            )
                        );

                        break;


                    default:

                        lista.sort(
                            (a, b) =>
                            Number(b.destaque) -
                            Number(a.destaque)
                        );

                }


                libraryGrid.innerHTML = "";


                lista.forEach(
                    (livro, index) => {

                        libraryGrid.appendChild(
                            criarCard(livro, index)
                        );

                    }
                );


                const qtd =
                    lista.length;


                resultCount.innerHTML = `

                    <strong>${qtd}</strong>

                    ${
                        qtd === 1
                            ? "título encontrado"
                            : "títulos encontrados"
                    }

                `;

            }


            /* =========================================================
               NAVEGAÇÃO POR CATEGORIA
            ========================================================== */

            navPills.forEach(pill => {

                pill.addEventListener(
                    "click",
                    () => {

                        navPills.forEach(
                            p =>
                            p.classList.remove("active")
                        );


                        pill.classList.add("active");


                        categoriaAtual =
                            pill.dataset.filter;


                        renderLibrary();


                        document
                            .getElementById("catalogo")
                            .scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });

                    }
                );

            });


            /* =========================================================
               PESQUISA
            ========================================================== */

            searchInput.addEventListener(
                "input",
                renderLibrary
            );


            searchForm.addEventListener(
                "submit",
                event => {

                    event.preventDefault();


                    renderLibrary();


                    document
                        .getElementById("catalogo")
                        .scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                }
            );


            sortSelect.addEventListener(
                "change",
                renderLibrary
            );


            /* =========================================================
               MODAL
            ========================================================== */

            function abrirModal(livro) {

                livroAtual =
                    livro;


                modalKicker.textContent =
                    livro.categoria;

                modalTitle.textContent =
                    livro.titulo;

                modalAuthor.textContent =
                    livro.autora;

                modalDescription.textContent =
                    livro.descricao;


                modalCover.className =
                    `modal-cover ${livro.cor}`;


                modalCoverType.textContent =
                    livro.categoria;

                modalCoverTitle.textContent =
                    livro.titulo;

                modalCoverAuthor.textContent =
                    livro.autora;


                saveModal.textContent =
                    isFavorite(livro.id) ?
                    "Remover dos favoritos" :
                    "Salvar nos favoritos";


                modalLayer.classList.add("show");


                document.body.style.overflow =
                    "hidden";


                modalClose.focus();

            }


            function fecharModal() {

                modalLayer.classList.remove(
                    "show"
                );


                document.body.style.overflow =
                    "";


                livroAtual =
                    null;

            }


            modalClose.addEventListener(
                "click",
                fecharModal
            );


            closeModalSecondary.addEventListener(
                "click",
                fecharModal
            );


            modalLayer.addEventListener(
                "click",
                event => {

                    if (
                        event.target === modalLayer
                    ) {

                        fecharModal();

                    }

                }
            );


            saveModal.addEventListener(
                "click",
                () => {

                    if (!livroAtual) {
                        return;
                    }


                    toggleFavorite(
                        livroAtual.id
                    );

                }
            );


            /* =========================================================
               FECHAR MENU PADRÃO
               O menu é criado pelo menu-loader.js.
            ========================================================== */

            function fecharMenuPadrao() {

                const sideMenu =
                    document.getElementById("sideMenu");

                const menuBackdrop =
                    document.getElementById("menuBackdrop");


                if (sideMenu) {
                    sideMenu.classList.remove("open");
                    sideMenu.setAttribute(
                        "aria-hidden",
                        "true"
                    );
                }


                if (menuBackdrop) {
                    menuBackdrop.classList.remove("show");
                }


                const menuButton =
                    document.getElementById("menuButton");


                if (menuButton) {
                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            }


            /* =========================================================
               FAVORITOS
            ========================================================== */

            function mostrarFavoritos() {

                const favoritos =
                    getFavorites();


                categoriaAtual =
                    "Todos";


                searchInput.value =
                    "";


                navPills.forEach(p => {

                    p.classList.toggle(
                        "active",
                        p.dataset.filter === "Todos"
                    );

                });


                const lista =
                    livros.filter(
                        livro =>
                        favoritos.includes(livro.id)
                    );


                libraryGrid.innerHTML =
                    "";


                lista.forEach(
                    (livro, index) => {

                        libraryGrid.appendChild(
                            criarCard(livro, index)
                        );

                    }
                );


                resultCount.innerHTML = `

                    <strong>${lista.length}</strong>

                    ${
                        lista.length === 1
                            ? "favorito"
                            : "favoritos"
                    }

                `;


                fecharMenuPadrao();


                document
                    .getElementById("catalogo")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }


            document
                .getElementById("favoritesButton")
                .addEventListener(
                    "click",
                    mostrarFavoritos
                );


            document
                .getElementById("favoritesHeroButton")
                .addEventListener(
                    "click",
                    mostrarFavoritos
                );


            /* =========================================================
               LEITURA SURPRESA
            ========================================================== */

            function leituraSurpresa() {

                const escolhido =
                    livros[
                        Math.floor(
                            Math.random() *
                            livros.length
                        )
                    ];


                fecharMenuPadrao();

                abrirModal(escolhido);

            }


            document
                .getElementById("discoverButton")
                .addEventListener(
                    "click",
                    leituraSurpresa
                );


            /* =========================================================
               CAMINHOS
            ========================================================== */

            document
                .querySelectorAll(
                    ".path-card[data-path]"
                )
                .forEach(card => {

                    card.addEventListener(
                        "click",
                        () => {

                            categoriaAtual =
                                card.dataset.path;


                            searchInput.value =
                                "";


                            navPills.forEach(p => {

                                p.classList.toggle(
                                    "active",
                                    p.dataset.filter ===
                                    categoriaAtual
                                );

                            });


                            renderLibrary();


                            document
                                .getElementById("catalogo")
                                .scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });

                        }
                    );

                });


            /* =========================================================
               HOME
            ========================================================== */

            document
                .getElementById("homeButton")
                .addEventListener(
                    "click",
                    () => {

                        window.location.href =
                            "home.html";

                    }
                );


            /* =========================================================
               ESC
            ========================================================== */

            document.addEventListener(
                "keydown",
                event => {

                    if (event.key !== "Escape") {
                        return;
                    }


                    if (
                        modalLayer.classList.contains("show")
                    ) {

                        fecharModal();

                    }


                    const sideMenu =
                        document.getElementById("sideMenu");


                    if (
                        sideMenu &&
                        sideMenu.classList.contains("open")
                    ) {

                        fecharMenuPadrao();

                    }

                }
            );


            /* =========================================================
               INIT
            ========================================================== */

            renderFeatured();

            renderLibrary();

        })();
    </script>


    <!-- =========================================================
         MENU GLOBAL DO SITE
         DEVE FICAR DEPOIS DO HTML DO #sharedMenu
    ========================================================== -->

    <script src="menu-loader.js"></script>