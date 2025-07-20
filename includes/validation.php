<?php
/**
 * Funciones de Validación para Formularios
 * Centro Médico - Sistema de Validación Seguro
 */

/**
 * Valida datos del formulario de contacto
 */
function validateContactForm($data) {
    $errors = array();
    
    // Validar nombre
    if (empty($data['name'])) {
        $errors[] = "El nombre es requerido";
    } elseif (strlen($data['name']) < 2) {
        $errors[] = "El nombre debe tener al menos 2 caracteres";
    } elseif (strlen($data['name']) > 100) {
        $errors[] = "El nombre no puede exceder 100 caracteres";
    }
    
    // Validar email
    if (empty($data['email'])) {
        $errors[] = "El email es requerido";
    } elseif (!isValidEmail($data['email'])) {
        $errors[] = "El formato del email no es válido";
    }
    
    // Validar teléfono (opcional pero si se proporciona debe ser válido)
    if (!empty($data['phone'])) {
        $phone = preg_replace('/[^0-9]/', '', $data['phone']);
        if (strlen($phone) < 10) {
            $errors[] = "El teléfono debe tener al menos 10 dígitos";
        }
    }
    
    // Validar mensaje
    if (empty($data['message'])) {
        $errors[] = "El mensaje es requerido";
    } elseif (strlen($data['message']) < 10) {
        $errors[] = "El mensaje debe tener al menos 10 caracteres";
    } elseif (strlen($data['message']) > 1000) {
        $errors[] = "El mensaje no puede exceder 1000 caracteres";
    }
    
    return $errors;
}

/**
 * Valida datos del formulario de citas
 */
function validateBookingForm($data) {
    $errors = array();
    
    // Validar nombre
    if (empty($data['name'])) {
        $errors[] = "El nombre es requerido";
    } elseif (strlen($data['name']) < 2) {
        $errors[] = "El nombre debe tener al menos 2 caracteres";
    }
    
    // Validar email
    if (empty($data['email'])) {
        $errors[] = "El email es requerido";
    } elseif (!isValidEmail($data['email'])) {
        $errors[] = "El formato del email no es válido";
    }
    
    // Validar teléfono
    if (empty($data['phone'])) {
        $errors[] = "El teléfono es requerido para citas";
    } else {
        $phone = preg_replace('/[^0-9]/', '', $data['phone']);
        if (strlen($phone) < 10) {
            $errors[] = "El teléfono debe tener al menos 10 dígitos";
        }
    }
    
    // Validar fecha
    if (empty($data['date'])) {
        $errors[] = "La fecha es requerida";
    } else {
        $selectedDate = strtotime($data['date']);
        $today = strtotime(date('Y-m-d'));
        
        if ($selectedDate < $today) {
            $errors[] = "La fecha no puede ser anterior a hoy";
        }
        
        // No permitir citas más de 3 meses en el futuro
        $maxDate = strtotime('+3 months');
        if ($selectedDate > $maxDate) {
            $errors[] = "No se pueden agendar citas con más de 3 meses de anticipación";
        }
        
        // Verificar que no sea domingo
        $dayOfWeek = date('w', $selectedDate);
        if ($dayOfWeek == 0) {
            $errors[] = "No atendemos los domingos";
        }
    }
    
    return $errors;
}

/**
 * Protección contra spam básica
 */
function isSpam($data) {
    $spamWords = array('viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here');
    $message = strtolower($data['message'] ?? '');
    
    foreach ($spamWords as $word) {
        if (strpos($message, $word) !== false) {
            return true;
        }
    }
    
    // Verificar si hay demasiados enlaces
    $linkCount = substr_count($message, 'http');
    if ($linkCount > 2) {
        return true;
    }
    
    return false;
}

/**
 * Rate limiting básico (prevenir múltiples envíos)
 */
function checkRateLimit($email) {
    $rateLimitFile = 'temp/rate_limit.json';
    
    // Crear directorio si no existe
    if (!file_exists('temp')) {
        mkdir('temp', 0755, true);
    }
    
    $rateLimits = array();
    if (file_exists($rateLimitFile)) {
        $rateLimits = json_decode(file_get_contents($rateLimitFile), true) ?: array();
    }
    
    $now = time();
    $email = strtolower($email);
    
    // Limpiar entradas antiguas (más de 1 hora)
    foreach ($rateLimits as $emailKey => $timestamp) {
        if ($now - $timestamp > 3600) {
            unset($rateLimits[$emailKey]);
        }
    }
    
    // Verificar si el email ya envió recientemente (menos de 5 minutos)
    if (isset($rateLimits[$email]) && ($now - $rateLimits[$email]) < 300) {
        return false; // Rate limit excedido
    }
    
    // Registrar este envío
    $rateLimits[$email] = $now;
    file_put_contents($rateLimitFile, json_encode($rateLimits));
    
    return true; // OK para enviar
}

/**
 * Sanitizar datos para prevenir XSS
 */
function sanitizeFormData($data) {
    $sanitized = array();
    
    foreach ($data as $key => $value) {
        if (is_string($value)) {
            $sanitized[$key] = cleanInput($value);
        } else {
            $sanitized[$key] = $value;
        }
    }
    
    return $sanitized;
}

/**
 * Formatear teléfono para mostrar
 */
function formatPhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    
    if (strlen($phone) == 10) {
        return sprintf("(%s) %s-%s", 
            substr($phone, 0, 3),
            substr($phone, 3, 3),
            substr($phone, 6, 4)
        );
    }
    
    return $phone;
}
?>
