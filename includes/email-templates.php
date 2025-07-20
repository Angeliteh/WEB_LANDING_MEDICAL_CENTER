<?php
/**
 * Plantillas de Email para Centro Médico
 * Templates HTML profesionales para emails
 */

/**
 * Plantilla base para emails
 */
function getEmailTemplate($title, $content, $isAdmin = false) {
    $logoUrl = "https://www.centromedico.com/images/logo.png"; // Cambiar por URL real
    $websiteUrl = "https://www.centromedico.com";
    
    $template = '
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>' . $title . '</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
            .header { background: #247cff; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .info-box { background: #f8f9fa; border-left: 4px solid #247cff; padding: 15px; margin: 20px 0; }
            .button { display: inline-block; background: #247cff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
            .urgent { background: #dc3545; color: white; padding: 10px; border-radius: 5px; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background: #f8f9fa; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🏥 Centro Médico</h1>
                <p>Atención Médica Profesional</p>
            </div>
            <div class="content">
                ' . $content . '
            </div>
            <div class="footer">
                <p><strong>Centro Médico</strong><br>
                Av. Principal 123, Ciudad, País<br>
                📞 <a href="tel:+1-010-020-0340">010-020-0340</a> | 
                📧 <a href="mailto:juannangell@outlook.com">juannangell@outlook.com</a></p>
                <p>Horarios: Lun-Vie 8:00-18:00 | Sáb 9:00-14:00</p>
                <p><a href="' . $websiteUrl . '">Visitar nuestro sitio web</a></p>
            </div>
        </div>
    </body>
    </html>';
    
    return $template;
}

/**
 * Email para el administrador - Nueva consulta
 */
function getAdminContactEmail($data) {
    $content = '
        <h2>📩 Nueva Consulta desde la Web</h2>
        <div class="urgent">
            <strong>⚠️ NUEVA CONSULTA RECIBIDA</strong><br>
            Fecha: ' . getCurrentDateTime() . '
        </div>
        
        <table>
            <tr><th>Campo</th><th>Información</th></tr>
            <tr><td><strong>Nombre</strong></td><td>' . htmlspecialchars($data['name']) . '</td></tr>
            <tr><td><strong>Email</strong></td><td><a href="mailto:' . htmlspecialchars($data['email']) . '">' . htmlspecialchars($data['email']) . '</a></td></tr>
            <tr><td><strong>Teléfono</strong></td><td>' . (isset($data['phone']) ? '<a href="tel:' . htmlspecialchars($data['phone']) . '">' . formatPhone($data['phone']) . '</a>' : 'No proporcionado') . '</td></tr>
            <tr><td><strong>Mensaje</strong></td><td>' . nl2br(htmlspecialchars($data['message'])) . '</td></tr>
        </table>
        
        <div class="info-box">
            <strong>💡 Acciones recomendadas:</strong><br>
            1. Responder en las próximas 2 horas<br>
            2. Llamar al teléfono si fue proporcionado<br>
            3. Agendar cita si es necesario
        </div>
        
        <p><a href="mailto:' . htmlspecialchars($data['email']) . '?subject=Re: Consulta Centro Médico" class="button">📧 Responder Email</a></p>';
    
    return getEmailTemplate('Nueva Consulta - Centro Médico', $content, true);
}

/**
 * Email para el administrador - Nueva cita
 */
function getAdminBookingEmail($data) {
    $content = '
        <h2>📅 Nueva Solicitud de Cita</h2>
        <div class="urgent">
            <strong>🚨 NUEVA CITA SOLICITADA</strong><br>
            Fecha: ' . getCurrentDateTime() . '
        </div>
        
        <table>
            <tr><th>Campo</th><th>Información</th></tr>
            <tr><td><strong>Nombre</strong></td><td>' . htmlspecialchars($data['name']) . '</td></tr>
            <tr><td><strong>Email</strong></td><td><a href="mailto:' . htmlspecialchars($data['email']) . '">' . htmlspecialchars($data['email']) . '</a></td></tr>
            <tr><td><strong>Teléfono</strong></td><td><a href="tel:' . htmlspecialchars($data['phone']) . '">' . formatPhone($data['phone']) . '</a></td></tr>
            <tr><td><strong>Fecha Solicitada</strong></td><td><strong style="color: #247cff; font-size: 18px;">' . date('d/m/Y', strtotime($data['date'])) . '</strong></td></tr>
            <tr><td><strong>Día de la Semana</strong></td><td>' . date('l', strtotime($data['date'])) . '</td></tr>
            <tr><td><strong>Mensaje</strong></td><td>' . (isset($data['message']) ? nl2br(htmlspecialchars($data['message'])) : 'Sin mensaje adicional') . '</td></tr>
        </table>
        
        <div class="info-box">
            <strong>📋 Acciones requeridas:</strong><br>
            1. <strong>Verificar disponibilidad</strong> para ' . date('d/m/Y', strtotime($data['date'])) . '<br>
            2. <strong>Llamar al paciente</strong> para confirmar<br>
            3. <strong>Agendar en el sistema</strong> interno<br>
            4. <strong>Enviar confirmación</strong> al paciente
        </div>
        
        <p>
            <a href="tel:' . htmlspecialchars($data['phone']) . '" class="button">📞 Llamar Ahora</a>
            <a href="mailto:' . htmlspecialchars($data['email']) . '?subject=Confirmación de Cita - Centro Médico" class="button">📧 Enviar Confirmación</a>
        </p>';
    
    return getEmailTemplate('Nueva Cita Solicitada - Centro Médico', $content, true);
}

/**
 * Email de confirmación para el cliente - Consulta
 */
function getClientContactConfirmation($data) {
    $content = '
        <h2>✅ Hemos Recibido su Consulta</h2>
        <p>Estimado/a <strong>' . htmlspecialchars($data['name']) . '</strong>,</p>
        
        <p>Gracias por contactarnos. Hemos recibido su consulta y nos pondremos en contacto con usted a la brevedad.</p>
        
        <div class="info-box">
            <strong>📋 Resumen de su consulta:</strong><br>
            <strong>Fecha de envío:</strong> ' . getCurrentDateTime() . '<br>
            <strong>Email de contacto:</strong> ' . htmlspecialchars($data['email']) . '<br>
            ' . (isset($data['phone']) ? '<strong>Teléfono:</strong> ' . formatPhone($data['phone']) . '<br>' : '') . '
        </div>
        
        <p><strong>⏰ Tiempo de respuesta:</strong> Normalmente respondemos en menos de 2 horas durante horario de atención.</p>
        
        <p><strong>🕒 Horarios de atención:</strong><br>
        Lunes a Viernes: 8:00 AM - 6:00 PM<br>
        Sábados: 9:00 AM - 2:00 PM<br>
        Domingos: Cerrado</p>
        
        <p><strong>📞 Para urgencias:</strong> Puede llamarnos directamente al <a href="tel:+1-010-020-0340">010-020-0340</a></p>
        
        <p>Saludos cordiales,<br>
        <strong>Equipo Centro Médico</strong></p>';
    
    return getEmailTemplate('Confirmación de Consulta - Centro Médico', $content, false);
}

/**
 * Email de confirmación para el cliente - Cita
 */
function getClientBookingConfirmation($data) {
    $content = '
        <h2>📅 Solicitud de Cita Recibida</h2>
        <p>Estimado/a <strong>' . htmlspecialchars($data['name']) . '</strong>,</p>
        
        <p>Hemos recibido su solicitud de cita. Nos pondremos en contacto con usted para confirmar la disponibilidad.</p>
        
        <div class="info-box">
            <strong>📋 Detalles de su solicitud:</strong><br>
            <strong>Fecha solicitada:</strong> ' . date('d/m/Y', strtotime($data['date'])) . ' (' . date('l', strtotime($data['date'])) . ')<br>
            <strong>Teléfono de contacto:</strong> ' . formatPhone($data['phone']) . '<br>
            <strong>Email:</strong> ' . htmlspecialchars($data['email']) . '
        </div>
        
        <p><strong>📞 Confirmación:</strong> Le llamaremos al ' . formatPhone($data['phone']) . ' para confirmar su cita.</p>
        
        <p><strong>⚠️ Importante:</strong><br>
        • Mantenga su teléfono disponible<br>
        • Si no puede contestar, le enviaremos un email<br>
        • Las citas se confirman por orden de llegada</p>
        
        <p><strong>📋 Qué traer a su cita:</strong><br>
        • Documento de identidad<br>
        • Seguro médico (si aplica)<br>
        • Historial médico previo<br>
        • Lista de medicamentos actuales</p>
        
        <p>Gracias por confiar en nosotros para su atención médica.</p>
        
        <p>Saludos cordiales,<br>
        <strong>Equipo Centro Médico</strong></p>';
    
    return getEmailTemplate('Solicitud de Cita - Centro Médico', $content, false);
}
?>
