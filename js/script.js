const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('#menu-links');
const navItems = document.querySelectorAll('.nav-links a');
const ticketForm = document.querySelector('#ticket-form');
const formMessage = document.querySelector('#form-message');
const currentYear = document.querySelector('#current-year');

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove('is-active');
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');

        menuToggle.classList.toggle('is-active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
}

navItems.forEach((item) => {
    item.addEventListener('click', (event) => {
        const targetId = item.getAttribute('href');

        if (!targetId || !targetId.startsWith('#')) return;

        const target = document.querySelector(targetId);

        if (target) {
            event.preventDefault();
            closeMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

if (ticketForm && formMessage) {
    ticketForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fields = ticketForm.querySelectorAll('input, select, textarea');
        let hasEmptyField = false;

        fields.forEach((field) => {
            const isEmpty = field.value.trim() === '';

            field.classList.toggle('field-error', isEmpty);

            if (isEmpty) {
                hasEmptyField = true;
            }
        });

        formMessage.classList.add('is-visible');

        if (hasEmptyField) {
            formMessage.textContent = 'Preencha todos os campos para registrar a simulação do chamado.';
            formMessage.className = 'form-message is-visible error';
            return;
        }

        formMessage.textContent = 'Chamado registrado com sucesso! Esta é uma simulação front-end.';
        formMessage.className = 'form-message is-visible success';
        ticketForm.reset();
    });

    ticketForm.querySelectorAll('input, select, textarea').forEach((field) => {
        field.addEventListener('input', () => {
            if (field.value.trim() !== '') {
                field.classList.remove('field-error');
            }
        });
    });
}
