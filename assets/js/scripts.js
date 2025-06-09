// Variable global para el número de WhatsApp
const whatsappNumber = "51997663955";

// Función para obtener URL de WhatsApp con mensaje personalizado
function getWhatsAppUrl(service = "", formData = null) {
    let message = "Hola Alada Producciones, me interesa saber más sobre sus servicios";
    
    if (service) {
        message = `Hola Alada Producciones, me interesa saber más sobre ${service}`;
    }
    
    // Si hay datos del formulario, construir un mensaje estructurado
    if (formData) {
        message = `Hola Alada Producciones, quisiera solicitar información para un evento con los siguientes detalles:\n\n`;
        message += `Mi nombre es: ${formData.name}\n`;
        message += `Email: ${formData.email}\n`;
        message += `Teléfono: ${formData.phone}\n\n`;
        message += `Tipo de Evento: ${formData.eventType}\n`;
        
        if (formData.date) {
            message += `Fecha del Evento: ${formData.date}\n`;
        }
        
        if (formData.guests) {
            message += `Número de Invitados: ${formData.guests}\n`;
        }
        
        message += `Mensaje: ${formData.message}\n\n`;
        message += `Gracias por su atención.`;
    }
    
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Configurar todos los enlaces de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los elementos con la clase whatsapp-link
    const whatsappLinks = document.querySelectorAll('.whatsapp-link');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const service = this.getAttribute('data-service') || "";
            window.open(getWhatsAppUrl(service), '_blank');
        });
    });
    
    // Configurar el botón grande de WhatsApp
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    whatsappBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.open(getWhatsAppUrl(), '_blank');
    });
    
    // Manejar el envío del formulario
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar el formulario
            if (validateForm(contactForm)) {
                // Recopilar los datos del formulario
                const formData = {
                    name: contactForm.querySelector('#name').value,
                    email: contactForm.querySelector('#email').value,
                    phone: contactForm.querySelector('#phone').value,
                    eventType: contactForm.querySelector('#event').value,
                    date: contactForm.querySelector('#date').value,
                    guests: contactForm.querySelector('#guests').value,
                    message: contactForm.querySelector('#message').value
                };
                
                // Abrir WhatsApp con los datos del formulario
                window.open(getWhatsAppUrl("", formData), '_blank');
                
                // Opcional: resetear el formulario
                contactForm.reset();
            }
        });
    }
    
    // Función para validar el formulario
    function validateForm(form) {
        let isValid = true;
        
        // Validar nombre
        const nameInput = form.querySelector('#name');
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Por favor ingrese su nombre');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        // Validar email
        const emailInput = form.querySelector('#email');
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Por favor ingrese su email');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Por favor ingrese un email válido');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        // Validar teléfono
        const phoneInput = form.querySelector('#phone');
        if (!phoneInput.value.trim()) {
            showError(phoneInput, 'Por favor ingrese su teléfono');
            isValid = false;
        } else {
            removeError(phoneInput);
        }
        
        // Validar tipo de evento
        const eventInput = form.querySelector('#event');
        if (eventInput.value === "" || eventInput.value === null) {
            showError(eventInput, 'Por favor seleccione un tipo de evento');
            isValid = false;
        } else {
            removeError(eventInput);
        }
        
        // Validar mensaje
        const messageInput = form.querySelector('#message');
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Por favor ingrese un mensaje');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        // Validar términos y condiciones
        const termsInput = form.querySelector('#terms');
        if (!termsInput.checked) {
            showError(termsInput, 'Debe aceptar los términos y condiciones');
            isValid = false;
        } else {
            removeError(termsInput);
        }
        
        return isValid;
    }
    
    // Funciones auxiliares para mostrar/quitar errores
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '5px';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.style.borderColor = 'red';
    }
    
    function removeError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Configurar los botones de visualización del portafolio
    configurePortfolioViewButtons();
    
    function configurePortfolioViewButtons() {
        const viewButtons = document.querySelectorAll('.portfolio-view-btn');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const closeModal = document.querySelector('.close-modal');
        
        // Abrir modal al hacer clic en el botón de vista
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const imgSrc = this.getAttribute('data-img');
                modalImg.src = imgSrc;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Evitar scroll mientras el modal está abierto
            });
        });
        
        // Cerrar modal al hacer clic en la X
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            });
        }
        
        // Cerrar modal al hacer clic fuera de la imagen
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto'; // Restaurar scroll
                }
            });
        }
    }
    
    // Cerrar modal con la tecla ESC
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('imageModal');
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll
        }
    });
});

// Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // No prevenir el comportamiento predeterminado para enlaces de WhatsApp
        if (this.classList.contains('whatsapp-link')) {
            return;
        }
        
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (mainNav && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
            }
        }
    });
});

// Carousel Functionality
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.carousel-dot');
let currentSlide = 0;

// Function to change slide
function changeSlide(n) {
    if (!slides.length) return;
    
    // Add fade-out class to current slide
    slides[currentSlide].classList.add('fade-out');
    
    setTimeout(() => {
        // Remove active and fade-out classes from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.classList.remove('fade-out');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to new slide and dot
        slides[n].classList.add('active');
        dots[n].classList.add('active');
        
        currentSlide = n;
    }, 800); // This should match the transition duration
}

// Auto play carousel
function autoPlayCarousel() {
    if (!slides.length) return;
    currentSlide = (currentSlide + 1) % slides.length;
    changeSlide(currentSlide);
}

// Set interval for autoplay
let carouselInterval;
if (slides.length) {
    carouselInterval = setInterval(autoPlayCarousel, 5000);

    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            changeSlide(index);
            
            // Reset interval
            clearInterval(carouselInterval);
            carouselInterval = setInterval(autoPlayCarousel, 5000);
        });
    });
}

// Scroll to reveal animations
window.addEventListener('scroll', revealOnScroll);

function revealOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .section-title');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
}

// WhatsApp button hover effect
const whatsappBtn = document.querySelector('.whatsapp-btn');
const whatsappText = document.querySelector('.whatsapp-text');

if (whatsappBtn && whatsappText) {
    whatsappBtn.addEventListener('mouseenter', () => {
        whatsappText.style.display = 'block';
    });

    whatsappBtn.addEventListener('mouseleave', () => {
        whatsappText.style.display = 'none';
    });
}

// Nav menu hover effects
document.querySelectorAll('.main-nav ul li a').forEach(link => {
    link.addEventListener('mouseenter', function() {
        const indicator = this.querySelector('span');
        if (indicator) indicator.style.width = '100%';
    });
    
    link.addEventListener('mouseleave', function() {
        const indicator = this.querySelector('span');
        if (indicator) indicator.style.width = '0';
    });
});

// Active section detection when scrolling
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const menuLink = document.querySelector(`.main-nav ul li a[href="#${sectionId}"]`);
        
        if (menuLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            menuLink.style.color = '#b08968';
            const indicator = menuLink.querySelector('span');
            if (indicator) indicator.style.width = '100%';
        } else if (menuLink) {
            menuLink.style.color = '#6D4C3D';
            const indicator = menuLink.querySelector('span');
            if (indicator) indicator.style.width = '0';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Agregar estilos mejorados para las imágenes lazy loading con efectos elegantes
    const style = document.createElement('style');
    style.textContent = `
        .lazy-image {
            opacity: 0;
            filter: blur(15px);
            transform: scale(1.05);
            background: #f5f5f5;
            transition: opacity 0.8s ease-out, filter 1s ease-out, transform 0.8s ease-out;
        }
        
        img:not(.lazy-image) {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
            transition: opacity 0.8s ease-out, filter 1s ease-out, transform 0.8s ease-out;
        }
        
        .portfolio-item {
            overflow: hidden;
            animation-duration: 0.5s;
            animation-fill-mode: both;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translate3d(0, 30px, 0);
            }
            to {
                opacity: 1;
                transform: translate3d(0, 0, 0);
            }
        }
        
        .fade-in-up {
            animation-name: fadeInUp;
        }
        
        .staggered {
            animation-delay: calc(var(--animation-order) * 100ms);
        }
    `;
    document.head.appendChild(style);
    
    // Función para generar un array con rutas de imágenes secuenciales
    function generateImagePaths(basePath, count) {
        const images = [];
        for (let i = 1; i <= count; i++) {
            images.push(`${basePath}/${i}.jpg`);
        }
        return images;
    }
    
    // Estructura de datos del portafolio con rutas de imágenes categorizadas
    const portfolioData = {
        // Wedding Planner - 20 imágenes según la estructura de archivos
        'wedding': generateImagePaths('../img/fotos wedding planner', 20),
        
        // Eventos - 24 imágenes según la estructura de archivos
        'eventos': generateImagePaths('../img/fotos sociales web', 24),
        
        // Catering - 21 imágenes según la estructura de archivos
        'catering': generateImagePaths('../img/fotos catering web', 21),
        
        // Fotografía y Video - Utilizamos las imágenes de eventos sociales como ejemplo
        'fotovideo': generateImagePaths('../img/fotos eventos sociales', 7),
        
        // Categoría "Todos" - Seleccionamos algunas imágenes destacadas de cada categoría
        'all': [
            '../img/fotos wedding planner/13.jpg',
            '../img/fotos catering web/14.jpg',
            '../img/fotos sociales web/6.jpg',
            '../img/fotos catering web/5.jpg',
            '../img/fotos wedding planner/11.jpg',
            '../img/fotos eventos sociales/img_servicio_fotovideo.jpg'
        ]
    };

    // Plantilla HTML para elementos del portafolio con lazy loading elegante
    function createPortfolioItemHTML(imageSrc, index) {
        return `
            <div class="portfolio-item fade-in-up staggered" style="--animation-order: ${index}">
                <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" 
                     data-src="${imageSrc}" 
                     alt="Imagen de Portafolio"
                     class="lazy-image">
                <div class="portfolio-overlay">
                    <a href="#" class="portfolio-view-btn" data-img="${imageSrc}"><i class="fas fa-eye"></i></a>
                </div>
            </div>
        `;
    }
    
    // Función para inicializar lazy loading de imágenes con efecto elegante
    function initLazyLoading(visibleItemsOnly = false) {
        const lazyImages = document.querySelectorAll('.lazy-image');
        
        if (!lazyImages.length) return;
        
        // Configuración mejorada para IntersectionObserver con umbral
        const observerOptions = {
            rootMargin: '200px 0px',
            threshold: 0.1 // Activar cuando al menos 10% de la imagen es visible
        };
        
        // Si tenemos IntersectionObserver disponible
        if ('IntersectionObserver' in window) {
            // Crear un observador para las imágenes
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        
                        // Crear nueva imagen para precargar
                        const preloadImage = new Image();
                        
                        // Cuando la imagen termine de cargar, aplicar transición suave
                        preloadImage.onload = function() {
                            // Aplicar una pequeña pausa aleatoria para efecto escalonado natural
                            setTimeout(() => {
                                image.src = image.dataset.src;
                                image.classList.remove('lazy-image');
                            }, Math.random() * 300);
                        };
                        
                        // Iniciar precarga
                        preloadImage.src = image.dataset.src;
                        
                        // Dejar de observar esta imagen
                        observer.unobserve(image);
                    }
                });
            }, observerOptions);
            
            // Si solo queremos cargar elementos visibles y cercanos
            if (visibleItemsOnly) {
                // Filtrar para obtener solo los elementos visibles o cercanos
                lazyImages.forEach(image => {
                    const rect = image.getBoundingClientRect();
                    const isNearViewport = 
                        rect.top <= window.innerHeight + 200 && 
                        rect.bottom >= -200;
                    
                    if (isNearViewport) {
                        // Crear nueva imagen para precargar
                        const preloadImage = new Image();
                        
                        // Cuando la imagen termine de cargar, aplicar transición suave
                        preloadImage.onload = function() {
                            // Aplicar una pequeña pausa aleatoria para efecto escalonado natural
                            setTimeout(() => {
                                image.src = image.dataset.src;
                                image.classList.remove('lazy-image');
                            }, Math.random() * 300);
                        };
                        
                        // Iniciar precarga
                        preloadImage.src = image.dataset.src;
                    } else {
                        // Observar las imágenes que no están cerca del viewport
                        imageObserver.observe(image);
                    }
                });
            } else {
                // Observar todas las imágenes
                lazyImages.forEach(image => {
                    imageObserver.observe(image);
                });
            }
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            lazyImages.forEach((image, index) => {
                // Crear nueva imagen para precargar
                const preloadImage = new Image();
                
                // Cuando la imagen termine de cargar, aplicar transición suave
                preloadImage.onload = function() {
                    // Aplicar una pequeña pausa escalonada para que no aparezcan todas a la vez
                    setTimeout(() => {
                        image.src = image.dataset.src;
                        image.classList.remove('lazy-image');
                    }, index * 100); // Retraso escalonado basado en el índice
                };
                
                // Iniciar precarga
                preloadImage.src = image.dataset.src;
            });
        }
    }

    // Función para renderizar elementos del portafolio según la categoría
    function renderPortfolio(category) {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;
        
        // Limpiar elementos actuales
        portfolioGrid.innerHTML = '';
        
        // Obtener imágenes para la categoría seleccionada
        const images = portfolioData[category] || [];
        
        // Añadir efecto de carga con desplazamiento escalonado
        portfolioGrid.classList.add('loading');
        
        // Crear HTML para cada imagen con índice para animación escalonada
        images.forEach((imageSrc, index) => {
            portfolioGrid.innerHTML += createPortfolioItemHTML(imageSrc, index);
        });

        // Aplicar animación de revelación a los contenedores
        document.querySelectorAll('.portfolio-item').forEach(item => {
            item.classList.add('revealed');
        });
        
        // Inicializar lazy loading para las imágenes visibles inmediatamente
        // y programar lazy loading para las no visibles
        setTimeout(() => {
            initLazyLoading(true);
            portfolioGrid.classList.remove('loading');
        }, 100);
        
        // Reinicializar los eventos de los botones de vista
        configurePortfolioViewButtons();
    }

    // Configurar los eventos de los botones de pestaña
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Eliminar la clase activa de todos los botones
            tabBtns.forEach(button => button.classList.remove('active'));
            
            // Agregar clase activa al botón clickeado
            btn.classList.add('active');
            
            // Obtener categoría del texto del botón y convertir a minúsculas
            let category = btn.textContent.trim().toLowerCase();
            
            // Mapear el texto del botón a las claves de categoría
            if (category === 'todos') {
                category = 'all';
            } else if (category === 'wedding planner') {
                category = 'wedding';
            } else if (category === 'fotografía y video') {
                category = 'fotovideo';
            }
            
            // Filtrar portafolio
            renderPortfolio(category);
            
            // SOLUCIÓN AL PROBLEMA: Eliminar scroll automático que causa problemas
            // El scroll automático causa que las imágenes queden fuera de la vista
            // hasta que el usuario hace scroll manualmente
            /* CÓDIGO ELIMINADO
            const portfolioSection = document.getElementById('portfolio');
            if (portfolioSection) {
                const portfolioGrid = portfolioSection.querySelector('.portfolio-grid');
                if (portfolioGrid) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: portfolioGrid.offsetTop - 120,
                            behavior: 'smooth'
                        });
                    }, 100);
                }
            }
            */
        });
    });

    // Inicializar portafolio con la categoría "all" (todos) al cargar la página
    renderPortfolio('all');
    
    // Iniciar lazy loading en el primer cargado
    initLazyLoading();
    
    // Iniciar comprobación de lazy loading en el evento scroll
    window.addEventListener('scroll', function() {
        initLazyLoading();
    });
    
    // Reiniciar lazy loading al redimensionar la ventana
    window.addEventListener('resize', function() {
        initLazyLoading();
    });
});
