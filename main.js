document.addEventListener('DOMContentLoaded', () => {

    // ========= GESTIÓN DEL TEMA (CLARO/OSCURO) =========
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
        } else {
            body.classList.add('light-mode');
            body.classList.remove('dark-mode');
        }
    };
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(prefersDark.matches ? 'dark' : 'light');
    }
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });


    // ========= NAVEGACIÓN ACTIVA AL HACER SCROLL =========
    const sections = document.querySelectorAll('main > section[id]');
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // ========= ANIMACIÓN DE APARICIÓN DE TARJETAS AL HACER SCROLL =========
    const animatedCards = document.querySelectorAll('.content-section');

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // observer.unobserve(entry.target); // Opcional: dejar de observar
            }
        });
    }, { threshold: 0.1 });

    animatedCards.forEach(card => {
        cardObserver.observe(card);
    });


    // ========= FILTRO DE PROYECTOS =========
    const filterContainer = document.querySelector('.project-filters');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') return;

            const filterButtons = filterContainer.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.getAttribute('data-filter');

            projectCards.forEach(card => {
                const tech = card.getAttribute('data-tech');
                if (filter === 'all' || tech.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // ========= VALIDACIÓN DEL FORMULARIO DE CONTACTO =========
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (name.trim() === '' || email.trim() === '' || message.trim() === '') {
                formMessage.textContent = 'Por favor, completa todos los campos.';
                formMessage.style.color = '#ef4444';
                return;
            }

            const formData = new FormData(contactForm);
            const action = contactForm.action;

            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    formMessage.textContent = '¡Gracias por tu mensaje! Te responderé pronto.';
                    formMessage.style.color = '#22c55e';
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formMessage.textContent = 'Oops! Hubo un problema al enviar tu mensaje.';
                        }
                        formMessage.style.color = '#ef4444';
                    })
                }
            }).catch(error => {
                formMessage.textContent = 'Oops! Hubo un problema al enviar tu mensaje.';
                formMessage.style.color = '#ef4444';
            });

            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }
});