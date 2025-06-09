
// Variables globales
let currentPortfolioCategory = 'wedding';

// Variable para número de WhatsApp (mantener de la implementación anterior)
const whatsappNumber = "51997663955";

// ============= FUNCIONES PARA EL PANEL ADMINISTRATIVO =============

// Función para mostrar mensajes
function showMessage(containerId, isSuccess, message, duration = 3000) {
    const successEl = document.getElementById(`${containerId}-success`);
    const errorEl = document.getElementById(`${containerId}-error`);
    
    if (isSuccess) {
        successEl.textContent = message;
        successEl.style.display = 'block';
        errorEl.style.display = 'none';
        
        setTimeout(() => {
            successEl.style.display = 'none';
        }, duration);
    } else {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        successEl.style.display = 'none';
        
        setTimeout(() => {
            errorEl.style.display = 'none';
        }, duration);
    }
}

// Función para mostrar el diálogo de confirmación
function showConfirmationDialog(message, onConfirm, onCancel) {
    // Crear el diálogo si no existe
    let dialog = document.querySelector('.confirmation-dialog');
    if (!dialog) {
        dialog = document.createElement('div');
        dialog.className = 'confirmation-dialog';
        dialog.innerHTML = `
            <div class="confirmation-content">
                <p></p>
                <div class="confirmation-buttons">
                    <button class="confirm-btn">Eliminar</button>
                    <button class="cancel-btn">Cancelar</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }
    
    // Actualizar mensaje
    dialog.querySelector('p').textContent = message;
    
    // Configurar eventos
    const confirmBtn = dialog.querySelector('.confirm-btn');
    const cancelBtn = dialog.querySelector('.cancel-btn');
    
    // Remover listeners antiguos
    const newConfirmBtn = confirmBtn.cloneNode(true);
    const newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    // Añadir nuevos listeners
    newConfirmBtn.addEventListener('click', () => {
        dialog.style.display = 'none';
        if (typeof onConfirm === 'function') onConfirm();
    });
    
    newCancelBtn.addEventListener('click', () => {
        dialog.style.display = 'none';
        if (typeof onCancel === 'function') onCancel();
    });
    
    // Mostrar diálogo
    dialog.style.display = 'flex';
}

// ============= FUNCIONES PARA CARGAR IMÁGENES =============

// Función para cargar las imágenes del carrusel
function loadCarouselImages() {
    const container = document.getElementById('carousel-images');
    if (!container) return;
    
    // Mostrar indicador de carga
    container.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Cargando imágenes...</div>';
    
    // Cargar imágenes del carrusel (suponemos que hay 3 imágenes fijas)
    const carouselImages = [];
    for (let i = 1; i <= 3; i++) {
        carouselImages.push({
            id: i,
            path: `../img/foto portada/${i}.jpg?v=${Date.now()}`
        });
    }
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Crear elementos para cada imagen
    if (carouselImages.length > 0) {
        carouselImages.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item fade-in-up';
            imageItem.innerHTML = `
                <img src="${image.path}" alt="Imagen Carrusel ${image.id}" onerror="this.parentNode.classList.add('error-image'); this.style.display='none';">
                <div class="image-actions">
                    <button class="upload-btn" onclick="replaceCarouselImage(${image.id})">
                        <i class="fas fa-upload"></i>
                    </button>
                </div>
                <div class="image-info">
                    Imagen ${image.id} del Carrusel
                </div>
            `;
            container.appendChild(imageItem);
        });
    } else {
        container.innerHTML = '<p class="text-center">No se encontraron imágenes del carrusel.</p>';
    }
}

// Función para cargar las imágenes de servicios
function loadServiceImages() {
    const container = document.getElementById('services-images');
    if (!container) return;
    
    // Mostrar indicador de carga
    container.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Cargando imágenes...</div>';
    
    // Definir las imágenes de servicios (fijas)
    const serviceImages = [
        { id: 1, type: 'wedding', name: 'Wedding Planner', path: '../img/fotos wedding planner/9.jpg' },
        { id: 2, type: 'catering', name: 'Catering', path: '../img/fotos catering web/5.jpg' },
        { id: 3, type: 'fotovideo', name: 'Fotografía y Video', path: '../img/fotos fografia y video/6.jpg' },
        { id: 4, type: 'eventos', name: 'Coffe Break', path: '../img/fotos sociales web/7.jpg' }
    ];
    
    // Añadir timestamp para evitar cache
    serviceImages.forEach(image => {
        image.path = `${image.path}?v=${Date.now()}`;
    });
    
    // Limpiar el contenedor
    container.innerHTML = '';
    
    // Crear elementos para cada imagen
    if (serviceImages.length > 0) {
        serviceImages.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item fade-in-up staggered';
            imageItem.style.setProperty('--animation-order', index);
            imageItem.innerHTML = `
                <img src="${image.path}" alt="Imagen ${image.name}" onerror="this.parentNode.classList.add('error-image'); this.style.display='none';">
                <div class="image-actions">
                    <button class="upload-btn" onclick="replaceServiceImage('${image.type}')">
                        <i class="fas fa-upload"></i>
                    </button>
                </div>
                <div class="image-info">
                    Imagen de ${image.name}
                </div>
            `;
            container.appendChild(imageItem);
        });
    } else {
        container.innerHTML = '<p class="text-center">No se encontraron imágenes de servicios.</p>';
    }
}

// Función para cargar las imágenes del portafolio según la categoría
function loadPortfolioImages(category = 'wedding') {
    const container = document.getElementById('portfolio-images');
    if (!container) return;
    
    // Actualizar categoría actual
    currentPortfolioCategory = category;
    
    // Actualizar clases de los botones de categoría
    const tabButtons = document.querySelectorAll('.portfolio-tabs .tab-btn');
    tabButtons.forEach(btn => {
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Mostrar indicador de carga
    container.innerHTML = '<div class="loading-indicator"><i class="fas fa-spinner fa-spin"></i> Cargando imágenes...</div>';
    
    // Realizar la petición AJAX para obtener las imágenes
    fetch(`portfolio_manager.php?action=get&category=${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            // Limpiar el contenedor
            container.innerHTML = '';
            
            // Verificar si hay imágenes
            if (data.success && data.images && data.images.length > 0) {
                // Crear elementos para cada imagen con efectos de animación
                data.images.forEach((image, index) => {
                    const imageItem = document.createElement('div');
                    imageItem.className = 'image-item fade-in-up staggered';
                    imageItem.style.setProperty('--animation-order', index);
                    imageItem.innerHTML = `
                        <img src="${image.path}" alt="Imagen Portafolio" onerror="this.parentNode.classList.add('error-image'); this.style.display='none';">
                        <div class="image-actions">
                            <button class="delete-btn" onclick="deletePortfolioImage(${image.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    container.appendChild(imageItem);
                });
                
                // Inicializar lazy loading para las imágenes
                initLazyLoading();
            } else {
                // No hay imágenes, mostrar mensaje
                container.innerHTML = `
                    <p class="text-center">No hay imágenes en esta categoría.</p>
                `;
            }
            
            // MODIFICACIÓN AQUÍ: Agregar botón fuera del contenedor de imágenes
            // Buscamos la sección padre que contiene el contenedor de imágenes
            const parentSection = container.closest('.admin-section');
            
            // Eliminamos cualquier botón existente que pudiera haber sido creado antes
            const existingButton = parentSection.querySelector('.add-image-button-container');
            if (existingButton) {
                existingButton.remove();
            }
            
            // Creamos el nuevo contenedor para el botón
            const addButtonContainer = document.createElement('div');
            addButtonContainer.className = 'add-image-button-container';
            addButtonContainer.style.cssText = 'margin-top: 30px; text-align: center; padding: 15px; border-top: 1px solid #e0e0e0;';
            addButtonContainer.innerHTML = `
                <button class="upload-btn" onclick="showPortfolioUploadDialog('${category}')">
                    <i class="fas fa-plus"></i> Agregar Imagen
                </button>
            `;
            
            // Insertamos el botón después del contenedor de imágenes, pero dentro de la sección padre
            container.after(addButtonContainer);
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `
                <p class="text-center">Error al cargar las imágenes: ${error.message}</p>
                <div class="add-image-button-container" style="margin-top: 20px; text-align: center;">
                    <button class="upload-btn" onclick="loadPortfolioImages('${category}')">
                        <i class="fas fa-sync-alt"></i> Intentar de nuevo
                    </button>
                </div>
            `;
        });
}

// Nueva función para mostrar el diálogo de selección de imagen
// Nueva función para mostrar el diálogo de selección de imagen
function showPortfolioUploadDialog(category) {
    // Obtener el contenedor de imágenes
    const portfolioContainer = document.getElementById('portfolio-images');
    if (!portfolioContainer) return;
    
    // Encontrar la sección padre que contiene el contenedor de imágenes
    const parentSection = portfolioContainer.closest('.admin-section');
    if (!parentSection) return;
    
    // Verificar si ya existe el contenedor de selección en cualquier parte
    let selectImageContainer = document.querySelector('.select-image-container');
    
    // Si existe, eliminar para recrearlo
    if (selectImageContainer) {
        selectImageContainer.remove();
    }
    
    // Crear nuevo contenedor de selección con diseño más ancho que alto y menos altura
    selectImageContainer = document.createElement('div');
    selectImageContainer.className = 'select-image-container';
    selectImageContainer.style.cssText = `
        margin-top: 15px;
        padding: 15px 25px; 
        border: 1px dashed #ccc; 
        border-radius: 8px; 
        text-align: center; 
        background-color: #f9f9f9;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
    `;
    
    // Contenido más compacto verticalmente con mensaje actualizado sobre resolución
    selectImageContainer.innerHTML = `
        <h3 style="margin: 0 0 10px 0; color: #6D4C3D; font-size: 18px;">Seleccionar Imagen</h3>
        <p style="margin: 0 0 5px 0;">
            Selecciona una nueva imagen para la categoría: <strong>${getCategoryName(category)}</strong>
            <small style="display: block; margin-top: 2px;">Se admiten imágenes de alta resolución (4K y superiores)</small>
        </p>
        
        <div class="button-container" style="margin-top: 10px; display: flex; justify-content: center; gap: 10px;">
            <input type="file" id="portfolio-file" class="file-input" accept="image/*" style="display: none;">
            <button class="upload-btn" onclick="document.getElementById('portfolio-file').click()">
                Seleccionar Archivo
            </button>
            <button class="cancel-upload-btn" onclick="document.querySelector('.select-image-container').remove()">
                Cancelar
            </button>
        </div>
        
        <input type="hidden" id="portfolio-category" value="${category}">
        <div class="message-container" style="margin-top: 10px;">
            <div id="portfolio-success" class="success-message"></div>
            <div id="portfolio-error" class="error-message"></div>
        </div>
    `;
    
    // Agregar el contenedor después del botón de agregar imagen
    const addButtonContainer = parentSection.querySelector('.add-image-button-container');
    if (addButtonContainer) {
        addButtonContainer.after(selectImageContainer);
    } else {
        parentSection.appendChild(selectImageContainer);
    }
    
    // Configurar el evento de cambio en el input de archivo
    const fileInput = document.getElementById('portfolio-file');
    const categoryInput = document.getElementById('portfolio-category');
    
    if (!fileInput || !categoryInput) return;
    
    // Establecer la categoría
    categoryInput.value = category;
    
    // Resetear el input de archivo
    fileInput.value = '';
    
    // Configurar el evento de cambio en el input de archivo
    fileInput.onchange = function() {
        if (this.files && this.files[0]) {
            // Verificar tamaño máximo (50MB) - Aumentado el límite para imágenes de alta resolución
            if (this.files[0].size > 50 * 1024 * 1024) {
                showMessage('portfolio', false, 'La imagen es demasiado grande. El tamaño máximo es 50MB.');
                return;
            }
            
            // Crear FormData
            const formData = new FormData();
            formData.append('image', this.files[0]);
            formData.append('category', category);
            
            // Mostrar mensaje de carga
            showMessage('portfolio', true, 'Subiendo imagen...', 100000);
            
            // Realizar la petición AJAX
            fetch('portfolio_manager.php?action=upload', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage('portfolio', true, 'Imagen agregada correctamente');
                    // Eliminar contenedor de selección
                    if (document.querySelector('.select-image-container')) {
                        document.querySelector('.select-image-container').remove();
                    }
                    loadPortfolioImages(category); // Recargar imágenes
                } else {
                    showMessage('portfolio', false, data.message || 'Error al subir la imagen');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('portfolio', false, 'Error al subir la imagen: ' + error.message);
            });
        }
    };
}

// ============= FUNCIONES PARA SUBIR IMÁGENES =============

// Función para reemplazar una imagen del carrusel
function replaceCarouselImage(index) {
    // Configurar el contenedor de carga
    const uploadContainer = document.getElementById('carousel-upload');
    const indexInput = document.getElementById('carousel-index');
    const fileInput = document.getElementById('carousel-file');
    
    if (!uploadContainer || !indexInput || !fileInput) return;
    
    // Establecer el índice
    indexInput.value = index;
    
    // Mostrar el contenedor de carga
    uploadContainer.style.display = 'block';
    
    // Resetear el input de archivo
    fileInput.value = '';
    
    // Configurar el evento de cambio en el input de archivo
    fileInput.onchange = function() {
        if (this.files && this.files[0]) {
            // Verificar tamaño máximo (10MB)
            if (this.files[0].size > 10 * 1024 * 1024) {
                showMessage('carousel', false, 'La imagen es demasiado grande. El tamaño máximo es 10MB.');
                return;
            }
            
            // Crear FormData
            const formData = new FormData();
            formData.append('image', this.files[0]);
            formData.append('type', 'carousel');
            formData.append('index', index);
            
            // Mostrar mensaje de carga
            showMessage('carousel', true, 'Subiendo imagen...', 100000);
            
            // Realizar la petición AJAX
            fetch('upload.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage('carousel', true, 'Imagen actualizada correctamente');
                    uploadContainer.style.display = 'none';
                    loadCarouselImages(); // Recargar imágenes
                } else {
                    showMessage('carousel', false, data.message || 'Error al subir la imagen');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('carousel', false, 'Error al subir la imagen: ' + error.message);
            });
        }
    };
}

// Función para reemplazar una imagen de servicio
function replaceServiceImage(serviceType) {
    // Configurar el contenedor de carga
    const uploadContainer = document.getElementById('services-upload');
    const serviceTypeInput = document.getElementById('service-type');
    const fileInput = document.getElementById('services-file');
    
    if (!uploadContainer || !serviceTypeInput || !fileInput) return;
    
    // Establecer el tipo de servicio
    serviceTypeInput.value = serviceType;
    
    // Mostrar el contenedor de carga
    uploadContainer.style.display = 'block';
    
    // Resetear el input de archivo
    fileInput.value = '';
    
    // Configurar el evento de cambio en el input de archivo
    fileInput.onchange = function() {
        if (this.files && this.files[0]) {
            // Verificar tamaño máximo (10MB)
            if (this.files[0].size > 10 * 1024 * 1024) {
                showMessage('services', false, 'La imagen es demasiado grande. El tamaño máximo es 10MB.');
                return;
            }
            
            // Crear FormData
            const formData = new FormData();
            formData.append('image', this.files[0]);
            formData.append('type', 'service');
            formData.append('serviceType', serviceType);
            
            // Mostrar mensaje de carga
            showMessage('services', true, 'Subiendo imagen...', 100000);
            
            // Realizar la petición AJAX
            fetch('upload.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showMessage('services', true, 'Imagen actualizada correctamente');
                    uploadContainer.style.display = 'none';
                    loadServiceImages(); // Recargar imágenes
                } else {
                    showMessage('services', false, data.message || 'Error al subir la imagen');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showMessage('services', false, 'Error al subir la imagen: ' + error.message);
            });
        }
    };
}

// Función para agregar una nueva imagen al portafolio (mantener para compatibilidad)
function addPortfolioImage(category) {
    showPortfolioUploadDialog(category);
}

// Función para eliminar una imagen del portafolio
function deletePortfolioImage(imageId) {
    showConfirmationDialog('¿Está seguro que desea eliminar esta imagen?', () => {
        // Crear FormData
        const formData = new FormData();
        formData.append('id', imageId);
        
        // Mostrar mensaje de carga
        showMessage('portfolio', true, 'Eliminando imagen...', 100000);
        
        // Realizar la petición AJAX
        fetch('portfolio_manager.php?action=delete', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showMessage('portfolio', true, 'Imagen eliminada correctamente');
                loadPortfolioImages(currentPortfolioCategory); // Recargar imágenes
            } else {
                showMessage('portfolio', false, data.message || 'Error al eliminar la imagen');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('portfolio', false, 'Error al eliminar la imagen: ' + error.message);
        });
    });
}

// Función para refrescar la lista de imágenes del portafolio
function refreshPortfolioImages() {
    // Mostrar mensaje de carga
    showMessage('portfolio', true, 'Actualizando lista de imágenes...', 100000);
    
    // Realizar la petición AJAX
    fetch('portfolio_manager.php?action=refresh')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                showMessage('portfolio', true, `Lista actualizada: ${data.count} imágenes encontradas`);
                loadPortfolioImages(currentPortfolioCategory); // Recargar imágenes
            } else {
                showMessage('portfolio', false, data.message || 'Error al actualizar la lista');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('portfolio', false, 'Error al actualizar la lista: ' + error.message);
        });
}

// ============= FUNCIONES AUXILIARES =============

// Función para obtener el nombre de la categoría
function getCategoryName(category) {
    const categoryNames = {
        'wedding': 'Wedding Planner',
        'eventos': 'Coffe Break',
        'catering': 'Catering',
        'fotovideo': 'Fotografía y Video'
    };
    
    return categoryNames[category] || category;
}

// ============= FUNCIONES DE OPTIMIZACIÓN DE LA IMPLEMENTACIÓN ANTERIOR =============

// Función para inicializar lazy loading de imágenes con efecto elegante
function initLazyLoading(visibleItemsOnly = false) {
    const lazyImages = document.querySelectorAll('.image-item img:not(.loaded)');
    
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
                    
                    // Aplicar efecto de carga
                    setTimeout(() => {
                        // Agregar clase para animación de entrada
                        image.classList.add('loaded');
                        image.style.opacity = 1;
                        image.style.filter = 'blur(0)';
                        image.style.transform = 'scale(1)';
                        
                        // Aplicar transición suave
                        image.style.transition = 'opacity 0.8s ease-out, filter 1s ease-out, transform 0.8s ease-out';
                    }, Math.random() * 300);
                    
                    // Dejar de observar esta imagen
                    observer.unobserve(image);
                }
            });
        }, observerOptions);
        
        // Observar todas las imágenes
        lazyImages.forEach(image => {
            // Configurar estado inicial para animación
            image.style.opacity = 0;
            image.style.filter = 'blur(15px)';
            image.style.transform = 'scale(1.05)';
            
            // Observar imagen
            imageObserver.observe(image);
        });
    } else {
        // Fallback para navegadores que no soportan IntersectionObserver
        lazyImages.forEach((image, index) => {
            // Aplicar una pequeña pausa escalonada para que no aparezcan todas a la vez
            setTimeout(() => {
                image.classList.add('loaded');
                image.style.opacity = 1;
                image.style.filter = 'blur(0)';
                image.style.transform = 'scale(1)';
                image.style.transition = 'opacity 0.8s ease-out, filter 1s ease-out, transform 0.8s ease-out';
            }, index * 100); // Retraso escalonado basado en el índice
        });
    }
}

// Función para agregar estilos personalizados para animaciones
function addCustomStyles() {
    // Verificar si ya existe el estilo personalizado
    if (document.getElementById('custom-admin-styles')) return;
    
    // Crear elemento de estilo
    const style = document.createElement('style');
    style.id = 'custom-admin-styles';
    style.textContent = `
        /* Animaciones para elementos */
        .fade-in-up {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
            animation: fadeInUp 0.5s ease-out forwards;
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
        
        .staggered {
            animation-delay: calc(var(--animation-order) * 100ms);
        }
        
        .image-item {
            overflow: hidden;
            transition: transform 0.3s ease-out;
        }
        
        .image-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .image-item img {
            transition: transform 0.5s ease-out;
        }
        
        .image-item:hover img {
            transform: scale(1.05);
        }
        
        /* Efecto para botones */
        .upload-btn, .delete-btn {
            transition: transform 0.2s ease-out, background-color 0.3s ease-out;
        }
        
        .upload-btn:hover, .delete-btn:hover {
            transform: scale(1.1);
        }
        
        /* Efectos para íconos */
        .fa-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Estilos para el contenedor de botón al final */
        .add-image-button-container {
            margin-top: 30px;
            text-align: center;
            padding: 15px;
            border-top: 1px solid #e0e0e0;
        }
        
        /* Estilos para el contenedor de selección de imagen */
        .select-image-container {
            margin-top: 15px;
            padding: 20px;
            border: 1px dashed #ccc;
            border-radius: 8px;
            text-align: center;
            background-color: #f9f9f9;
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    // Agregar al head
    document.head.appendChild(style);
}

// Función para aplicar efectos visuales a los elementos cargados
function applyVisualEffects() {
    // Aplicar efectos a los botones
    document.querySelectorAll('.upload-btn, .delete-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Aplicar efectos a las pestañas
    document.querySelectorAll('.portfolio-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '#E07E45';
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.color = '';
            }
        });
    });
}

// ============= INICIALIZACIÓN =============

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando panel de administración...');
    
    // Agregar estilos personalizados
    addCustomStyles();
    
    // Cargar imágenes iniciales
    loadCarouselImages();
    loadServiceImages();
    loadPortfolioImages('wedding'); // Cargar la categoría por defecto
    
    // Configurar pestañas del portafolio
    const tabButtons = document.querySelectorAll('.portfolio-tabs .tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            loadPortfolioImages(category);
        });
    });
    
    // Configurar botón de actualizar portafolio
    const refreshButton = document.getElementById('refresh-portfolio');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            // Añadir clase para animación de giro
            this.querySelector('i').classList.add('fa-spin');
            
            // Refrescar imágenes
            refreshPortfolioImages();
            
            // Quitar la animación después de un tiempo
            setTimeout(() => {
                this.querySelector('i').classList.remove('fa-spin');
            }, 1000);
        });
    }
    
    // Aplicar efectos visuales
    applyVisualEffects();
    
    // Iniciar lazy loading
    initLazyLoading();
  
    // Reiniciar lazy loading al redimensionar la ventana
    window.addEventListener('resize', function() {
        initLazyLoading();
    });
    
    // Iniciar comprobación de lazy loading en el evento scroll
    window.addEventListener('scroll', function() {
        initLazyLoading();
    });
});

// Cerrar diálogo de confirmación con la tecla ESC
document.addEventListener('keydown', function(e) {
    const dialog = document.querySelector('.confirmation-dialog');
    if (e.key === 'Escape' && dialog && dialog.style.display === 'flex') {
        dialog.style.display = 'none';
    }
});
