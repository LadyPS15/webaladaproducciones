<?php
// index.php
session_start();
if (!empty($_SESSION['user'])) {
    header('Location: pages/index.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alada Producciones</title>
    <link rel="icon" href="../img/logo_alada.png" type="image/png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        /* Estilos para el control de audio */
        .audio-control {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: rgba(109, 76, 61, 0.8);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        }
        .audio-control:hover {
            transform: scale(1.1);
            background-color: #E07E45;
        }
        .audio-control i {
            font-size: 18px;
        }

    </style>
</head>
<body>
    <!-- Elemento de audio para reproducir música de fondo -->
    <audio id="backgroundMusic" loop>
        <source src="../assets/audio/Frédéric Chopin_ Nocturne in E-Flat Major, Op. 9, No. 2.mp3" type="audio/mp3">
        Tu navegador no soporta el elemento de audio.
    </audio>

    <!-- Botón para control de música -->
    <div class="audio-control" id="audioControl" title="Activar/Desactivar música">
        <i class="fas fa-volume-mute" id="audioIcon"></i>
    </div>

    <!-- Header -->
    <header>
        <div class="container header-container">
            <div style="display: flex; align-items: center; margin-right: 300px;">
                <!-- Logo ajustado -->
                <img src="../img/logo_alada.png" alt="Alada Logo" style="width: 120px; height: auto; margin-right: 10px;">
                <!-- Contenedor para ALADA y (CATERING Y EVENTOS) alineados verticalmente -->
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <!-- ALADA -->
                    <h1 style=" font-size: 38px; font-weight: 400; color: #6D4C3D; font-family: 'Playfair Display', serif; letter-spacing: 1px; text-align: center;">ALADA</h1>
                    <!-- CATERING Y EVENTOS en una sola línea -->
                    <p style="margin: 0; font-size: 14px; color: #8a8a8a; font-weight: 300; font-family: 'Montserrat', sans-serif; letter-spacing: 2px; text-transform: uppercase; white-space: nowrap;">CATERING Y EVENTOS</p>
                </div>
            </div>
            <div class="menu-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <nav class="main-nav">
                <ul>
                    <li><a href="#inicio">Inicio<span></span></a></li>
                    <li><a href="#servicios">Servicios<span></span></a></li>
                    <li><a href="#nosotros">Nosotros<span></span></a></li>
                    <li><a href="#portfolio">Portafolio<span></span></a></li>
                    <li><a href="#contacto">Contacto<span></span></a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section with Carousel -->
    <section class="hero" id="inicio">
        <div class="carousel-container">
            <!-- Carousel Slides -->
            <div class="carousel-slide active" style="background-image: url('../img/foto portada/3.jpg')">
                <div class="carousel-overlay"></div>
                <!-- Añadí margin-top para desplazar el título hacia abajo -->
                <div class="hero-content" style="margin-top: 150px;">
                    <h1>"Un Servicio exclusivo y distinto para tus eventos"</h1>
                    <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios" class="btn whatsapp-link" style="background-color: #E07E45; border-radius: 25px;">SOLICITAR INFORMACIÓN</a>
                </div>
            </div>
            <div class="carousel-slide" style="background-image: url('../img/foto portada/1.jpg')">
                <div class="carousel-overlay"></div>
                <!-- Añadí margin-top para desplazar el título hacia abajo -->
                <div class="hero-content" style="margin-top: 120px;">
                    <h1>Arte, Magia y Amor en cada detalle</h1>
                    <p>Creamos experiencias únicas que reflejan tu estilo y personalidad en cada momento especial.</p>
                    <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios" class="btn whatsapp-link">SOLICITAR INFORMACIÓN</a>
                </div>
            </div>
            <div class="carousel-slide" style="background-image: url('../img/foto portada/2.jpg')">
                <div class="carousel-overlay"></div>
                <!-- Añadí margin-top para desplazar el título hacia abajo -->
                <div class="hero-content" style="margin-top: 130px;">
                    <h1>Hacemos de tu evento un momento inolvidable</h1>
                    <p>Nuestro equipo de profesionales se encarga de cada detalle para que tu evento sea perfecto.</p>
                    <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios" class="btn whatsapp-link">SOLICITAR INFORMACIÓN</a>
                </div>
            </div>
        </div>
        <!-- Carousel Navigation -->
        <div class="carousel-nav">
            <div class="carousel-dot active"></div>
            <div class="carousel-dot"></div>
            <div class="carousel-dot"></div>
        </div>
    </section>

    <!-- Divisor en fondo blanco antes de la sección Nuestros servicios -->
    <section style="padding: 80px 0 60px; background-color: #fdf3ea;">
        <div class="container">
            <div class="decorative-divider"
                style="display: flex; align-items: center; justify-content: center; margin: auto; max-width: 1500px;">
                <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
                <img src="../img/logo_alada.png" alt="Separador"
                style="width: 120px; margin: 0 15px; opacity: 0.7;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="section" id="servicios" style="padding-top: 20px;">
        <div class="container">
            <div class="section-title">
                <h2>NUESTROS SERVICIOS</h2>
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; max-width: 1200px; margin: 0 auto 30px;">
                <div class="service-card" style="background-color: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <img src="../img/fotos wedding planner/9.jpg" alt="Wedding Planner" style="width: 100%; height: 230px; object-fit: cover;">
                    <div class="service-content" style="padding: 25px; text-align: center;">
                        <h3 style="font-size: 24px; margin-bottom: 15px; color: #6D4C3D; font-family: 'Playfair Display', serif; font-weight: 500;">Wedding Planner</h3>
                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Detalles de ARTE, MAGIA y AMOR para crear tu boda soñada.</p>
                        <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20Wedding%20Planner" class="btn whatsapp-link" data-service="Wedding Planner" style="background-color: #E07E45; font-size: 14px; padding: 10px 25px; text-transform: uppercase;">Ver más</a>
                    </div>
                </div>
                <div class="service-card" style="background-color: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <img src="../img/fotos catering web/5.jpg" alt="Catering" style="width: 100%; height: 230px; object-fit: cover;">
                    <div class="service-content" style="padding: 25px; text-align: center;">
                        <h3 style="font-size: 24px; margin-bottom: 15px; color: #6D4C3D; font-family: 'Playfair Display', serif; font-weight: 500;">Catering</h3>
                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Bebidas, comidas, menaje, mantelería y personal de servicio altamente capacitado.</p>
                        <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20Catering" class="btn whatsapp-link" data-service="Catering" style="background-color: #E07E45; font-size: 14px; padding: 10px 25px; text-transform: uppercase;">Ver más</a>
                    </div>
                </div>
                <div class="service-card" style="background-color: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <img src="../img/fotos fografia y video/6.jpg" alt="Fotografía y Video" style="width: 100%; height: 230px; object-fit: cover;">
                    <div class="service-content" style="padding: 25px; text-align: center;">
                        <h3 style="font-size: 24px; margin-bottom: 15px; color: #6D4C3D; font-family: 'Playfair Display', serif; font-weight: 500;">Fotografía y Video</h3>
                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Capturamos los momentos más especiales de tu evento con la más alta calidad.</p>
                        <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20Fotografía%20y%20Video" class="btn whatsapp-link" data-service="Fotografía y Video" style="background-color: #E07E45; font-size: 14px; padding: 10px 25px; text-transform: uppercase;">Ver más</a>
                    </div>
                </div>
            </div>
            <!-- Eventos en una fila separada ocupando la mitad del ancho -->
            <div style="max-width: 400px; margin: 0 auto;">
                <div class="service-card" style="background-color: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                    <img src="../img/fotos sociales web/7.jpg" alt="Eventos" style="width: 100%; height: 230px; object-fit: cover;">
                    <div class="service-content" style="padding: 25px; text-align: center;">
                        <h3 style="font-size: 24px; margin-bottom: 15px; color: #6D4C3D; font-family: 'Playfair Display', serif; font-weight: 500;">Coffee Break</h3>
                        <p style="margin-bottom: 20px; color: #666; line-height: 1.6;">Especialistas en eventos corporativos, Wedding Planner, fiestas de cumpleaños y eventos especiales.</p>
                        <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20Coffee%20Break" class="btn whatsapp-link" data-service="Eventos" style="background-color: #E07E45; font-size: 14px; padding: 10px 25px; text-transform: uppercase;">Ver más</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- El resto del HTML permanece igual -->
    <!-- Divisor en fondo blanco antes de la sección Quiénes Somos -->
    <section style="padding: 0px 0 60px; background-color: #fdf3ea;">
        <div class="container">
            <div class="decorative-divider"
                style="display: flex; align-items: center; justify-content: center; margin: auto; max-width: 1500px;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            <img src="../img/logo_alada.png" alt="Separador"
                style="width: 120px; margin: 0 15px; opacity: 0.7;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            </div>
        </div>
    </section>

    <!-- Sección Quiénes Somos con fondo gris -->
    <section class="section about" id="nosotros" style="padding-top: 30px; background-color: #fdf3ea; margin-top: 0;">
        <div class="container">
            <div class="section-title">
                <h2>QUIENES SOMOS</h2>
            </div>
            <!-- Contenido de la sección -->
            <div class="about-container">
                <div class="about-image">
                    <img src="../img/fotos catering web/2.jpg" alt="Sobre Nosotros">
                </div>
                <div class="about-content">
                    <h2>ALADA Catering y Eventos</h2>
                    <p>Es una empresa enfocada en ofrecemos soluciones y respuestas positivas brindándote no solo una amplia variedad de servicios sino la posibilidad de que el cliente arme su propio servicio combinando elementos de acuerdo a sus gustos y preferencias.</p>
                    <p>Somos un equipo dinámico, fresco y funcional, con capacidad de adaptarse a cualquier situación. Ofrecemos distintas opciones de servicio integral de planificación.</p>
                    <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios" class="btn whatsapp-link">Contáctanos</a>
                </div>
            </div>
        </div>
    </section>

    <!-- Divisor entre Quiénes Somos y Portafolio -->
    <section style="padding: 60px 0 60px;">
        <div class="container">
            <div class="decorative-divider"
                style="display: flex; align-items: center; justify-content: center; margin: auto; max-width: 1500px;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            <img src="../img/logo_alada.png" alt="Separador"
                style="width: 120px; margin: 0 15px; opacity: 0.7;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            </div>
        </div>
    </section>

    <!-- Portfolio Section -->
    <section class="section" id="portfolio" style="padding-top: 20px;">
        <div class="container">
            <div class="section-title">
                <h2>PORTAFOLIO</h2>
            </div>
            <div class="portfolio-tabs">
                <button class="tab-btn active">Todos</button>
                <button class="tab-btn">Wedding Planner</button>
                <button class="tab-btn">Coffe Break</button>
                <button class="tab-btn">Catering</button>
                <button class="tab-btn">Fotografía y Video</button>
            </div>
            <div class="portfolio-grid">
                <div class="portfolio-item">
                    <img src="img/fotos wedding planner/13.jpg" alt="Wedding Planner">
                    <div class="portfolio-overlay">
                        <a href="#" class="portfolio-view-btn" data-img="img/fotos wedding planner/img_servicio_wedding.jpg"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="../img/fotos catering web/14.jpg" alt="Catering">
                    <div class="portfolio-overlay">
                        <a href="#" class="portfolio-view-btn" data-img="img/fotos catering web/img_servicio_catering.png"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="../img/fotos sociales web/6.jpg" alt="Eventos">
                    <div class="portfolio-overlay">
                        <a href="#" class="portfolio-view-btn" data-img="img/fotos eventos sociales/img_servicio_eventos.jpg"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="../img/fotos catering web/5.jpg" alt="Catering">
                    <div class="portfolio-overlay">
                        <a href="#" class="portfolio-view-btn" data-img="img/fotos catering web/img_servicio_catering.png"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="../img/fotos wedding planner/11.jpg" alt="Decoración">
                    <div class="portfolio-overlay">
                        <a href="#" class="portfolio-view-btn" data-img="img/fotos wedding planner/img_portfolio_decoracion.jpg"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
                <div class="portfolio-item">
                    <img src="../img/fotos eventos sociales/img_servicio_fotovideo.jpg" alt="Fotografía y Video">
                    <div class="portfolio-overlay">
                        <a href="#" class="portfolio-view-btn" data-img="img/fotos eventos sociales/img_servicio_fotovideo.jpg"><i class="fas fa-eye"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Modal para mostrar imagen en tamaño grande -->
    <div id="imageModal" class="image-modal">
        <span class="close-modal">&times;</span>
        <div class="modal-content">
            <img id="modalImage" src="" alt="Imagen en tamaño grande">
        </div>
    </div>

    <!-- Divisor entre Portafolio y Contáctanos -->
    <section style="padding: 0px 0 60px;">
        <div class="container">
            <div class="decorative-divider"
                style="display: flex; align-items: center; justify-content: center; margin: auto; max-width: 1500px;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            <img src="../img/logo_alada.png" alt="Separador"
                style="width: 120px; margin: 0 15px; opacity: 0.7;">
            <div style="height: 3px; background-color: #d0d0d0; flex: 3;"></div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="section" id="contacto" style="padding-top: 20px;">
        <div class="container">
            <div class="section-title">
                <h2>CONTÁCTANOS</h2>
            </div>
            <div class="contact-wrapper">
                <div class="contact-info">
                    <div class="contact-card">
                        <div class="icon-box">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <h3>Dirección</h3>
                        <p>Lima, Perú</p>
                    </div>
                    <div class="contact-card">
                        <div class="icon-box">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <h3>Email</h3>
                        <p>eventos@aladaproducciones.com</p>
                    </div>
                    <div class="contact-card">
                        <div class="icon-box">
                            <i class="fas fa-phone"></i>
                        </div>
                        <h3>Teléfono</h3>
                        <p>+51 937 174 954</p>
                    </div>
                </div>
                <div class="contact-form">
                    <form id="contactForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Nombre Completo</label>
                                <input type="text" id="name" placeholder="Ingresa tu nombre" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Correo Electrónico</label>
                                <input type="email" id="email" placeholder="Ingresa tu correo" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="phone">Teléfono</label>
                                <input type="tel" id="phone" placeholder="Ingresa tu teléfono" required>
                            </div>
                            <div class="form-group">
                                <label for="event">Tipo de Evento</label>
                                <select id="event" required>
                                    <option value="" disabled selected>Selecciona una opción</option>
                                    <option value="boda">Boda</option>
                                    <option value="corporativo">Evento Corporativo</option>
                                    <option value="cumpleanos">Cumpleaños</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="date">Fecha del Evento</label>
                            <input type="date" id="date">
                        </div>
                        <div class="form-group">
                            <label for="guests">Número de Invitados</label>
                            <input type="number" id="guests" placeholder="Número aproximado de invitados">
                        </div>
                        <div class="form-group">
                            <label for="message">Mensaje</label>
                            <textarea id="message" placeholder="Cuéntanos más detalles sobre tu evento" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn" id="submitContactForm">Enviar a formulario</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-container">
                <div class="footer-about">
                    <div class="footer-logo">
                        <img src="../img/logo_alada.png" alt="Alada Logo" style="filter: brightness(0) invert(1);">
                    </div>
                    <p>Un lugar exclusivo y distinto para celebrar tus eventos. Ofrecemos distintas opciones de servicio integral de planificación.</p>
                </div>
                <div class="footer-contact">
                    <h3>Contacto</h3>
                    <ul>
                        <li>
                            <i class="fas fa-map-marker-alt"></i>
                            <span>Lima, Perú</span>
                            </li>
                            <li>
                            </li>
                        <li>
                            <i class="fas fa-phone"></i>
                            <span>+51 937 174 954</span>
                        </li>
                    </ul>
                </div>
                <div class="footer-links">
                    <h3>Enlaces Rápidos</h3>
                    <ul>
                        <li><a href="#">Inicio</a></li>
                        <li><a href="#servicios">Servicios</a></li>
                        <li><a href="#nosotros">Nosotros</a></li>
                        <li><a href="#portfolio">Portafolio</a></li>
                        <li><a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios" class="whatsapp-link">Contacto</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios" class="whatsapp-link"><i class="fab fa-whatsapp"></i></a>
                </div>
                <p>  &copy; 2025  <a href="../admin/login.php"     style="color: inherit; text-decoration: none; cursor: inherit;">    Alada Producciones  </a>  | Todos los derechos reservados</p>
            </div>
        </div>
    </footer>

    <!-- WhatsApp Button Rectangular (Nuevo) -->
    <a href="https://wa.me/51997663955?text=Hola%2C%20estoy%20interesado%20en%20sus%20servicios" class="whatsapp-rectangular-btn" target="_blank" id="whatsappBtn">
        <div class="whatsapp-icon-container">
            <i class="fab fa-whatsapp"></i>
            <div class="notification-badge">1</div>
        </div>
        <div class="whatsapp-text-container">
            ¡Te Ayudamos!
        </div>
    </a>

    <script src="../assets/js/scripts-modified.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Elementos del DOM
        const backgroundMusic = document.getElementById('backgroundMusic');
        const audioControl = document.getElementById('audioControl');
        const audioIcon = document.getElementById('audioIcon');

        // Estado inicial (música en mute)
        backgroundMusic.volume = 0.3; // Volumen bajo por defecto
        backgroundMusic.muted = true;

        // Intentar reproducir la música cuando se interactúa con la página
        document.addEventListener('click', function() {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(function(error) {
                    console.log("Error al reproducir la música: ", error);
                });
            }
        }, { once: true });

        // Función para cambiar el estado de la música
        function toggleMusic() {
            if (backgroundMusic.muted) {
                backgroundMusic.muted = false;
                audioIcon.className = 'fas fa-volume-up';
                // Intentar reproducir si está pausada
                if (backgroundMusic.paused) {
                    backgroundMusic.play().catch(function(error) {
                        console.log("Error al reproducir la música: ", error);
                    });
                }
            } else {
                backgroundMusic.muted = true;
                audioIcon.className = 'fas fa-volume-mute';
            }
        }

        // Evento para el botón de control de audio
        audioControl.addEventListener('click', toggleMusic);

        // Reproducir automáticamente (aunque probablemente será bloqueado por el navegador)
        backgroundMusic.play().catch(function(error) {
            console.log("Reproducción automática bloqueada por el navegador: ", error);
        });

        // Configuración para la notificación de WhatsApp
        const whatsappBtn = document.getElementById('whatsappBtn');
        const notificationBadge = document.querySelector('.notification-badge');

        // NUEVO: Inicialmente ocultar la notificación
        if (notificationBadge) {
            notificationBadge.style.opacity = '0';
            
            // Mostrar la notificación después de 1.5 segundos
            setTimeout(function() {
                notificationBadge.style.opacity = '1';
                notificationBadge.classList.add('visible');
            }, 1500); // 1.5 segundos
        }

        // Función para animar la notificación (pulsar más fuerte cada cierto tiempo)
        function pulseNotification() {
            notificationBadge.style.animation = 'none';
            setTimeout(function() {
                notificationBadge.style.animation = 'notification-pulse 2s infinite';
            }, 10);
        }

        // Pulsar la notificación cada 15 segundos
        setInterval(pulseNotification, 25000);

        // Cuando el usuario hace clic en el botón de WhatsApp, eliminar la notificación
        whatsappBtn.addEventListener('click', function() {
            notificationBadge.style.display = 'none';
        });

        // Configuración para los enlaces de WhatsApp
        const whatsappLinks = document.querySelectorAll('.whatsapp-link');
        whatsappLinks.forEach(function(link) {
            if (!link.getAttribute('href')) {
                // Si no tiene un href establecido, agregar uno predeterminado
                link.setAttribute('href', 'https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20sus%20servicios');
                link.setAttribute('target', '_blank');
            }
            
            // Agregar evento para capturar el servicio si está disponible
            const service = link.getAttribute('data-service');
            if (service) {
                link.setAttribute('href', `https://wa.me/51997663955?text=Hola,%20estoy%20interesado%20en%20el%20servicio%20de%20${encodeURIComponent(service)}`);
            }
        });

        // MENÚ MÓVIL - Corregido para asegurar que funcione correctamente
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        if (menuToggle && mainNav) {
            // Eliminar listeners previos (por si acaso)
            const newMenuToggle = menuToggle.cloneNode(true);
            menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
            // Agregar nuevo event listener
            newMenuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                console.log('Menú toggle clicked', mainNav.classList.contains('active') ? 'activado' : 'desactivado');
            });
        }
    });
    </script>
</body>
</html>
