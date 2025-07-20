<?php
/**
 * Procesador de Formulario de Citas
 * Centro Médico - Sistema de Reservas
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
        'date' => $_POST['date'] ?? '',
        'message' => $_POST['message'] ?? ''
    ];
    
    // Sanitizar datos
    $data = sanitizeFormData($rawData);
    
    // Validar datos
    $errors = validateBookingForm($data);
    
    if (!empty($errors)) {
        sendResponse(false, 'Datos inválidos: ' . implode(', ', $errors));
    }
    
    // Verificar spam
    if (isSpam($data)) {
        sendResponse(false, 'Mensaje detectado como spam.');
    }
    
    // Verificar rate limiting
    if (!checkRateLimit($data['email'])) {
        sendResponse(false, 'Ha enviado una solicitud recientemente. Espere 5 minutos antes de enviar otra.');
    }
    
    // Preparar emails
    $adminEmail = getAdminBookingEmail($data);
    $clientEmail = getClientBookingConfirmation($data);
    
    // Enviar email al administrador
    $adminSent = mail(
        ADMIN_EMAIL,
        BOOKING_SUBJECT . ' - ' . date('d/m/Y', strtotime($data['date'])) . ' - ' . $data['name'],
        $adminEmail,
        getEmailHeaders()
    );
    
    // Enviar confirmación al cliente
    $clientSent = mail(
        $data['email'],
        'Solicitud de Cita Recibida - Centro Médico',
        $clientEmail,
        getEmailHeaders()
    );
    
    // Verificar envío
    if ($adminSent) {
        // Log del envío exitoso
        $logData = [
            'timestamp' => getCurrentDateTime(),
            'type' => 'booking',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'requested_date' => $data['date'],
            'admin_sent' => $adminSent,
            'client_sent' => $clientSent
        ];
        
        // Guardar log
        if (!file_exists('logs')) {
            mkdir('logs', 0755, true);
        }
        file_put_contents(
            'logs/booking_' . date('Y-m-d') . '.log',
            json_encode($logData) . "\n",
            FILE_APPEND | LOCK_EX
        );
        
        sendResponse(true, 'Solicitud de cita enviada correctamente. Le llamaremos para confirmar.', [
            'admin_notified' => $adminSent,
            'confirmation_sent' => $clientSent,
            'requested_date' => date('d/m/Y', strtotime($data['date']))
        ]);
    } else {
        sendResponse(false, 'Error al enviar la solicitud. Intente nuevamente o llámenos directamente.');
    }
    
} catch (Exception $e) {
    // Log del error
    error_log('Error en process-booking.php: ' . $e->getMessage());
    sendResponse(false, 'Error interno del servidor. Intente nuevamente más tarde.');
}
?>
