(function() {
    const menuMarkup = `
        <div class="menu-backdrop" id="menuBackdrop"></div>

        <aside class="side-menu" id="sideMenu" aria-label="Menu principal" aria-hidden="true">

            <div class="menu-head">
                <div class="menu-brand">
                    <div class="menu-brand-mark">E</div>

                    <div>
                        <strong>Elas Empreendedoras</strong>
                        <span>Central de navegação</span>
                    </div>
                </div>

                <button
                    class="menu-close"
                    id="menuClose"
                    type="button"
                    aria-label="Fechar menu"
                >×</button>
            </div>

            <div class="menu-intro">
                <strong>Uma plataforma feita para descobrir caminhos.</strong>

                <p>
                    Acesse as principais áreas do projeto, organize sua navegação
                    e explore conteúdos sobre empreendedorismo feminino.
                </p>
            </div>

            <section class="menu-section">

                <div class="menu-section-title">
                    Navegação principal
                </div>

                <button
                    class="menu-item"
                    type="button"
                    data-menu-scroll="top"
                >
                    <span class="menu-icon">01</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">Início</span>
                        <span class="menu-item-sub">
                            Voltar para a apresentação
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </button>

                <button
                    class="menu-item"
                    type="button"
                    data-menu-scroll="destaques"
                >
                    <span class="menu-icon">02</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">Empreendedoras</span>
                        <span class="menu-item-sub">
                            Conheça os perfis disponíveis
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </button>

                <button
                    class="menu-item"
                    type="button"
                    data-menu-scroll="locais"
                >
                    <span class="menu-icon">03</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">Locais</span>
                        <span class="menu-item-sub">
                            Explore áreas de atuação
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </button>

                <a class="menu-item" href="palestrantes.html">
                    <span class="menu-icon">04</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">Palestrantes</span>
                        <span class="menu-item-sub">
                            Acesse seus conteúdos salvos
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </a>

                <a class="menu-item" href="meuprojeto.html">
                    <span class="menu-icon">05</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">Meu Projeto</span>
                        <span class="menu-item-sub">
                            Acesse seus projetos salvos
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </a>

            </section>

            <section class="menu-section">

                <div class="menu-section-title">
                    Conteúdos
                </div>

                <a class="menu-item" href="biblioteca.html">
                    <span class="menu-icon">06</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">
                            Biblioteca de livros
                        </span>

                        <span class="menu-item-sub">
                            Conhecimento sobre empreendedorismo feminino
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </a>

                <button
                    class="menu-item"
                    id="categoriesMenuToggle"
                    type="button"
                    aria-expanded="false"
                    aria-controls="categoriesSubmenu"
                >
                    <span class="menu-icon">07</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">
                            Todas as categorias
                        </span>

                        <span class="menu-item-sub">
                            Abra a navegação por áreas
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </button>

                <div class="menu-submenu" id="categoriesSubmenu">

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Moda"
                    >
                        Moda
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Beleza"
                    >
                        Beleza
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Tecnologia"
                    >
                        Tecnologia
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Gastronomia"
                    >
                        Gastronomia
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Artesanato"
                    >
                        Artesanato
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Educação"
                    >
                        Educação
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Negócios"
                    >
                        Negócios
                    </button>

                    <button
                        class="menu-subitem"
                        type="button"
                        data-menu-category="Marketing"
                    >
                        Marketing
                    </button>

                </div>

                <a class="menu-item" href="sobre.html">
                    <span class="menu-icon">08</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">
                            Sobre o projeto
                        </span>

                        <span class="menu-item-sub">
                            Conheça a proposta e a equipe
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </a>

            </section>

            <section class="menu-section">

                <div class="menu-section-title">
                    Conta
                </div>

                <a class="menu-item" href="perfil.html">
                    <span class="menu-icon">09</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">
                            Meu perfil
                        </span>

                        <span class="menu-item-sub">
                            Visualize sua área pessoal
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </a>

                <a class="menu-item" href="login.html">
                    <span class="menu-icon">10</span>

                    <span class="menu-item-text">
                        <span class="menu-item-title">
                            Encerrar sessão
                        </span>

                        <span class="menu-item-sub">
                            Sair do acesso atual
                        </span>
                    </span>

                    <span class="menu-chevron">›</span>
                </a>

            </section>

        </aside>
    `;

    function initMenu() {
        const target = document.getElementById("sharedMenu");

        if (!target) return;

        target.innerHTML = menuMarkup;

        const sideMenu = document.getElementById("sideMenu");
        const menuBackdrop = document.getElementById("menuBackdrop");
        const menuButton = document.getElementById("menuButton");
        const menuClose = document.getElementById("menuClose");

        const categoriesMenuToggle =
            document.getElementById("categoriesMenuToggle");

        const categoriesSubmenu =
            document.getElementById("categoriesSubmenu");

        const menuCategoryButtons =
            Array.from(
                document.querySelectorAll("[data-menu-category]")
            );

        function openMenu() {
            if (!sideMenu || !menuBackdrop || !menuButton) return;

            sideMenu.classList.add("open");
            menuBackdrop.classList.add("show");
            menuButton.classList.add("menu-open");

            menuButton.setAttribute(
                "aria-expanded",
                "true"
            );

            sideMenu.setAttribute(
                "aria-hidden",
                "false"
            );

            document.body.style.overflow = "hidden";
        }

        function closeMenu() {
            if (!sideMenu || !menuBackdrop || !menuButton) return;

            sideMenu.classList.remove("open");
            menuBackdrop.classList.remove("show");
            menuButton.classList.remove("menu-open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

            sideMenu.setAttribute(
                "aria-hidden",
                "true"
            );

            document.body.style.overflow = "";
        }

        if (menuButton) {
            menuButton.addEventListener("click", () => {

                if (
                    sideMenu &&
                    sideMenu.classList.contains("open")
                ) {
                    closeMenu();
                } else {
                    openMenu();
                }

            });
        }

        if (menuClose) {
            menuClose.addEventListener(
                "click",
                closeMenu
            );
        }

        if (menuBackdrop) {
            menuBackdrop.addEventListener(
                "click",
                closeMenu
            );
        }

        if (
            categoriesMenuToggle &&
            categoriesSubmenu
        ) {

            categoriesMenuToggle.addEventListener(
                "click",
                () => {

                    const opened =
                        categoriesSubmenu.classList.toggle("open");

                    categoriesMenuToggle.classList.toggle(
                        "open",
                        opened
                    );

                    categoriesMenuToggle.setAttribute(
                        "aria-expanded",
                        String(opened)
                    );

                }
            );

        }

        menuCategoryButtons.forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const categoria =
                        button.dataset.menuCategory;

                    window.location.href =
                        `home.html?categoria=${encodeURIComponent(categoria)}#destaques`;

                }
            );

        });

        document
            .querySelectorAll("[data-menu-scroll]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const destino =
                            button.dataset.menuScroll;

                        closeMenu();

                        if (destino === "top") {
                            window.location.href =
                                "home.html";
                            return;
                        }

                        if (destino === "destaques") {
                            window.location.href =
                                "mulheres.html";
                            return;
                        }

                        if (destino === "locais") {
                            window.location.href =
                                "locais.html";
                            return;
                        }

                    }
                );

            });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initMenu
        );
    } else {
        initMenu();
    }

})();