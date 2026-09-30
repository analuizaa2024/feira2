function abrir(card) {

            document
                .getElementById("modalTitle")
                .textContent =
                card.dataset.title;


            document
                .getElementById("modalSubtitle")
                .textContent =
                card.dataset.subtitle;


            document
                .getElementById("modalDescription")
                .textContent =
                card.dataset.description;


            document
                .getElementById("overlay")
                .classList.add("show");

        }


        function fechar() {

            document
                .getElementById("overlay")
                .classList.remove("show");

        }



        /* =========================================================
           CLIQUE FORA
        ========================================================== */

        document
            .getElementById("overlay")
            .addEventListener(
                "click",
                function(event) {

                    if (
                        event.target === this
                    ) {

                        fechar();

                    }

                }
            );



        /* =========================================================
           ESC
        ========================================================== */

        document.addEventListener(
            "keydown",
            function(event) {

                if (
                    event.key === "Escape"
                ) {

                    fechar();

                }

            }
        );



        /* =========================================================
           ENTER / ESPAÇO
        ========================================================== */

        document
            .querySelectorAll(".card")
            .forEach(function(card) {

                card.addEventListener(
                    "keydown",
                    function(event) {

                        if (
                            event.key === "Enter" ||
                            event.key === " "
                        ) {

                            event.preventDefault();

                            abrir(card);

                        }

                    }
                );

            });



        /* =========================================================
           FILTRO
        ========================================================== */

        function filtrar(
            categoria,
            botao
        ) {


            document
                .querySelectorAll(".filter")
                .forEach(function(item) {

                    item.classList.remove(
                        "active"
                    );

                });


            botao.classList.add(
                "active"
            );


            document
                .querySelectorAll(".card")
                .forEach(function(card) {


                    const mostrar =
                        categoria === "Todos" ||
                        card.dataset.category === categoria;


                    card.style.display =
                        mostrar ?
                        "" :
                        "none";

                });

        }