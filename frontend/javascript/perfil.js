function goProject() {
    window.location.href = "meuprojeto.html"; // ou o nome correto da sua página de projetos
}document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ESTADO INICIAL E LOCALSTORAGE
    // ==========================================
    const defaultProfile = {
        name: "Juliana Silva",
        role: "Fundadora & CEO da InovaMulher",
        location: "São Paulo, SP",
        bio: "Empreendedora apaixonada por tecnologia, inovação e impacto social. Ajudando mulheres a escalarem seus negócios no meio digital.",
        website: "https://inovamulher.com.br",
        linkedin: "linkedin.com/in/julianasilva",
        instagram: "instagram.com/julianainova",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
    };

    // Carregar dados salvos ou usar os padrões
    function loadProfileData() {
        const savedData = localStorage.getItem('elas_empreendedoras_profile');
        return savedData ? JSON.parse(savedData) : defaultProfile;
    }

    function saveProfileData(data) {
        localStorage.setItem('elas_empreendedoras_profile', JSON.stringify(data));
    }

    // Aplicar dados na DOM
    function renderProfile(profile) {
        const nameEl = document.querySelector('.profile-name');
        const roleEl = document.querySelector('.profile-role');
        const locationEl = document.querySelector('.profile-location');
        const bioEl = document.querySelector('.profile-bio-text');
        const avatarEl = document.querySelector('.profile-avatar');
        
        // Links sociais (se houver na página)
        const webLink = document.querySelector('.social-link.website');
        const liLink = document.querySelector('.social-link.linkedin');
        const igLink = document.querySelector('.social-link.instagram');

        if (nameEl) nameEl.textContent = profile.name;
        if (roleEl) roleEl.textContent = profile.role;
        if (locationEl) locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${profile.location}`;
        if (bioEl) bioEl.textContent = profile.bio;
        if (avatarEl && profile.avatar) avatarEl.src = profile.avatar;

        if (webLink && profile.website) webLink.href = profile.website;
        if (liLink && profile.linkedin) liLink.href = `https://${profile.linkedin.replace(/^https?:\/\//, '')}`;
        if (igLink && profile.instagram) igLink.href = `https://${profile.instagram.replace(/^https?:\/\//, '')}`;
    }

    // Inicializar perfil na tela
    let currentProfile = loadProfileData();
    renderProfile(currentProfile);

    // ==========================================
    // 2. CONTROLE DE MODAIS (EDITAR PERFIL)
    // ==========================================
    const editProfileBtn = document.querySelector('#editProfileBtn'); // Ajuste o seletor conforme seu HTML
    const editModal = document.querySelector('#editProfileModal');     // Ajuste o ID do modal
    const closeModals = document.querySelectorAll('.close-modal, .btn-cancel');
    const editForm = document.querySelector('#editProfileForm');

    // Botão genérico para abrir edição caso não tenha ID específico
    if (editProfileBtn && editModal) {
        editProfileBtn.addEventListener('click', () => {
            // Preencher o formulário com os dados atuais
            if (editForm) {
                editForm.name.value = currentProfile.name;
                editForm.role.value = currentProfile.role;
                editForm.location.value = currentProfile.location;
                editForm.bio.value = currentProfile.bio;
                editForm.website.value = currentProfile.website;
                editForm.linkedin.value = currentProfile.linkedin;
                editForm.instagram.value = currentProfile.instagram;
            }
            editModal.classList.add('active'); // Ou .show() dependendo do seu CSS
        });
    }

    // Fechar modais
    closeModals.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) modal.classList.remove('active');
        });
    });

    // Salvar formulário de edição de perfil
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            currentProfile = {
                ...currentProfile,
                name: editForm.name.value,
                role: editForm.role.value,
                location: editForm.location.value,
                bio: editForm.bio.value,
                website: editForm.website.value,
                linkedin: editForm.linkedin.value,
                instagram: editForm.instagram.value
            };

            saveProfileData(currentProfile);
            renderProfile(currentProfile);

            if (editModal) editModal.classList.remove('active');
            
            // Feedback opcional
            showToast("Perfil atualizado com sucesso!");
        });
    }

    // ==========================================
    // 3. NAVEGAÇÃO ENTRE ABAS (TABS)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remover classe active de todos
            tabButtons.button?.classList?.remove('active'); // segurança
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Adicionar no atual
            button.classList.add('active');
            const targetContent = document.querySelector(`#${targetTab}`);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // ==========================================
    // 4. SISTEMA DE BUSCA / FILTRO DE PROJETOS
    // ==========================================
    const searchInput = document.querySelector('#searchInput');
    const projectCards = document.querySelectorAll('.project-card'); // Ajuste a classe dos cards

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();

            projectCards.forEach(card => {
                const title = card.querySelector('.project-title')?.textContent.toLowerCase() || "";
                const description = card.querySelector('.project-desc')?.textContent.toLowerCase() || "";

                if (title.includes(term) || description.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ==========================================
    // 5. MODAL DE DETALHES DO PROJETO
    // ==========================================
    const projectDetailsModal = document.querySelector('#projectDetailsModal');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (!card || !projectDetailsModal) return;

            // Extrair dados do card clicado
            const title = card.querySelector('.project-title')?.textContent || "Projeto";
            const desc = card.querySelector('.project-desc')?.textContent || "Sem descrição.";
            const category = card.querySelector('.project-category')?.textContent || "Geral";

            // Popular modal de detalhes
            const modalTitle = projectDetailsModal.querySelector('.modal-project-title');
            const modalDesc = projectDetailsModal.querySelector('.modal-project-desc');
            const modalCat = projectDetailsModal.querySelector('.modal-project-category');

            if (modalTitle) modalTitle.textContent = title;
            if (modalDesc) modalDesc.textContent = desc;
            if (modalCat) modalCat.textContent = category;

            projectDetailsModal.classList.add('active');
        });
    });

    // ==========================================
    // UTILITÁRIO: TOAST NOTIFICAÇÃO SIMPLES
    // ==========================================
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        
        // Estilização básica via JS caso não tenha no CSS
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#10B981',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '9999',
            fontFamily: 'inherit',
            transition: 'opacity 0.3s ease'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});