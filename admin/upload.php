<?php
// Prevenir acceso no autorizado
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['success' => false, 'message' => 'Acceso no autorizado']);
    exit;
}

// Configuración
header('Content-Type: application/json');
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

// Determinar la ruta de destino según el tipo y el índice
$type = isset($_POST['type']) ? $_POST['type'] : '';
$index = isset($_POST['index']) ? (int)$_POST['index'] : 0;
$serviceType = isset($_POST['serviceType']) ? $_POST['serviceType'] : '';

$targetPath = '';
$backupPath = '../backups/'; // Directorio para copias de seguridad

// Crear directorio de backups si no existe
if (!file_exists($backupPath)) {
    mkdir($backupPath, 0755, true);
}

// Determinar la ruta del archivo a reemplazar
if ($type === 'carousel') {
    // Para imágenes del carrusel
    $targetPath = '../img/foto portada/' . $index . '.jpg';
} elseif ($type === 'service') {
    // Para imágenes de servicios
    switch ($serviceType) {
        case 'wedding':
            $targetPath = '../img/fotos wedding planner/9.jpg';
            break;
        case 'catering':
            $targetPath = '../img/fotos catering web/5.jpg';
            break;
        case 'fotovideo':
            $targetPath = '../img/fotos fografia y video/6.jpg';
            break;
        case 'eventos':
            $targetPath = '../img/fotos sociales web/7.jpg';
            break;
        default:
            $response['message'] = 'Tipo de servicio no reconocido: ' . $serviceType;
            echo json_encode($response);
            exit;
    }
}

if (empty($targetPath)) {
    $response['message'] = 'No se pudo determinar la ruta de destino';
    echo json_encode($response);
    exit;
}

// Verificar permisos de escritura
if (!is_writable(dirname($targetPath))) {
    $response['message'] = 'No hay permisos de escritura en el directorio: ' . dirname($targetPath);
    echo json_encode($response);
    exit;
}

// Hacer copia de seguridad del archivo original
if (file_exists($targetPath)) {
    $backupFile = $backupPath . basename($targetPath) . '.' . time() . '.bak';
    copy($targetPath, $backupFile);
}

// Procesar y guardar la nueva imagen
try {
    // Convertir todas las imágenes a JPG para consistencia
    $image = null;
    
    // Crear imagen desde el formato correcto
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
    
    // Determinar dimensiones según el tipo
    $width = imagesx($image);
    $height = imagesy($image);
    
    // Crear lienzo para la nueva imagen con dimensiones adecuadas
    if ($type === 'carousel') {
        // Para carrusel, mantener proporciones pero asegurar mínimo 1920x1080
        $targetWidth = 1920;
        $targetHeight = 1080;
    } else {
        // Para servicios, mantener proporciones pero asegurar tamaño adecuado
        $targetWidth = 600;
        $targetHeight = 400;
    }
    
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
    if (imagejpeg($newImage, $targetPath, 95)) {
        $response = [
            'success' => true,
            'message' => 'Imagen actualizada correctamente',
            'path' => $targetPath . '?v=' . time() // Añadir timestamp para evitar caché
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
?>
