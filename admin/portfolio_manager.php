<?php
// Prevenir acceso no autorizado
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
    exit;
}

// Configuración común
header('Content-Type: application/json');

// Obtener la ruta base
$baseUrl = '//' . $_SERVER['HTTP_HOST'] . dirname(dirname($_SERVER['PHP_SELF']));
$basePath = dirname(dirname(__FILE__)); // Ruta base del sistema (nivel raíz)

// Definir rutas correctas según la estructura real de carpetas
$portfolioCategoryPaths = [
    'wedding' => $basePath . '/img/fotos wedding planner/',
    'eventos' => $basePath . '/img/fotos sociales web/',
    'catering' => $basePath . '/img/fotos catering web/',
    'fotovideo' => $basePath . '/img/fotos fografia y video/'
];

// Rutas URL absolutas para servir las imágenes:
$portfolioCategoryUrls = [
    'wedding' => $baseUrl . '/img/fotos wedding planner/',
    'eventos' => $baseUrl . '/img/fotos sociales web/',
    'catering' => $baseUrl . '/img/fotos catering web/',
    'fotovideo' => $baseUrl . '/img/fotos fografia y video/'
];

// Para depuración
error_log("Base URL: " . $baseUrl);
error_log("Base Path: " . $basePath);

$portfolioFile = $basePath . '/data/portfolio.json';
$backupFolder = $basePath . '/backups/portfolio/';

// Crear directorio de backups si no existe
if (!file_exists($backupFolder)) {
    mkdir($backupFolder, 0755, true);
}

// Asegurar que existe el directorio data
if (!file_exists(dirname($portfolioFile))) {
    mkdir(dirname($portfolioFile), 0755, true);
}

// Definir categorías válidas
$validCategories = array_keys($portfolioCategoryPaths);

// Determinar la acción a realizar
$action = isset($_GET['action']) ? $_GET['action'] : '';
error_log("Acción solicitada: " . $action);

switch ($action) {
    case 'get':
        // Obtener imágenes del portafolio
        getPortfolioImages();
        break;
        
    case 'upload':
        // Subir una nueva imagen
        uploadImage();
        break;
        
    case 'delete':
        // Eliminar una imagen
        deleteImage();
        break;
        
    case 'refresh':
        // Refrescar la lista de imágenes (re-escanear los directorios)
        refreshPortfolioImages();
        break;
        
    case 'debug':
        // Para depuración
        debugInfo();
        break;
        
    default:
        // Acción no reconocida
        echo json_encode(['success' => false, 'message' => 'Acción no válida']);
        break;
}

/**
 * Muestra información de depuración
 */
function debugInfo() {
    global $portfolioCategoryPaths, $portfolioCategoryUrls, $baseUrl, $basePath, $portfolioFile;
    
    $info = [
        'success' => true,
        'baseUrl' => $baseUrl,
        'basePath' => $basePath,
        'portfolioFile' => $portfolioFile,
        'portfolioFileExists' => file_exists($portfolioFile),
        'categoryPaths' => $portfolioCategoryPaths,
        'categoryUrls' => $portfolioCategoryUrls
    ];
    
    // Verificar directorios
    foreach ($portfolioCategoryPaths as $cat => $path) {
        $info['directoryExists'][$cat] = is_dir($path);
        
        if (is_dir($path)) {
            $files = glob($path . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
            $info['fileCount'][$cat] = count($files);
            
            if (count($files) > 0) {
                $info['sampleFiles'][$cat] = array_slice($files, 0, 3);
            }
        }
    }
    
    echo json_encode($info, JSON_PRETTY_PRINT);
}

/**
 * Obtener las imágenes del portafolio
 */
function getPortfolioImages() {
    global $portfolioCategoryPaths, $portfolioCategoryUrls, $portfolioFile, $validCategories;
    
    // Obtener la categoría de la URL
    $category = isset($_GET['category']) ? $_GET['category'] : 'wedding';
    $timestamp = time(); // Para evitar caché de imágenes
    
    error_log("Obteniendo imágenes para categoría: " . $category);
    
    // IMPORTANTE: Al cargar las imágenes, siempre re-escanear las carpetas para asegurar
    // que estamos mostrando todas las imágenes existentes, incluso las añadidas manualmente
    $portfolioData = scanAllPortfolioImages();
    
    // Filtrar por categoría
    if (!empty($portfolioData)) {
        $filteredData = [];
        foreach ($portfolioData as $item) {
            if ($item['category'] === $category) {
                $filteredData[] = $item;
            }
        }
        $portfolioData = $filteredData;
    }
    
    // IMPORTANTE: Corregir las rutas para usar URLs absolutas
    foreach ($portfolioData as &$item) {
        // Construir la URL correcta para cada imagen
        if (isset($item['category']) && isset($portfolioCategoryUrls[$item['category']])) {
            $fileName = basename($item['path']);
            $item['path'] = $portfolioCategoryUrls[$item['category']] . $fileName . '?v=' . $timestamp;
        }
    }
    
    error_log("Enviando " . count($portfolioData) . " imágenes");
    
    // Enviar respuesta
    echo json_encode([
        'success' => true,
        'images' => $portfolioData
    ]);
}

/**
 * Forzar el re-escaneo de las imágenes del portafolio
 */
function refreshPortfolioImages() {
    $portfolioData = scanAllPortfolioImages();
    
    echo json_encode([
        'success' => true,
        'message' => 'Lista de imágenes actualizada correctamente',
        'count' => count($portfolioData)
    ]);
}

/**
 * Escanear todas las carpetas del portafolio para encontrar imágenes
 */
function scanAllPortfolioImages() {
    global $portfolioCategoryPaths, $portfolioFile, $validCategories;
    
    $portfolioData = [];
    $nextId = 1;
    
    // Escanear cada carpeta de categoría
    foreach ($validCategories as $category) {
        $categoryPath = $portfolioCategoryPaths[$category];
        
        // Verificar si la carpeta existe
        if (is_dir($categoryPath)) {
            error_log("Escaneando carpeta: " . $categoryPath);
            
            // Buscar imágenes en la carpeta
            $files = glob($categoryPath . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);
            error_log("Encontradas " . count($files) . " imágenes en " . $category);
            
            // Agregar cada imagen encontrada al array
            foreach ($files as $file) {
                $fileName = basename($file);
                
                // Mapear la categoría a la ruta correcta según la estructura real
                $urlPath = '';
                switch ($category) {
                    case 'wedding':
                        $urlPath = 'img/fotos wedding planner/' . $fileName;
                        break;
                    case 'eventos':
                        $urlPath = 'img/fotos sociales web/' . $fileName;
                        break;
                    case 'catering':
                        $urlPath = 'img/fotos catering web/' . $fileName;
                        break;
                    case 'fotovideo':
                        $urlPath = 'img/fotos fografia y video/' . $fileName;
                        break;
                }
                
                $portfolioData[] = [
                    'id' => $nextId++,
                    'path' => $urlPath,
                    'category' => $category
                ];
            }
        } else {
            error_log("La carpeta no existe: " . $categoryPath);
        }
    }
    
    // Guardar los datos en el JSON
    if (!empty($portfolioData)) {
        if (file_put_contents($portfolioFile, json_encode($portfolioData, JSON_PRETTY_PRINT))) {
            error_log("Datos del portafolio guardados en JSON (" . count($portfolioData) . " imágenes)");
        } else {
            error_log("Error al guardar datos en JSON");
        }
    } else {
        // Si no hay imágenes, crear un JSON vacío
        file_put_contents($portfolioFile, json_encode([], JSON_PRETTY_PRINT));
        error_log("No se encontraron imágenes. Se creó un JSON vacío.");
    }
    
    return $portfolioData;
}

/**
 * Subir una nueva imagen al portafolio
 */
function uploadImage() {
    global $portfolioCategoryPaths, $portfolioFile, $validCategories;
    
    $response = ['success' => false, 'message' => 'Error desconocido'];
    
    // Verificar que se haya subido un archivo
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        $response['message'] = 'Error al subir el archivo: ' . ($_FILES['image']['error'] ?? 'archivo no proporcionado');
        echo json_encode($response);
        exit;
    }
    
    // Verificar tipo de imagen
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = $_FILES['image']['type'];
    if (!in_array($fileType, $allowedTypes)) {
        $response['message'] = 'Tipo de archivo no permitido. Use JPG, PNG, GIF o WebP.';
        echo json_encode($response);
        exit;
    }
    
    // Obtener la categoría
    $category = isset($_POST['category']) ? $_POST['category'] : '';
    if (!in_array($category, $validCategories)) {
        $response['message'] = 'Categoría no válida';
        echo json_encode($response);
        exit;
    }
    
    // Obtener ruta de la categoría
    $categoryPath = $portfolioCategoryPaths[$category];
    
    // Verificar que el directorio existe
    if (!is_dir($categoryPath)) {
        $response['message'] = 'La carpeta para esta categoría no existe: ' . $categoryPath;
        echo json_encode($response);
        exit;
    }
    
    // Cargar datos del portafolio
    $portfolioData = [];
    if (file_exists($portfolioFile)) {
        $jsonContent = file_get_contents($portfolioFile);
        $portfolioData = json_decode($jsonContent, true);
        
        if ($portfolioData === null) {
            $portfolioData = [];
        }
    }
    
    // Generar ID para la nueva imagen
    $nextId = 1;
    if (!empty($portfolioData)) {
        $maxId = 0;
        foreach ($portfolioData as $item) {
            if (isset($item['id']) && $item['id'] > $maxId) {
                $maxId = $item['id'];
            }
        }
        $nextId = $maxId + 1;
    }
    
    // Generar nombre de archivo único
    $fileName = $nextId . '_' . time() . '.jpg';
    $filePath = $categoryPath . $fileName;
    
    // Mapear la categoría a la ruta correcta según la estructura real
    $urlPath = '';
    switch ($category) {
        case 'wedding':
            $urlPath = 'img/fotos wedding planner/' . $fileName;
            break;
        case 'eventos':
            $urlPath = 'img/fotos sociales web/' . $fileName;
            break;
        case 'catering':
            $urlPath = 'img/fotos catering web/' . $fileName;
            break;
        case 'fotovideo':
            $urlPath = 'img/fotos fografia y video/' . $fileName;
            break;
    }
    
    // Procesar y guardar la imagen
    try {
        // Crear imagen desde el formato correcto
        $image = null;
        switch ($fileType) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($_FILES['image']['tmp_name']);
                break;
            case 'image/png':
                $image = imagecreatefrompng($_FILES['image']['tmp_name']);
                break;
            case 'image/gif':
                $image = imagecreatefromgif($_FILES['image']['tmp_name']);
                break;
            case 'image/webp':
                $image = imagecreatefromwebp($_FILES['image']['tmp_name']);
                break;
        }
        
        if (!$image) {
            throw new Exception('No se pudo procesar la imagen');
        }
        
        // Dimensiones originales
        $width = imagesx($image);
        $height = imagesy($image);
        
        // Dimensiones deseadas para el portafolio
        $targetWidth = 800;
        $targetHeight = 600;
        
        // Calcular proporciones y dimensiones finales
        $sourceRatio = $width / $height;
        $targetRatio = $targetWidth / $targetHeight;
        
        if ($sourceRatio > $targetRatio) {
            // Imagen más ancha que alta
            $newWidth = $targetHeight * $sourceRatio;
            $newHeight = $targetHeight;
        } else {
            // Imagen más alta que ancha
            $newWidth = $targetWidth;
            $newHeight = $targetWidth / $sourceRatio;
        }
        
        // Crear imagen con nuevas dimensiones
        $newImage = imagecreatetruecolor($targetWidth, $targetHeight);
        
        // Rellenar con blanco por si hay transparencia
        $white = imagecolorallocate($newImage, 255, 255, 255);
        imagefill($newImage, 0, 0, $white);
        
        // Calcular posición para centrar
        $offsetX = ($targetWidth - $newWidth) / 2;
        $offsetY = ($targetHeight - $newHeight) / 2;
        
        // Redimensionar y guardar
        imagecopyresampled(
            $newImage, $image,
            $offsetX, $offsetY, 0, 0,
            $newWidth, $newHeight, $width, $height
        );
        
        // Guardar como JPG con máxima calidad
        if (imagejpeg($newImage, $filePath, 95)) {
            // Después de guardar la imagen, re-escanear todas las carpetas para actualizar el JSON
            $portfolioData = scanAllPortfolioImages();
            
            $response = [
                'success' => true,
                'message' => 'Imagen agregada correctamente',
                'image' => [
                    'id' => $nextId,
                    'path' => $urlPath,
                    'category' => $category
                ]
            ];
        } else {
            throw new Exception('Error al guardar la imagen');
        }
        
        // Liberar memoria
        imagedestroy($image);
        imagedestroy($newImage);
        
    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    }
    
    echo json_encode($response);
}

/**
 * Eliminar una imagen del portafolio
 */
function deleteImage() {
    global $portfolioFile, $backupFolder;
    
    $response = ['success' => false, 'message' => 'Error desconocido'];
    
    // Verificar ID de imagen
    if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
        $response['message'] = 'ID de imagen no válido';
        echo json_encode($response);
        exit;
    }
    
    $imageId = (int)$_POST['id'];
    
    // Verificar si existe el archivo JSON
    if (!file_exists($portfolioFile)) {
        $response['message'] = 'No existe el archivo de datos del portafolio';
        echo json_encode($response);
        exit;
    }
    
    // Leer datos del portafolio
    $jsonContent = file_get_contents($portfolioFile);
    $portfolioData = json_decode($jsonContent, true);
    
    if ($portfolioData === null) {
        $response['message'] = 'El archivo de datos del portafolio no es válido';
        echo json_encode($response);
        exit;
    }
    
    // Buscar la imagen por ID
    $imageIndex = -1;
    $imagePath = '';
    foreach ($portfolioData as $index => $image) {
        if (isset($image['id']) && $image['id'] === $imageId) {
            $imageIndex = $index;
            $imagePath = dirname(dirname(__FILE__)) . '/' . strtok($image['path'], '?'); // Ruta completa al archivo
            break;
        }
    }
    
    // Verificar si se encontró la imagen
    if ($imageIndex === -1) {
        $response['message'] = 'No se encontró la imagen con el ID proporcionado';
        echo json_encode($response);
        exit;
    }
    
    // Hacer backup de la imagen si existe
    if (file_exists($imagePath)) {
        // Crear carpeta de backup si no existe
        if (!file_exists($backupFolder)) {
            mkdir($backupFolder, 0755, true);
        }
        
        $backupPath = $backupFolder . basename($imagePath) . '.' . time() . '.bak';
        copy($imagePath, $backupPath);
        
        // Eliminar archivo
        unlink($imagePath);
    } else {
        error_log("Advertencia: No se encontró el archivo para eliminar: " . $imagePath);
    }
    
    // Después de eliminar la imagen, actualizar el JSON escaneando todas las carpetas
    $portfolioData = scanAllPortfolioImages();
    
    // Respuesta exitosa
    $response = [
        'success' => true,
        'message' => 'Imagen eliminada correctamente'
    ];
    
    echo json_encode($response);
}
?>
