const $ = id => document.getElementById(id);

        const PROJECT_KEY = "meusProjetos";
        const PROFILE_KEY = "perfilElas";
        const ACTIVITY_KEY = "atividadeElas";
        const GOAL_KEY = "metaPerfilElas";

        const tips = [
            "Uma ideia fica mais fácil de construir quando você transforma um pensamento em uma próxima ação pequena e concreta.",
            "Não procure começar perfeito: procure começar claro.",
            "Descrever o problema é metade do caminho para enxergar uma boa solução.",
            "Um projeto forte não precisa nascer grande; precisa nascer bem definido.",
            "Pergunte sempre: quem se beneficia quando essa ideia dá certo?"
        ];


        function projects() {

            try {

                return JSON.parse(
                    localStorage.getItem(PROJECT_KEY) || "[]"
                );

            } catch {

                return [];

            }

        }


        function profile() {

            try {

                return JSON.parse(
                    localStorage.getItem(PROFILE_KEY) || "{}"
                );

            } catch {

                return {};

            }

        }


        function activities() {

            try {

                return JSON.parse(
                    localStorage.getItem(ACTIVITY_KEY) || "[]"
                );

            } catch {

                return [];

            }

        }


        function saveActivities(list) {

            localStorage.setItem(
                ACTIVITY_KEY,
                JSON.stringify(list.slice(0, 20))
            );

        }


        function addActivity(text, icon = "✦") {

            const list = activities();

            list.unshift({
                text,
                icon,
                date: new Date().toLocaleDateString("pt-BR")
            });

            saveActivities(list);

            renderActivity();

        }


        function progressFor(p) {

            const stage =
                (p.stage || "Ideia").toLowerCase();

            if (
                stage.includes("consolid") ||
                stage.includes("vendas")
            ) {
                return 100;
            }

            if (stage.includes("andamento")) {
                return 75;
            }

            if (stage.includes("protótipo")) {
                return 55;
            }

            if (stage.includes("planejamento")) {
                return 30;
            }

            return 10;

        }


        function renderStats() {

            const ps = projects();

            $("projectCount").textContent =
                ps.length;

            $("activeCount").textContent =
                ps.filter(
                    p => ["Em andamento", "Primeiras vendas"]
                    .includes(p.stage)
                ).length;

            $("ideaCount").textContent =
                ps.filter(
                    p => p.stage === "Ideia"
                ).length;

            $("completedCount").textContent =
                ps.filter(
                    p => p.stage === "Consolidado"
                ).length;

            $("metaProjects").textContent =
                ps.length;

            $("metaIdeas").textContent =
                ps.filter(
                    p => p.stage === "Ideia"
                ).length;

            const avg = ps.length ?
                Math.round(
                    ps.reduce(
                        (a, p) =>
                        a + progressFor(p),
                        0
                    ) / ps.length
                ) :
                0;

            $("metaProgress").textContent =
                avg + "%";

        }


        function projectCard(p) {

            const pct = progressFor(p);

            const name =
                p.name || "Projeto sem nome";

            return `
                <article class="project-card">

                    <div class="project-top">

                        <span class="project-badge">
                            ${escapeHtml(
                                p.category || "Projeto"
                            )}
                        </span>

                        <span class="project-date">
                            ${
                                p.createdAt
                                    ? new Date(p.createdAt)
                                        .toLocaleDateString("pt-BR")
                                    : "Agora"
                            }
                        </span>

                    </div>

                    <div class="project-name">
                        ${escapeHtml(name)}
                    </div>

                    <p class="project-description">
                        ${escapeHtml(
                            p.description ||
                            "Sem descrição cadastrada."
                        )}
                    </p>

                    <div class="progress">
                        <span style="width:${pct}%"></span>
                    </div>

                    <div class="project-foot">

                        <span class="project-stage">
                            ${escapeHtml(
                                p.stage || "Ideia"
                            )} · ${pct}%
                        </span>

                        <div class="project-actions">

                            <button
                                class="icon-action"
                                data-view="${escapeHtml(p.id)}"
                                title="Ver">
                                ↗
                            </button>

                            <button
                                class="icon-action"
                                data-delete="${escapeHtml(p.id)}"
                                title="Excluir">
                                ×
                            </button>

                        </div>

                    </div>

                </article>
            `;

        }


        function renderProjects() {

            const ps = projects();

            const grid =
                $("projectsGrid");

            if (!ps.length) {

                grid.innerHTML = `

                    <div
                        class="empty"
                        style="grid-column:1/-1">

                        <h3>
                            Seu primeiro projeto pode começar aqui.
                        </h3>

                        <p>
                            Crie uma ideia, registre o que você já sabe
                            e deixe o restante para desenvolver aos poucos.
                        </p>

                        <button
                            class="btn primary"
                            style="margin-top:14px"
                            onclick="goProject()">
                            Criar meu projeto
                        </button>

                    </div>

                `;

            } else {

                grid.innerHTML =
                    ps.map(projectCard).join("");

            }

            bindProjectActions();

            const recent =
                $("recentProjects");

            recent.innerHTML =
                ps.slice(0, 3).map(p => `

                    <div
                        class="right-project"
                        data-recent="${escapeHtml(p.id)}">

                        <div class="right-project-top">

                            <strong>
                                ${escapeHtml(
                                    p.name || "Projeto"
                                )}
                            </strong>

                            <small>
                                ${escapeHtml(
                                    p.stage || "Ideia"
                                )}
                            </small>

                        </div>

                        <p>
                            ${escapeHtml(
                                p.description ||
                                "Sem descrição"
                            )}
                        </p>

                        <div class="mini-bar">

                            <span
                                style="width:${progressFor(p)}%">
                            </span>

                        </div>

                    </div>

                `).join("") ||

                `

                    <div class="right-project">

                        <strong>
                            Nenhum projeto ainda
                        </strong>

                        <p>
                            Use "Novo projeto" para começar.
                        </p>

                    </div>

                `;


            recent
                .querySelectorAll("[data-recent]")
                .forEach(element => {

                    element.addEventListener(
                        "click",
                        () =>
                        viewProject(
                            element.dataset.recent
                        )
                    );

                });


            renderStats();

        }


        function bindProjectActions() {

            document
                .querySelectorAll("[data-view]")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            viewProject(
                                button.dataset.view
                            );

                        }
                    );

                });


            document
                .querySelectorAll("[data-delete]")
                .forEach(button => {

                    button.addEventListener(
                        "click",
                        event => {

                            event.stopPropagation();

                            const id =
                                button.dataset.delete;

                            const p =
                                projects().find(
                                    x => String(x.id) === String(id)
                                );

                            if (!p) return;

                            if (
                                confirm(
                                    `Excluir o projeto "${p.name || "sem nome"}"?`
                                )
                            ) {

                                localStorage.setItem(
                                    PROJECT_KEY,
                                    JSON.stringify(
                                        projects().filter(
                                            x =>
                                            String(x.id) !==
                                            String(id)
                                        )
                                    )
                                );

                                addActivity(
                                    `Projeto excluído: ${
                                        p.name || "sem nome"
                                    }`,
                                    "×"
                                );

                                toast("Projeto excluído");

                                renderProjects();

                            }

                        }
                    );

                });

        }


        function viewProject(id) {

            const p =
                projects().find(
                    x => String(x.id) === String(id)
                );

            if (!p) return;

            const rows = [
                ["Categoria", p.category],
                ["Fase", p.stage],
                ["Público-alvo", p.audience],
                ["Objetivo", p.goal],
                ["Problema", p.problem],
                ["Solução", p.solution],
                ["Diferencial", p.differential]
            ];


            $("projectModalContent").innerHTML = `

                <div style="margin-top:16px">

                    <div class="project-badge">
                        ${escapeHtml(
                            p.category || "Projeto"
                        )}
                    </div>

                    <h3 style="
                        font-family:'DM Serif Display',Georgia,serif;
                        font-weight:400;
                        font-size:31px;
                        color:#705661;
                        margin-top:10px;
                    ">
                        ${escapeHtml(
                            p.name || "Projeto"
                        )}
                    </h3>

                    <p style="
                        margin-top:9px;
                        color:#7d6d74;
                        font-size:11px;
                        line-height:1.7;
                    ">
                        ${escapeHtml(
                            p.description || ""
                        )}
                    </p>

                    ${rows.map(row => `

                        <div style="
                            padding:11px 0;
                            border-bottom:1px solid #eee1df;
                        ">

                            <div style="
                                font-size:8px;
                                font-weight:800;
                                letter-spacing:.08em;
                                text-transform:uppercase;
                                color:#99858d;
                            ">
                                ${escapeHtml(row[0])}
                            </div>

                            <div style="
                                margin-top:4px;
                                font-size:10px;
                                line-height:1.5;
                                color:#705f67;
                            ">
                                ${escapeHtml(
                                    row[1] ||
                                    "Não informado"
                                )}
                            </div>

                        </div>

                    `).join("")}

                    <div style="margin-top:14px">

                        <button
                            class="btn secondary"
                            onclick="closeProjectModal()">
                            Fechar
                        </button>

                    </div>

                </div>

            `;


            $("projectModal")
                .classList.add("show");

        }


        function renderActivity() {

            const list =
                $("activityList");

            const items =
                activities();

            list.innerHTML =
                items.map(a => `

                    <div class="activity">

                        <div class="activity-icon">
                            ${escapeHtml(
                                a.icon || "✦"
                            )}
                        </div>

                        <div>

                            <strong>
                                ${escapeHtml(
                                    a.text
                                )}
                            </strong>

                            <span>
                                Atividade registrada no seu espaço
                            </span>

                        </div>

                        <time>
                            ${escapeHtml(
                                a.date || ""
                            )}
                        </time>

                    </div>

                `).join("")

                ||

                `

                    <div class="empty">

                        <h3>
                            Nada por aqui ainda.
                        </h3>

                        <p>
                            Suas ações com projetos e perfil
                            aparecerão nesta área.
                        </p>

                    </div>

                `;

        }


        function loadProfile() {

            const p = profile();

            const name =
                p.name ||
                "Elas Empreendedoras";

            const username =
                p.username ||
                "@elasempreendedoras";

            const cat =
                p.category ||
                "Empreendedorismo feminino";

            const bio =
                p.bio ||
                "Organizando ideias, aprendizados e projetos para transformar inspiração em possibilidade.";


            $("profileName").textContent =
                name;

            $("profileUsername").textContent =
                username.startsWith("@")
                    ? username
                    : "@" + username;

            $("profileCategory").textContent =
                cat;

            $("profileBio").textContent =
                bio;

            $("avatarLetter").textContent =
                (name.trim()[0] || "E")
                    .toUpperCase();

            $("aboutText").textContent =
                p.about ||
                "Use a edição do perfil para contar um pouco sobre você, seus interesses e o que deseja construir.";

            $("aboutArea").textContent =
                cat;

            $("aboutLocation").textContent =
                p.location ||
                "Local não informado";

            $("aboutHandle").textContent =
                $("profileUsername").textContent;

            $("editName").value =
                name;

            $("editUsername").value =
                $("profileUsername").textContent;

            $("editCategory").value =
                cat;

            $("editLocation").value =
                p.location || "";

            $("editBio").value =
                bio;

            $("editAbout").value =
                p.about || "";

        }


        function openProfileModal() {

            $("profileModal")
                .classList.add("show");

        }


        function closeProfileModal() {

            $("profileModal")
                .classList.remove("show");

        }


        function closeProjectModal() {

            $("projectModal")
                .classList.remove("show");

        }


        function updateGoal() {

            const boxes = [
                ...document.querySelectorAll(
                    "[data-goal]"
                )
            ];

            const done =
                boxes.filter(
                    box => box.checked
                ).length;

            const pct =
                Math.round(
                    done / 4 * 100
                );

            $("goalBar").style.width =
                pct + "%";

            $("goalPercent").textContent =
                pct + "%";

            $("goalText").textContent =
                `${done} de 4 etapas`;

            localStorage.setItem(
                GOAL_KEY,
                JSON.stringify(
                    boxes.map(
                        box => box.checked
                    )
                )
            );

        }


        function loadGoal() {

            let saved = [];

            try {

                saved =
                    JSON.parse(
                        localStorage.getItem(
                            GOAL_KEY
                        ) || "[]"
                    );

            } catch {

                saved = [];

            }


            document
                .querySelectorAll("[data-goal]")
                .forEach(
                    (box, index) => {

                        box.checked =
                            Boolean(saved[index]);

                    }
                );

            updateGoal();

        }


        function escapeHtml(value) {

            return String(
                value ?? ""
            ).replace(
                /[&<>'"]/g,
                char => ({
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    "'": "&#39;",
                    '"': "&quot;"
                }[char])
            );

        }


        function toast(message) {

            const t =
                $("toast");

            t.textContent =
                message;

            t.classList.add("show");

            clearTimeout(
                window.__toast
            );

            window.__toast =
                setTimeout(
                    () =>
                        t.classList.remove(
                            "show"
                        ),
                    2500
                );

        }


        function goProject() {

            window.location.href =
                "meu-projeto.html";

        }


        function goHome() {

            window.location.href =
                "home.html";

        }


        /* =========================================================
           EVENTOS
           ========================================================= */

        $("newProjectBtn")
            .addEventListener(
                "click",
                goProject
            );

        $("emptyCreateBtn")
            .addEventListener(
                "click",
                goProject
            );

        $("quickProject")
            .addEventListener(
                "click",
                goProject
            );

        $("quickHome")
            .addEventListener(
                "click",
                goHome
            );

        $("quickProfile")
            .addEventListener(
                "click",
                openProfileModal
            );

        $("quickScroll")
            .addEventListener(
                "click",
                () => {

                    $("projects")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );


        $("seeAll")
            .addEventListener(
                "click",
                () => {

                    document
                        .querySelector(
                            '[data-tab="projects"]'
                        )
                        .click();

                    $("projects")
                        .scrollIntoView({
                            behavior: "smooth"
                        });

                }
            );


        $("editProfileBtn")
            .addEventListener(
                "click",
                openProfileModal
            );

        $("editProfileBtn2")
            .addEventListener(
                "click",
                openProfileModal
            );


        $("closeProfile")
            .addEventListener(
                "click",
                closeProfileModal
            );

        $("cancelProfile")
            .addEventListener(
                "click",
                closeProfileModal
            );

        $("closeProject")
            .addEventListener(
                "click",
                closeProjectModal
            );


        $("shareProfileBtn")
            .addEventListener(
                "click",
                async () => {

                    try {

                        await navigator.clipboard.writeText(
                            location.href
                        );

                        toast(
                            "Link do perfil copiado ♡"
                        );

                    } catch {

                        toast(
                            "Não foi possível copiar o link"
                        );

                    }

                }
            );


        $("resetGoal")
            .addEventListener(
                "click",
                () => {

                    localStorage.removeItem(
                        GOAL_KEY
                    );

                    loadGoal();

                    toast(
                        "Meta reiniciada"
                    );

                }
            );


        $("saveProfile")
            .addEventListener(
                "click",
                () => {

                    const p = {

                        name:
                            $("editName")
                                .value
                                .trim()
                            ||
                            "Elas Empreendedoras",

                        username:
                            $("editUsername")
                                .value
                                .trim()
                            ||
                            "@elasempreendedoras",

                        category:
                            $("editCategory")
                                .value
                                .trim()
                            ||
                            "Empreendedorismo feminino",

                        location:
                            $("editLocation")
                                .value
                                .trim(),

                        bio:
                            $("editBio")
                                .value
                                .trim(),

                        about:
                            $("editAbout")
                                .value
                                .trim()

                    };


                    localStorage.setItem(
                        PROFILE_KEY,
                        JSON.stringify(p)
                    );


                    loadProfile();

                    addActivity(
                        "Perfil atualizado",
                        "✎"
                    );

                    closeProfileModal();

                    toast(
                        "Perfil atualizado ♡"
                    );

                }
            );


        document
            .querySelectorAll(".tab")
            .forEach(tab => {

                tab.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(".tab")
                            .forEach(t =>
                                t.classList.remove(
                                    "active"
                                )
                            );

                        document
                            .querySelectorAll(
                                ".tab-content"
                            )
                            .forEach(c =>
                                c.classList.remove(
                                    "active"
                                )
                            );

                        tab.classList.add(
                            "active"
                        );

                        $(tab.dataset.tab)
                            .classList.add(
                                "active"
                            );

                    }
                );

            });


        document
            .querySelectorAll("[data-goal]")
            .forEach(box => {

                box.addEventListener(
                    "change",
                    updateGoal
                );

            });


        $("searchInput")
            .addEventListener(
                "input",
                () => {

                    const q =
                        $("searchInput")
                            .value
                            .trim()
                            .toLowerCase();

                    if (!q) return;


                    const match =
                        projects().find(
                            p =>
                                (p.name || "")
                                    .toLowerCase()
                                    .includes(q) ||

                                (p.category || "")
                                    .toLowerCase()
                                    .includes(q) ||

                                (p.description || "")
                                    .toLowerCase()
                                    .includes(q)
                        );


                    if (match) {

                        document
                            .querySelector(
                                '[data-tab="projects"]'
                            )
                            .click();

                        setTimeout(
                            () =>
                                viewProject(
                                    match.id
                                ),
                            150
                        );

                    }

                }
            );


        $("profileModal")
            .addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        $("profileModal")
                    ) {

                        closeProfileModal();

                    }

                }
            );


        $("projectModal")
            .addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        $("projectModal")
                    ) {

                        closeProjectModal();

                    }

                }
            );


        /* =========================================================
           INICIALIZAÇÃO
           ========================================================= */

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                $("dailyTip").textContent =
                    tips[
                        new Date().getDate()
                        % tips.length
                    ];

                loadProfile();
                renderProjects();
                renderActivity();
                loadGoal();

            }
        );