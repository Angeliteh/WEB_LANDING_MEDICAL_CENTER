<?php
/**
 * Procesador de Formulario de Contacto
 * Centro Médico - Sistema de Contacto
 */

// Incluir archivos necesarios
require_once 'config/email-config.php';
require_once 'includes/validation.php';
require_once 'includes/email-templates.php';

// Configurar headers para respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Función para enviar respuesta JSON
function sendResponse($success, $message, $data = null) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => getCurrentDateTime()
    ]);
    exit;
}

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Método no permitido. Use POST.');
}

try {
    // Obtener datos del formulario
    $rawData = [
        'name' => $_POST['name'] ?? '',
        'email' => $_POST['email'] ?? '',
        'phone' => $_POST['phone'] ?? '',
        'message' => $_POST['message'] ?? ''
    ];
    
    // Sanitizar datos
    $data = sanitizeFormData($rawData);
    
    // Validar datos
    $errors = validateContactForm($data);
    
    if (!empty($errors)) {
        sendResponse(false, 'Datos inválidos: ' . implode(', ', $errors));
    }
    
    // Verificar spam
    if (isSpam($data)) {
        sendResponse(false, 'Mensaje detectado como spam.');
    }
    
    // Verificar rate limiting
    if (!checkRateLimit($data['email'])) {
        sendResponse(false, 'Ha enviado un mensaje recientemente. Espere 5 minutos antes de enviar otro.');
    }
    
    // Preparar emails
    $adminEmail = getAdminContactEmail($data);
    $clientEmail = getClientContactConfirmation($data);
    
    // Enviar email al administrador
    $adminSent = mail(
        ADMIN_EMAIL,
        CONTACT_SUBJECT . ' - ' . $data['name'],
        $adminEmail,
        getEmailHeaders()
    );
    
    // Enviar confirmación al cliente
    $clientSent = mail(
        $data['email'],
        CONFIRMATION_SUBJECT,
        $clientEmail,
        getEmailHeaders()
    );
    
    // Verificar envío
    if ($adminSent) {
        // Log del envío exitoso
        $logData = [
            'timestamp' => getCurrentDateTime(),
            'type' => 'contact',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? 'No proporcionado',
            'admin_sent' => $adminSent,
            'client_sent' => $clientSent
        ];
        
        // Guardar log (opcional)
        if (!file_exists('logs')) {
            mkdir('logs', 0755, true);
        }
        file_put_contents(
            'logs/contact_' . date('Y-m-d') . '.log',
            json_encode($logData) . "\n",
            FILE_APPEND | LOCK_EX
        );
        
        sendResponse(true, 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.', [
            'admin_notified' => $adminSent,
            'confirmation_sent' => $clientSent
        ]);
    } else {
        sendResponse(false, 'Error al enviar el mensaje. Intente nuevamente o llámenos directamente.');
    }
    
} catch (Exception $e) {
    // Log del error
    error_log('Error en process-contact.php: ' . $e->getMessage());
    sendResponse(false, 'Error interno del servidor. Intente nuevamente más tarde.');
}
?>
