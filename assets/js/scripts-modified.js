// Variable global para el número de WhatsApp
const whatsappNumber = "51 997 663 955";
// Función para depurar rutas de imágenes
function debugImagePaths() {
    console.log("Depurando rutas de imágenes...");
    // Intentar cargar directamente algunas imágenes para verificar
    const testImages = [
        "../img/fotos wedding planner/1.jpg",
        "../img/fotos sociales web/1.jpg",
        "../img/fotos catering web/1.jpg",
        "../img/fotos fografia y video/1.jpg"
    ];
    
    testImages.forEach(path => {
        const img = new Image();
        img.onload = () => console.log(`✅ Imagen cargada correctamente: ${path}`);
        img.onerror = () => console.error(`❌ Error al cargar imagen: ${path}`);
        img.src = path;
    });
}

// Función para detectar si el usuario está en un dispositivo móvil
function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || 
           (navigator.userAgent.indexOf('IEMobile') !== -1) ||
           (navigator.userAgent.indexOf('Android') !== -1 && navigator.userAgent.indexOf('Mobile') !== -1) ||
           (navigator.userAgent.indexOf('iPhone') !== -1) || 
           (navigator.userAgent.indexOf('iPad') !== -1) ||
           (navigator.userAgent.match(/iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone/i));
}

// Función para obtener URL de WhatsApp con mensaje personalizado
function getWhatsAppUrl(service = "", formData = null) {
    // Construir el mensaje según el contexto
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
    
    // Comprobar si el usuario está en un dispositivo móvil
    if (isMobileDevice()) {
        // Para dispositivos móviles, usar formato wa.me que probablemente abrirá la app
        return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    } else {
        // Para desktop, usar el formato web.whatsapp.com/send que abrirá WhatsApp Web
        return `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
    }
}

// Función para abrir WhatsApp
function openWhatsApp(service = "", formData = null) {
    const url = getWhatsAppUrl(service, formData);
    
    // Usar window.open con _blank para abrir en una nueva pestaña
    window.open(url, '_blank');
    
    console.log(`Abriendo WhatsApp ${isMobileDevice() ? 'App' : 'Web'} con mensaje para servicio: ${service || 'general'}`);
}

// Configurar los event handlers de WhatsApp usando delegación de eventos
function setupWhatsAppLinks() {
    console.log("Configurando enlaces de WhatsApp");
    
    // Usar delegación de eventos para manejar clicks en los enlaces de WhatsApp
    document.body.addEventListener('click', function(e) {
        // Buscar si el click fue en un elemento con clase whatsapp-link o en alguno de sus hijos
        let target = e.target;
        while (target && target !== document.body) {
            if (target.classList && target.classList.contains('whatsapp-link')) {
                e.preventDefault();
                const service = target.getAttribute('data-service') || "";
                console.log(`Abriendo WhatsApp para servicio: ${service}`);
                openWhatsApp(service); // Usar nuestra nueva función
                return;
            }
            target = target.parentNode;
        }
    });
    
    // Configurar el botón grande de WhatsApp separadamente (no requiere delegación)
    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        // Eliminar listeners anteriores para evitar duplicados
        const newWhatsappBtn = whatsappBtn.cloneNode(true);
        if (whatsappBtn.parentNode) {
            whatsappBtn.parentNode.replaceChild(newWhatsappBtn, whatsappBtn);
        }
        
        // Añadir nuevo event listener
        newWhatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("Abriendo WhatsApp desde botón principal");
            openWhatsApp(); // Usar nuestra nueva función
        });
        
        // Configurar hover effect para el botón de WhatsApp
        const whatsappText = document.querySelector('.whatsapp-text');
        if (whatsappText) {
            newWhatsappBtn.addEventListener('mouseenter', () => {
                whatsappText.style.display = 'block';
            });

            newWhatsappBtn.addEventListener('mouseleave', () => {
                whatsappText.style.display = 'none';
            });
        }
    }
}

// Función para manejar el envío del formulario - versión mejorada
function setupContactForm() {
    console.log("Configurando formulario de contacto");
    
    // Usar un selector más específico
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        console.log("Formulario encontrado, configurando event listener");
        
        // Remover listener anterior si existe (para evitar duplicados)
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);
        
        // Agregar el nuevo listener
        newForm.addEventListener('submit', function(e) {
            console.log("Formulario enviado");
            e.preventDefault();
            
            // Validar el formulario
            if (validateForm(newForm)) {
                console.log("Formulario válido, recopilando datos");
                
                // Recopilar los datos del formulario
                const formData = {
                    name: newForm.querySelector('#name').value,
                    email: newForm.querySelector('#email').value,
                    phone: newForm.querySelector('#phone').value,
                    eventType: newForm.querySelector('#event').value,
                    date: newForm.querySelector('#date').value || "No especificada",
                    guests: newForm.querySelector('#guests').value || "No especificado",
                    message: newForm.querySelector('#message').value
                };
                
                console.log("Enviando formulario a WhatsApp:", formData);
                
                // Abrir WhatsApp con los datos del formulario
                openWhatsApp("", formData); // Usar nuestra nueva función
                
                // Resetear el formulario
                newForm.reset();
            } else {
                console.log("Validación del formulario falló");
            }
        });
        
        // Configurar también el botón directamente por si acaso
        const submitButton = newForm.querySelector('button[type="submit"]');
        if (submitButton) {
            console.log("Botón de envío encontrado, configurando click handler alternativo");
            submitButton.addEventListener('click', function(e) {
                // Solo como respaldo, el handler de submit debería ejecutarse normalmente
                console.log("Botón de envío clickeado");
            });
        } else {
            console.log("ADVERTENCIA: No se encontró el botón de envío en el formulario");
        }
    } else {
        console.log("ADVERTENCIA: No se encontró el formulario de contacto");
    }
}

// Función mejorada para validar el formulario con mejor depuración
function validateForm(form) {
    console.log("Validando formulario...");
    let isValid = true;
    
    // Validar nombre
    const nameInput = form.querySelector('#name');
    if (!nameInput) {
        console.error("Campo de nombre no encontrado en el formulario");
        return false;
    }
    
    if (!nameInput.value.trim()) {
        console.log("Validación fallida: Nombre vacío");
        showError(nameInput, 'Por favor ingrese su nombre');
        isValid = false;
    } else {
        removeError(nameInput);
    }
    
    // Validar email
    const emailInput = form.querySelector('#email');
    if (!emailInput) {
        console.error("Campo de email no encontrado en el formulario");
        return false;
    }
    
    if (!emailInput.value.trim()) {
        console.log("Validación fallida: Email vacío");
        showError(emailInput, 'Por favor ingrese su email');
        isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
        console.log("Validación fallida: Email inválido", emailInput.value);
        showError(emailInput, 'Por favor ingrese un email válido');
        isValid = false;
    } else {
        removeError(emailInput);
    }
    
    // Validar teléfono
    const phoneInput = form.querySelector('#phone');
    if (!phoneInput) {
        console.error("Campo de teléfono no encontrado en el formulario");
        return false;
    }
    
    if (!phoneInput.value.trim()) {
        console.log("Validación fallida: Teléfono vacío");
        showError(phoneInput, 'Por favor ingrese su teléfono');
        isValid = false;
    } else {
        removeError(phoneInput);
    }
    
    // Validar tipo de evento
    const eventInput = form.querySelector('#event');
    if (!eventInput) {
        console.error("Campo de evento no encontrado en el formulario");
        return false;
    }
    
    if (eventInput.value === "" || eventInput.value === null) {
        console.log("Validación fallida: Tipo de evento no seleccionado");
        showError(eventInput, 'Por favor seleccione un tipo de evento');
        isValid = false;
    } else {
        removeError(eventInput);
    }
    
    // Validar mensaje
    const messageInput = form.querySelector('#message');
    if (!messageInput) {
        console.error("Campo de mensaje no encontrado en el formulario");
        return false;
    }
    
    if (!messageInput.value.trim()) {
        console.log("Validación fallida: Mensaje vacío");
        showError(messageInput, 'Por favor ingrese un mensaje');
        isValid = false;
    } else {
        removeError(messageInput);
    }
    
    // Validar términos y condiciones si existe
    const termsInput = form.querySelector('#terms');
    if (termsInput && !termsInput.checked) {
        console.log("Validación fallida: Términos no aceptados");
        showError(termsInput, 'Debe aceptar los términos y condiciones');
        isValid = false;
    } else if (termsInput) {
        removeError(termsInput);
    }
    
    console.log("Resultado de la validación:", isValid ? "Válido" : "Inválido");
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
function configurePortfolioViewButtons() {
    console.log("Configurando botones de visualización de portafolio");
    const viewButtons = document.querySelectorAll('.portfolio-view-btn');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeModal = document.querySelector('.close-modal');
    
    // Remover los event listeners anteriores para evitar duplicación
    viewButtons.forEach(button => {
        // Clonar y reemplazar para eliminar todos los event listeners anteriores
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }
    });
    
    // Agregar nuevamente los event listeners a todos los botones
    document.querySelectorAll('.portfolio-view-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir el comportamiento predeterminado
            e.stopPropagation(); // Detener la propagación del evento
            
            const imgSrc = this.getAttribute('data-img');
            console.log('Abriendo imagen:', imgSrc); // Para depuración
            
            if (modal && modalImg) {
                modalImg.src = imgSrc;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Evitar scroll mientras el modal está abierto
            } else {
                console.error('Modal o imagen modal no encontrados');
            }
            
            return false; // Asegurar que no se siga el enlace
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

// Función para forzar la recarga del portafolio
function forceRefreshPortfolio() {
    console.log("Forzando recarga de datos del portafolio...");
    
    // Limpiar cualquier caché de datos
    portfolioData = {
        'wedding': [],
        'eventos': [],
        'catering': [],
        'fotovideo': [],
        'all': []
    };
    
    // Añadir un parámetro de timestamp para evitar el caché
    const timestamp = new Date().getTime();
    
    // Intentar cargar el JSON directamente
    fetch(`../data/portfolio.json?v=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log(`JSON recargado con éxito: ${data.length} entradas`);
            
            // Procesar el JSON
            const weddingImages = data
                .filter(item => item.category === 'wedding')
                .map(item => '/' + item.path);
                
            const eventosImages = data
                .filter(item => item.category === 'eventos')
                .map(item => '/' + item.path);
                
            const cateringImages = data
                .filter(item => item.category === 'catering')
                .map(item => '/' + item.path);
                
            const fotovideoImages = data
                .filter(item => item.category === 'fotovideo')
                .map(item => '/' + item.path);
            
            // Actualizar el portfolioData
            portfolioData = {
                'wedding': weddingImages,
                'eventos': eventosImages,
                'catering': cateringImages,
                'fotovideo': fotovideoImages,
                'all': [
                    // Algunas imágenes para "Todos"
                    ...weddingImages.slice(0, 2),
                    ...cateringImages.slice(0, 2),
                    ...eventosImages.slice(0, 2),
                    ...fotovideoImages.slice(0, 2),
                ]
            };
            
            // Volver a renderizar la categoría actual
            const activeTabBtn = document.querySelector('.tab-btn.active');
            let category = 'all';
            if (activeTabBtn) {
                const btnCategory = activeTabBtn.textContent.trim().toLowerCase();
                if (btnCategory === 'todos') {
                    category = 'all';
                } else if (btnCategory === 'wedding planner') {
                    category = 'wedding';
                } else if (btnCategory === 'coffe break') {
                    category = 'eventos';
                } else if (btnCategory === 'fotografía y video') {
                    category = 'fotovideo';
                } else if (btnCategory === 'catering') {
                    category = 'catering';
                }
            }
            
            renderPortfolio(category);
        })
        .catch(error => {
            console.error('Error al recargar el JSON:', error);
            // Intentar cargar normalmente como fallback
            loadAllPortfolioImages();
        });
}

// Inicialización principal al cargar el documento
document.addEventListener('DOMContentLoaded', function() {
    // Depurar rutas de imágenes
    debugImagePaths();
    
    // Configurar WhatsApp y eventos principales
    setupWhatsAppLinks();
    setupContactForm();
    configurePortfolioViewButtons();
    
    // Forzar recarga de imágenes del portafolio
    forceRefreshPortfolio();
    
    // Configuración directa para el formulario de contacto (como respaldo)
    const contactForm = document.querySelector('#contactForm, .contact-form form');
    if (contactForm) {
        console.log("Configurando formulario de contacto directamente");
        
        contactForm.addEventListener('submit', function(e) {
            console.log("Formulario enviado directamente");
            e.preventDefault();
            
            // Recopilar los datos del formulario directamente
            const formData = {
                name: document.querySelector('#name').value,
                email: document.querySelector('#email').value,
                phone: document.querySelector('#phone').value,
                eventType: document.querySelector('#event').value,
                date: document.querySelector('#date').value || "No especificada",
                guests: document.querySelector('#guests').value || "No especificado",
                message: document.querySelector('#message').value
            };
            
            console.log("Enviando formulario a WhatsApp (método directo):", formData);
            
            // Abrir WhatsApp con los datos del formulario usando la nueva función
            openWhatsApp("", formData);
            
            // Resetear el formulario
            contactForm.reset();
        });
    }
    
    // También configurar un handler directo para el botón de envío
    const submitButtons = document.querySelectorAll('#submitContactForm, .contact-form button[type="submit"]');
    submitButtons.forEach(submitButton => {
        if (submitButton) {
            console.log("Configurando botón de envío directamente");
            
            submitButton.addEventListener('click', function(e) {
                console.log("Botón de envío clickeado directamente");
                e.preventDefault();
                
                // Si el botón está dentro de un formulario, emular un evento de envío
                const form = this.closest('form');
                if (form) {
                    console.log("Formulario encontrado, enviando");
                    
                    // Recopilar los datos del formulario directamente
                    const formData = {
                        name: form.querySelector('#name')?.value || '',
                        email: form.querySelector('#email')?.value || '',
                        phone: form.querySelector('#phone')?.value || '',
                        eventType: form.querySelector('#event')?.value || '',
                        date: form.querySelector('#date')?.value || "No especificada",
                        guests: form.querySelector('#guests')?.value || "No especificado",
                        message: form.querySelector('#message')?.value || ''
                    };
                    
                    console.log("Enviando formulario a WhatsApp (método directo desde botón):", formData);
                    
                    // Abrir WhatsApp con los datos del formulario usando la nueva función
                    openWhatsApp("", formData);
                    
                    // Resetear el formulario
                    form.reset();
                } else {
                    console.error("No se pudo encontrar el formulario para el botón");
                }
            });
        }
    });
    
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
    
    // NUEVO: Función para cargar dinámicamente la lista de imágenes de una carpeta
    // NUEVO: Función para cargar dinámicamente la lista de imágenes de una carpeta
async function loadImagesFromFolder(folderPath) {
    try {
        // Agregar un parámetro de timestamp para evitar el caché del navegador
        const timestamp = new Date().getTime();
        // Usar ruta relativa en lugar de absoluta y añadir parámetro anti-caché
        const response = await fetch(`../data/portfolio.json?v=${timestamp}`);
        
        if (!response.ok) {
            console.error(`Error al cargar el JSON: ${response.status} ${response.statusText}`);
            throw new Error('No se pudo cargar el archivo de imágenes');
        }
        
        const portfolioData = await response.json();
        console.log(`Portfolio JSON cargado correctamente. Entradas: ${portfolioData.length}`);
        
        // Filtrar por la categoría correspondiente
        let category = '';
        
        if (folderPath.includes('wedding')) {
            category = 'wedding';
        } else if (folderPath.includes('eventos') || folderPath.includes('sociales')) {
            category = 'eventos';
        } else if (folderPath.includes('catering')) {
            category = 'catering';
        } else if (folderPath.includes('fografia') || folderPath.includes('video')) {
            category = 'fotovideo';
        }
        
        // Filtrar las imágenes por categoría - CORREGIDO: No añadir barra al inicio
        const images = portfolioData
            .filter(item => item.category === category)
            .map(item => item.path); // Eliminamos la adición de '/'
            
        console.log(`Cargadas ${images.length} imágenes de ${folderPath} para categoría ${category}`);
        
        return images;
        
    } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        
        // Intentar una ruta alternativa antes de usar el fallback
        try {
            const timestamp = new Date().getTime();
            const alternativeResponse = await fetch(`./data/portfolio.json?v=${timestamp}`);
            
            if (alternativeResponse.ok) {
                const portfolioData = await alternativeResponse.json();
                console.log(`Portfolio JSON cargado desde ruta alternativa. Entradas: ${portfolioData.length}`);
                
                // Filtrar por la categoría correspondiente
                let category = '';
                
                if (folderPath.includes('wedding')) {
                    category = 'wedding';
                } else if (folderPath.includes('eventos') || folderPath.includes('sociales')) {
                    category = 'eventos';
                } else if (folderPath.includes('catering')) {
                    category = 'catering';
                } else if (folderPath.includes('fografia') || folderPath.includes('video')) {
                    category = 'fotovideo';
                }
                
                // Filtrar las imágenes por categoría - CORREGIDO
                const images = portfolioData
                    .filter(item => item.category === category)
                    .map(item => item.path); // Sin añadir '/'
                    
                console.log(`Cargadas ${images.length} imágenes desde ruta alternativa`);
                
                return images;
            }
        } catch (alternativeError) {
            console.error('Error al intentar ruta alternativa:', alternativeError);
        }
        
        // En caso de error, usamos un fallback para que la página no se quede sin contenido
        console.log('Usando método de fallback para generar imágenes...');
        
        const imagesCount = {
            'wedding': 20,
            'eventos': 24,
            'catering': 21,
            'fotovideo': 6,
            'default': 12
        };
        
        let category = 'default';
        
        if (folderPath.includes('wedding')) {
            category = 'wedding';
        } else if (folderPath.includes('eventos') || folderPath.includes('sociales')) {
            category = 'eventos';
        } else if (folderPath.includes('catering')) {
            category = 'catering';
        } else if (folderPath.includes('fografia') || folderPath.includes('video')) {
            category = 'fotovideo';
        }
        
        const count = imagesCount[category];
        
        // Generar rutas de imágenes secuenciales como fallback
        return generateImagePaths(folderPath, count);
    }
}
    
    // Función para generar un array con rutas de imágenes secuenciales (fallback)
    function generateImagePaths(basePath, count) {
        const images = [];
        for (let i = 1; i <= count; i++) {
            images.push(`${basePath}/${i}.jpg`);
        }
        return images;
    }
    
    // Estructura de datos del portafolio con carga dinámica de imágenes
    let portfolioData = {
        'wedding': [],
        'eventos': [],
        'catering': [],
        'fotovideo': [],
        'all': []
    };
    
    // Cargar dinámicamente todas las imágenes
    // MODIFICADO: Cargar dinámicamente todas las imágenes
    async function loadAllPortfolioImages() {
        try {
            // Intentar primero con una carga directa del archivo JSON completo
            const timestamp = new Date().getTime();
            let portfolioDataRaw;
            
            try {
                // Intentar con ruta relativa ../data
                const response = await fetch(`../data/portfolio.json?v=${timestamp}`);
                if (response.ok) {
                    portfolioDataRaw = await response.json();
                    console.log(`JSON cargado directamente: ${portfolioDataRaw.length} entradas`);
                } else {
                    throw new Error('Primer intento fallido');
                }
            } catch (e) {
                // Intentar con ruta alternativa ./data
                const response = await fetch(`./data/portfolio.json?v=${timestamp}`);
                if (response.ok) {
                    portfolioDataRaw = await response.json();
                    console.log(`JSON cargado desde ruta alternativa: ${portfolioDataRaw.length} entradas`);
                } else {
                    throw new Error('Ambos intentos fallidos');
                }
            }
            
            // Si llegamos aquí, tenemos el JSON cargado
            // Organizamos los datos por categoría - CORREGIDO: No añadir barra al inicio
            const weddingImages = portfolioDataRaw
                .filter(item => item.category === 'wedding')
                .map(item => item.path); // Eliminamos la adición de '/'
                
            const eventosImages = portfolioDataRaw
                .filter(item => item.category === 'eventos')
                .map(item => item.path);
                
            const cateringImages = portfolioDataRaw
                .filter(item => item.category === 'catering')
                .map(item => item.path);
                
            const fotovideoImages = portfolioDataRaw
                .filter(item => item.category === 'fotovideo')
                .map(item => item.path);
            
            // Actualizar el portfolioData
            portfolioData = {
                'wedding': weddingImages,
                'eventos': eventosImages,
                'catering': cateringImages,
                'fotovideo': fotovideoImages,
                'all': [
                    // Seleccionamos algunas imágenes destacadas para la categoría "Todos"
                    // Si hay imágenes disponibles, las usamos
                    ...weddingImages.slice(0, 2),
                    ...cateringImages.slice(0, 2),
                    ...eventosImages.slice(0, 2),
                    ...fotovideoImages.slice(0, 2),
                ]
            };
            
            console.log('Datos del portafolio organizados por categoría:', {
                'wedding': weddingImages.length,
                'eventos': eventosImages.length,
                'catering': cateringImages.length,
                'fotovideo': fotovideoImages.length
            });
            
        } catch (error) {
            console.error('Error al cargar el JSON directamente:', error);
            
            // Si falla la carga directa del JSON, intentamos el método original
            try {
                console.log('Intentando cargar por carpetas individuales...');
                // Cargar imágenes de cada categoría
                const weddingImages = await loadImagesFromFolder('../img/fotos wedding planner');
                const eventosImages = await loadImagesFromFolder('../img/fotos sociales web');
                const cateringImages = await loadImagesFromFolder('../img/fotos catering web');
                const fotovideoImages = await loadImagesFromFolder('../img/fotos fografia y video');
                
                // Actualizar el portfolioData
                portfolioData = {
                    'wedding': weddingImages,
                    'eventos': eventosImages,
                    'catering': cateringImages,
                    'fotovideo': fotovideoImages,
                    'all': [
                        // Seleccionamos algunas imágenes destacadas para la categoría "Todos"
                        // Si hay imágenes disponibles, las usamos
                        ...weddingImages.slice(0, 2),
                        ...cateringImages.slice(0, 2),
                        ...eventosImages.slice(0, 2),
                        ...fotovideoImages.slice(0, 2),
                    ]
                };
                
                console.log('Imágenes cargadas por método alternativo para todas las categorías');
                
            } catch (secondError) {
                console.error('Error al cargar por ambos métodos:', secondError);
                // No hacemos nada más, se usará el fallback
            }
        }
        
        // Una vez cargadas las imágenes, inicializar el portafolio
        console.log('Inicializando renderizado del portafolio...');
        
        // Inicializar portafolio con la categoría "all" (todos) al cargar la página
        renderPortfolio('all');
    }

    // Plantilla HTML MODIFICADA para elementos del portafolio
    // Plantilla HTML MODIFICADA para elementos del portafolio
// Plantilla HTML MODIFICADA para elementos del portafolio
function createPortfolioItemHTML(imageSrc, index) {
    // Asegurarnos de que la ruta sea absoluta desde la raíz del servidor
    const fullPath = imageSrc.startsWith('../') ? imageSrc : `../${imageSrc}`;
    
    console.log("Imagen a cargar:", fullPath);
    
    return `
        <div class="portfolio-item fade-in-up staggered" style="--animation-order: ${index}">
            <img src="${fullPath}" 
                 alt="Imagen de Portafolio"
                 style="width: 100%; height: 100%; object-fit: cover; min-height: 200px; background-color: #f5f5f5;"
                 onload="console.log('Imagen cargada: ${fullPath}')"
                 onerror="console.error('Error al cargar: ${fullPath}'); this.onerror=null; this.src='../img/logo_alada.png'; this.style.padding='20px';">
            <div class="portfolio-overlay">
                <a href="javascript:void(0);" class="portfolio-view-btn" data-img="${fullPath}"><i class="fas fa-eye"></i></a>
            </div>
        </div>
    `;
}

// MODIFICADO: Cargar dinámicamente todas las imágenes
async function loadAllPortfolioImages() {
    try {
        console.log("Iniciando carga de imágenes del portafolio...");
        const timestamp = new Date().getTime();
        
        // Intentar con ruta absoluta
        const response = await fetch(`../data/portfolio.json?v=${timestamp}`);
        
        if (!response.ok) {
            throw new Error(`Error al cargar JSON: ${response.status}`);
        }
        
        const portfolioDataRaw = await response.json();
        console.log(`JSON cargado, entradas: ${portfolioDataRaw.length}`);
        console.log("Primera entrada:", portfolioDataRaw[0]);
        
        // Agrupar por categoría
        let weddingImages = [];
        let eventosImages = [];
        let cateringImages = [];
        let fotovideoImages = [];
        
        portfolioDataRaw.forEach(item => {
            // Mostrar cada ítem para depuración
            console.log(`Procesando imagen: ${JSON.stringify(item)}`);
            
            if (item.category === 'wedding') {
                weddingImages.push(item.path);
            } else if (item.category === 'eventos') {
                eventosImages.push(item.path);
            } else if (item.category === 'catering') {
                cateringImages.push(item.path);
            } else if (item.category === 'fotovideo') {
                fotovideoImages.push(item.path);
            }
        });
        
        console.log(`Imágenes por categoría: wedding=${weddingImages.length}, eventos=${eventosImages.length}, catering=${cateringImages.length}, fotovideo=${fotovideoImages.length}`);
        
        // Actualizar el portfolioData
        portfolioData = {
            'wedding': weddingImages,
            'eventos': eventosImages,
            'catering': cateringImages,
            'fotovideo': fotovideoImages,
            'all': [
                // Combinar algunas imágenes para "Todos"
                ...weddingImages.slice(0, 2),
                ...cateringImages.slice(0, 2),
                ...eventosImages.slice(0, 2),
                ...fotovideoImages.slice(0, 2)
            ]
        };
        
        // Mostrar rutas para depuración
        console.log("Ejemplo de rutas:");
        if (weddingImages.length > 0) console.log("Wedding:", weddingImages[0]);
        if (eventosImages.length > 0) console.log("Eventos:", eventosImages[0]);
        if (cateringImages.length > 0) console.log("Catering:", cateringImages[0]);
        if (fotovideoImages.length > 0) console.log("FotoVideo:", fotovideoImages[0]);
        
    } catch (error) {
        console.error("Error en loadAllPortfolioImages:", error);
        
        // Crear rutas de fallback
        portfolioData = {
            'wedding': generateImagePaths("img/fotos wedding planner", 20),
            'eventos': generateImagePaths("img/fotos sociales web", 24),
            'catering': generateImagePaths("img/fotos catering web", 21),
            'fotovideo': generateImagePaths("img/fotos fografia y video", 6),
            'all': []
        };
        
        // Llenar la categoría "all" con algunas imágenes
        portfolioData.all = [
            ...portfolioData.wedding.slice(0, 2),
            ...portfolioData.catering.slice(0, 2),
            ...portfolioData.eventos.slice(0, 2),
            ...portfolioData.fotovideo.slice(0, 2)
        ];
    }
    
    // Renderizar portafolio
    console.log("Renderizando portafolio...");
    renderPortfolio('all');
}

// Función para generar un array con rutas de imágenes secuenciales (fallback)
function generateImagePaths(basePath, count) {
    console.log(`Generando ${count} rutas fallback para ${basePath}`);
    const images = [];
    for (let i = 1; i <= count; i++) {
        images.push(`${basePath}/${i}.jpg`);
    }
    return images;
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
        
        console.log(`Renderizando ${images.length} imágenes para categoría ${category}`);
        
        // Mostrar indicador de carga mientras se procesan las imágenes
        if (images.length === 0) {
            portfolioGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">No hay imágenes disponibles en esta categoría</div>';
            return;
        }
        
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
        
        // IMPORTANTE: Configurar los botones de vista después de renderizar
        setTimeout(() => {
            portfolioGrid.classList.remove('loading');
            configurePortfolioViewButtons();
            
            // IMPORTANTE: Siempre volver a configurar enlaces de WhatsApp después 
            // de actualizar el DOM para asegurar que funcionen
            setupWhatsAppLinks();
            
            // Verificar si hay imágenes que fallaron en cargar
            const images = portfolioGrid.querySelectorAll('img');
            console.log(`Verificando ${images.length} imágenes después de renderizar`);
            
            // Verificar cada imagen y mostrar mensaje si alguna falló
            let failedImages = 0;
            images.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    failedImages++;
                    // Establecer un fallback para imágenes que no cargan
                    img.onerror = function() {
                        this.onerror = null;
                        this.src = '../img/logo_alada.png';
                        this.style.padding = '20px';
                    };
                }
            });
            
            if (failedImages > 0) {
                console.warn(`${failedImages} imágenes no se cargaron correctamente`);
            }
        }, 200);
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
            } else if (category === 'coffe break') {
                category = 'eventos';
            } else if (category === 'fotografía y video') {
                category = 'fotovideo';
            }
            
            // Filtrar portafolio
            renderPortfolio(category);
        });
    });

    // Iniciar carga de todas las imágenes del portafolio
    loadAllPortfolioImages().then(() => {
        console.log("Todas las imágenes del portafolio cargadas correctamente");
    }).catch(error => {
        console.error("Error al cargar imágenes del portafolio:", error);
    });
    
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

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('imageModal');
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
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
