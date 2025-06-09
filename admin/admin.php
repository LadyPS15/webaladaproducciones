<?php
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alada Producciones - Panel de Administración</title>
    <link rel="icon" href="../img/logo_alada.png" type="image/png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
     /* CSS Limpio y Optimizado para admin.php */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Montserrat', sans-serif;
        }

        body {
            background-color: #f9f9f9;
            color: #333;
            line-height: 1.6;
        }

        .admin-header {
            background-color: white;
            padding: 15px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .header-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-container {
            display: flex;
            align-items: center;
        }

        .logo-container img {
            width: 70px;
            margin-right: 15px;
        }

        .logo-container h1 {
            font-size: 20px;
            font-weight: 400;
            color: #6D4C3D;
        }

        .admin-actions {
            display: flex;
            gap:5px;
        }

        .logout-btn {
            background-color: #6D4C3D;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
            text-decoration: none;
        }

        .logout-btn:hover {
            background-color: #8a6150;
        }

        .admin-content {
            padding: 40px 0;
        }

        .section-title {
            margin-bottom: 30px;
            text-align: center;
        }

        .section-title h2 {
            font-size: 28px;
            color: #6D4C3D;
            font-family: 'Playfair Display', serif;
            font-weight: 400;
            position: relative;
            display: inline-block;
            padding-bottom: 10px;
        }

        .section-title h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 3px;
            background-color: #E07E45;
        }

        .admin-section {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            padding: 30px;
            margin-bottom: 40px;
        }

        .admin-section h3 {
            font-size: 20px;
            color: #6D4C3D;
            margin-bottom: 20px;
            font-weight: 500;
        }

        /* Grid para imágenes */
        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
            min-height: 100px;
        }

        /* Estilos para contenedor vacío */
        .images-grid p.text-center {
            grid-column: 1 / -1;
            text-align: center;
            padding: 30px;
            color: #666;
        }

        .image-item {
            border: 1px solid #eee;
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        }

        .image-item img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            display: block;
        }

        /* Estilos para manejo de errores en imágenes */
        .error-image {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            min-height: 150px;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.7;
        }

        .image-actions {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            padding: 5px;
        }

        .image-info {
            padding: 10px;
            background-color: #f5f5f5;
            font-size: 14px;
        }

        /* Contenedor de carga de archivos */
        .upload-container {
            margin-top: 20px;
            border: 2px dashed #ddd;
            padding: 30px;
            text-align: center;
            border-radius: 4px;
            transition: border-color 0.3s;
        }

        .upload-container:hover {
            border-color: #E07E45;
        }

        .upload-icon {
            font-size: 30px;
            color: #E07E45;
            margin-bottom: 15px;
        }

        .upload-message {
            margin-bottom: 15px;
            color: #666;
        }

        .file-input {
            display: none;
        }

        /* Botones */
        .upload-btn {
            background-color: #E07E45;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
        }

        .upload-btn:hover {
            background-color: #d06c35;
        }

        /* Mensajes de éxito y error */
        .success-message, .error-message {
            padding: 15px;
            margin-top: 20px;
            border-radius: 4px;
            text-align: center;
            display: none;
        }

        .success-message {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .error-message {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        /* Footer */
        .footer {
            background-color: white;
            padding: 20px 0;
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-top: 40px;
        }

        /* Estilos para el portafolio */
        .portfolio-tabs {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        .portfolio-tabs .tab-btn {
            background: none;
            border: none;
            padding: 10px 15px;
            margin-right: 5px;
            cursor: pointer;
            font-size: 14px;
            color: #6D4C3D;
            transition: all 0.3s ease;
            position: relative;
        }

        .portfolio-tabs .tab-btn:after {
            content: '';
            position: absolute;
            width: 0;
            height: 3px;
            background-color: #E07E45;
            bottom: 0;
            left: 0;
            transition: width 0.3s ease;
        }

        .portfolio-tabs .tab-btn.active {
            color: #E07E45;
            font-weight: 500;
        }

        .portfolio-tabs .tab-btn.active:after,
        .portfolio-tabs .tab-btn:hover:after {
            width: 100%;
        }

        /* Botón para agregar imágenes */
        .add-image-container {
            text-align: center;
            grid-column: 1 / -1;
            margin: 20px 0;
        }

        /* Botón de eliminar */
        .image-item .delete-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            margin-left: 5px;
        }

        .image-item .delete-btn:hover {
            background-color: #bd2130;
        }

        /* Diálogo de confirmación */
        .confirmation-dialog {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .confirmation-content {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        }

        .confirmation-content p {
            margin-bottom: 20px;
        }

        .confirmation-buttons {
            display: flex;
            justify-content: center;
            gap: 10px;
        }

        .confirm-btn {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
        }

        .cancel-btn {
            background-color: #6c757d;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
        }

        /* Indicador de carga */
        .loading-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            grid-column: 1 / -1;
        }

        .loading-indicator i {
            margin-right: 10px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Formularios */
        .form-group {
            margin-bottom: 15px;
            text-align: left;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #6D4C3D;
        }

        .form-group select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white;
        }

        /* Depuración */
        .debug-info {
            padding: 10px;
            margin-top: 20px;
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            white-space: pre-wrap;
            display: none; /* Oculto por defecto */
        }
        .portfolio-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        .portfolio-tabs {
            display: flex;
            flex-wrap: wrap;
        }

        .refresh-btn {
            background-color: #6D4C3D;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            display: flex;
            align-items: center;
            transition: background-color 0.3s;
        }

        .refresh-btn i {
            margin-right: 5px;
        }

        .refresh-btn:hover {
            background-color: #8a6150;
        }

        /* Animación de rotación para iconos */
        .fa-spin {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsivo */
        @media (max-width: 768px) {
            .images-grid {
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            }
            
            .admin-section {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <header class="admin-header">
        <div class="container header-flex">
            <div class="logo-container">
                <img src="../img/logo_alada.png" alt="Alada Producciones Logo">
                <h1>Panel de Administración</h1>
            </div>
            <div class="admin-actions">
                <a href="../pages/index.php" class="logout-btn">Ir al sitio</a>
                <div></div>
                <a href="logout.php" class="logout-btn">Cerrar Sesión</a>
            </div>
        </div>
    </header>
    
    <main class="admin-content">
        <div class="container">
            <div class="section-title">
                <h2>Gestión de Imágenes</h2>
            </div>
            
            <!-- Sección Carrusel -->
            <section class="admin-section">
                <h3>Imágenes del Carrusel</h3>
                
                <div id="carousel-images" class="images-grid">
                    <!-- Las imágenes del carrusel se cargarán aquí dinámicamente -->
                </div>
                
                <div class="upload-container" id="carousel-upload" style="display: none;">
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="upload-message">
                        <p>Selecciona una nueva imagen para reemplazar la imagen del carrusel</p>
                        <p><small>Recomendación: 1920 x 1080 pixeles</small></p>
                    </div>
                    <input type="file" id="carousel-file" class="file-input" accept="image/*">
                    <button class="upload-btn" onclick="document.getElementById('carousel-file').click()">Seleccionar Imagen</button>
                    <input type="hidden" id="carousel-index" value="">
                </div>
                
                <div id="carousel-success" class="success-message">
                    Imagen actualizada correctamente
                </div>
                
                <div id="carousel-error" class="error-message">
                    Error al actualizar la imagen. Inténtelo de nuevo.
                </div>
            </section>
            
            <!-- Sección Servicios -->
            <section class="admin-section">
                <h3>Imágenes de Nuestros Servicios</h3>
                
                <div id="services-images" class="images-grid">
                    <!-- Las imágenes de servicios se cargarán aquí dinámicamente -->
                </div>
                
                <div class="upload-container" id="services-upload" style="display: none;">
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="upload-message">
                        <p>Selecciona una nueva imagen para reemplazar la imagen de servicio</p>
                        <p><small>Recomendación: 600 x 400 pixeles</small></p>
                    </div>
                    <input type="file" id="services-file" class="file-input" accept="image/*">
                    <button class="upload-btn" onclick="document.getElementById('services-file').click()">Seleccionar Imagen</button>
                    <input type="hidden" id="service-type" value="">
                </div>
                
                <div id="services-success" class="success-message">
                    Imagen actualizada correctamente
                </div>
                
                <div id="services-error" class="error-message">
                    Error al actualizar la imagen. Inténtelo de nuevo.
                </div>
            </section>

            <!-- Sección Portafolio -->
            <section class="admin-section">
                <h3>Imágenes del Portafolio</h3>
                
                <div class="portfolio-controls">
                    <div class="portfolio-tabs">
                        <button class="tab-btn active" data-category="wedding">Wedding Planner</button>
                        <button class="tab-btn" data-category="eventos">Coffe Break</button>
                        <button class="tab-btn" data-category="catering">Catering</button>
                        <button class="tab-btn" data-category="fotovideo">Fotografía y Video</button>
                    </div>
                    
                    <button id="refresh-portfolio" class="refresh-btn" title="Actualizar lista de imágenes">
                        <i class="fas fa-sync-alt"></i> Actualizar
                    </button>
                </div>
                
<div id="portfolio-images" class="images-grid portfolio-grid">
                    <!-- Las imágenes del portafolio se cargarán aquí dinámicamente -->
                </div>
                
                <div class="upload-container" id="portfolio-upload" style="display: none;">
                    <!-- El contenido de este div se generará dinámicamente por JavaScript -->
                </div>
                
                <div id="portfolio-success" class="success-message">
                    Operación realizada correctamente
                </div>
                
                <div id="portfolio-error" class="error-message">
                    Error al procesar la operación. Inténtelo de nuevo.
                </div>
            </section>
        </div>
    </main>
    
    <footer class="footer">
        <div class="container">
            <p>&copy; 2025 Alada Producciones | Panel de Administración</p>
        </div>
    </footer>
    
    <script src="admin.js"></script>
</body>
</html>
