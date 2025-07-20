<?php
/**
 * Configuración de Email para Centro Médico San Rafael
 * Este archivo contiene la configuración para el envío de emails
 */

// Configuración del destinatario (donde llegan los emails)
define('ADMIN_EMAIL', 'contacto@centromedicosanrafael.com');
define('ADMIN_NAME', 'Centro Médico San Rafael');

// Configuración del remitente (desde donde se envían)
define('FROM_EMAIL', 'noreply@centromedicosanrafael.com');
define('FROM_NAME', 'Centro Médico San Rafael - Formulario Web');

// Configuración de respuesta automática
define('REPLY_TO_EMAIL', 'contacto@centromedicosanrafael.com');
define('REPLY_TO_NAME', 'Centro Médico San Rafael');

// Configuración de asuntos
define('CONTACT_SUBJECT', 'Nueva Consulta desde la Web');
define('BOOKING_SUBJECT', 'Nueva Solicitud de Cita');

// Configuración de confirmación para el cliente
define('CONFIRMATION_SUBJECT', 'Confirmación - Hemos recibido su mensaje');

// Headers básicos para emails HTML
function getEmailHeaders($fromEmail = FROM_EMAIL, $fromName = FROM_NAME) {
    $headers = array();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-type: text/html; charset=UTF-8";
    $headers[] = "From: {$fromName} <{$fromEmail}>";
    $headers[] = "Reply-To: " . REPLY_TO_NAME . " <" . REPLY_TO_EMAIL . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    
    return implode("\r\n", $headers);
}

// Función para validar email
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Función para limpiar datos de entrada
function cleanInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Configuración de zona horaria
date_default_timezone_set('America/Mexico_City');

// Función para obtener fecha y hora actual
function getCurrentDateTime() {
    return date('d/m/Y H:i:s');
}

/**
 * INSTRUCCIONES PARA CONFIGURACIÓN:
 * 
 * 1. CAMBIAR EMAILS:
 *    - ADMIN_EMAIL: Email donde quieres recibir los mensajes
 *    - FROM_EMAIL: Email desde el que se envían (debe ser del mismo dominio)
 *    - REPLY_TO_EMAIL: Email para respuestas
 * 
 * 2. PARA TESTING LOCAL:
 *    - Usar servicios como MailHog o Mailtrap
 *    - O configurar SMTP con Gmail/Outlook
 * 
 * 3. PARA PRODUCCIÓN:
 *    - Configurar SPF, DKIM records en DNS
 *    - Usar SMTP autenticado (recomendado)
 *    - Considerar servicios como SendGrid, Mailgun
 */
?>
