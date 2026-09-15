 function abrir(card) {
            document.getElementById('modalTitle').textContent = card.dataset.title;
            document.getElementById('modalSubtitle').textContent = card.dataset.subtitle || '';
            document.getElementById('modalType').textContent = card.dataset.type || '';
            document.getElementById('modalDescription').textContent = card.dataset.description || '';
            document.getElementById('overlay').classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function fechar() {
            document.getElementById('overlay').classList.remove('show');
            document.body.style.overflow = '';
        }
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') fechar()
        });

        function filtrar(categoria, botao) {
            document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
            botao.classList.add('active');
            document.querySelectorAll('.company-card').forEach(card => {
                card.classList.toggle('hidden', categoria !== 'Todos' && card.dataset.category !== categoria)
            });
        }