/**
 * Form Handler System
 * Centro Médico - Manejo de Formularios con AJAX
 */

$(document).ready(function() {
    
    // Configuración general
    const config = {
        showSuccessTime: 5000,
        showErrorTime: 7000,
        submitTimeout: 10000
    };

    /**
     * Mostrar mensaje de estado
     */
    function showMessage(type, message, container) {
        const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const icon = type === 'success' ? '✅' : '❌';
        
        const alertHtml = `
            <div class="alert ${alertClass} alert-dismissible fade show mt-3" role="alert">
                <strong>${icon} ${type === 'success' ? 'Éxito' : 'Error'}:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Remover alertas anteriores
        container.find('.alert').remove();
        
        // Agregar nueva alerta
        container.append(alertHtml);
        
        // Auto-remover después de un tiempo
        setTimeout(() => {
            container.find('.alert').fadeOut();
        }, type === 'success' ? config.showSuccessTime : config.showErrorTime);
        
        // Scroll hacia el mensaje
        $('html, body').animate({
            scrollTop: container.offset().top - 100
        }, 500);
    }

    /**
     * Validación del lado del cliente
     */
    function validateForm(formData, isBooking = false) {
        const errors = [];
        
        // Validar nombre
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('El nombre debe tener al menos 2 caracteres');
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            errors.push('Ingrese un email válido');
        }
        
        // Validar teléfono para citas (más flexible)
        if (isBooking) {
            if (!formData.phone || formData.phone.trim().length === 0) {
                errors.push('El teléfono es requerido para citas');
            } else {
                const phoneDigits = formData.phone.replace(/\D/g, '');
                if (phoneDigits.length < 7) {
                    errors.push('El teléfono debe tener al menos 7 dígitos');
                } else if (phoneDigits.length > 15) {
                    errors.push('El teléfono no puede tener más de 15 dígitos');
                }
            }
        }
        
        // Validar fecha para citas
        if (isBooking) {
            if (!formData.date) {
                errors.push('La fecha es requerida');
            } else {
                const selectedDate = new Date(formData.date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    errors.push('La fecha no puede ser anterior a hoy');
                }
                
                // No permitir domingos
                if (selectedDate.getDay() === 0) {
                    errors.push('No atendemos los domingos');
                }
            }
        }
        
        // Validar mensaje
        if (!formData.message || formData.message.trim().length < 10) {
            errors.push('El mensaje debe tener al menos 10 caracteres');
        }
        
        return errors;
    }

    /**
     * Enviar formulario via AJAX
     */
    function submitForm(form, endpoint, isBooking = false) {
        const submitButton = form.find('button[type="submit"]');
        const originalText = submitButton.text();
        const container = form.closest('.booking-form, .contact-form');
        
        // Obtener datos del formulario
        const formData = {
            name: form.find('input[name="name"]').val(),
            email: form.find('input[name="email"]').val(),
            phone: form.find('input[name="phone"]').val(),
            message: form.find('textarea[name="message"]').val()
        };
        
        if (isBooking) {
            formData.date = form.find('input[name="date"]').val();
        }
        
        // Validar del lado del cliente
        const errors = validateForm(formData, isBooking);
        if (errors.length > 0) {
            showMessage('error', errors.join(', '), container);
            return;
        }
        
        // Deshabilitar botón y mostrar loading
        submitButton.prop('disabled', true).text('Enviando...');
        
        // Detectar si estamos en Live Server o file:// (sin servidor PHP)
        const isLiveServer = window.location.port === '5500' || window.location.protocol === 'file:';
        if (isLiveServer) {
            // Modo de prueba sin servidor
            setTimeout(() => {
                const mockResponse = {
                    success: true,
                    message: `✅ MODO DEMO: ¡Formulario procesado correctamente!

📧 En servidor PHP real se enviaría email a: juannangell@outlook.com

📋 Datos recibidos:
• Nombre: ${formData.name}
• Email: ${formData.email}
• Teléfono: ${formData.phone}
${isBooking ? `• Fecha solicitada: ${new Date(formData.date).toLocaleDateString()}` : ''}

💡 Para funcionalidad real, instala XAMPP y ejecuta en servidor PHP`,
                    data: isBooking ? { requested_date: new Date(formData.date).toLocaleDateString() } : null
                };

                showMessage('success', mockResponse.message, container);

                // Track form submission in Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        event_category: 'engagement',
                        event_label: isBooking ? 'booking_form' : 'contact_form',
                        value: 1
                    });
                }

                form[0].reset();

                if (isBooking && mockResponse.data) {
                    setTimeout(() => {
                        showMessage('success',
                            `📞 DEMO: En servidor real le llamaríamos para confirmar su cita del ${mockResponse.data.requested_date}`,
                            container
                        );
                    }, 2000);
                }

                submitButton.prop('disabled', false).text(originalText);
            }, 1500); // Simular delay de red

            return;
        }

        // Enviar via AJAX (solo en servidor real)
        $.ajax({
            url: endpoint,
            type: 'POST',
            data: formData,
            timeout: config.submitTimeout,
            success: function(response) {
                if (response.success) {
                    showMessage('success', response.message, container);

                    // Track successful form submission
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            event_category: 'engagement',
                            event_label: isBooking ? 'booking_form' : 'contact_form',
                            value: 1
                        });
                    }

                    form[0].reset(); // Limpiar formulario
                    
                    // Mensaje adicional para citas
                    if (isBooking && response.data && response.data.requested_date) {
                        setTimeout(() => {
                            showMessage('success', 
                                `📞 Le llamaremos pronto para confirmar su cita del ${response.data.requested_date}`, 
                                container
                            );
                        }, 2000);
                    }
                } else {
                    showMessage('error', response.message || 'Error al enviar el formulario', container);
                }
            },
            error: function(xhr, status, error) {
                let errorMessage = 'Error de conexión. ';
                
                if (status === 'timeout') {
                    errorMessage += 'El servidor tardó demasiado en responder.';
                } else if (xhr.status === 404) {
                    errorMessage += 'Archivo PHP no encontrado.';
                } else if (xhr.status === 500) {
                    errorMessage += 'Error interno del servidor.';
                } else {
                    errorMessage += 'Intente nuevamente más tarde.';
                }
                
                errorMessage += ' Si el problema persiste, llámenos al 010-020-0340.';
                
                showMessage('error', errorMessage, container);
                
                // Log para debugging solo en desarrollo
                if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
                    console.error('Form submission error:', {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        responseText: xhr.responseText
                    });
                }
            },
            complete: function() {
                // Restaurar botón
                submitButton.prop('disabled', false).text(originalText);
            }
        });
    }

    /**
     * Manejar envío del formulario de citas
     */
    $('#bookingForm').on('submit', function(e) {
        e.preventDefault();
        submitForm($(this), 'process-booking.php', true);
    });

    /**
     * Agregar formulario de contacto si existe
     * (Para futuras implementaciones)
     */
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        submitForm($(this), 'process-contact.php', false);
    });

    /**
     * Mejorar UX del formulario
     */
    
    // Auto-formatear teléfono (más flexible)
    $('input[name="phone"]').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');

        // Limitar a 15 dígitos máximo
        if (value.length > 15) {
            value = value.substring(0, 15);
        }

        // Formatear solo si tiene 10 dígitos (formato US)
        if (value.length === 10) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length > 10) {
            // Para números internacionales, solo agregar espacios
            value = value.replace(/(\d{3})/g, '$1 ').trim();
        }

        $(this).val(value);
    });

    // Validación en tiempo real
    $('input[required], textarea[required]').on('blur', function() {
        const field = $(this);
        const value = field.val().trim();
        
        // Remover clases anteriores
        field.removeClass('is-valid is-invalid');
        
        if (value.length === 0) {
            field.addClass('is-invalid');
        } else {
            // Validaciones específicas
            if (field.attr('type') === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                field.addClass(emailRegex.test(value) ? 'is-valid' : 'is-invalid');
            } else if (field.attr('name') === 'phone') {
                const phoneDigits = value.replace(/\D/g, '');
                field.addClass(phoneDigits.length >= 7 ? 'is-valid' : 'is-invalid');
            } else {
                field.addClass('is-valid');
            }
        }
    });

    // Prevenir envío múltiple
    let isSubmitting = false;
    $('form').on('submit', function() {
        if (isSubmitting) {
            return false;
        }
        isSubmitting = true;
        setTimeout(() => { isSubmitting = false; }, 2000);
    });

    // Solo log en desarrollo
    if (window.ENVIRONMENT && !window.ENVIRONMENT.isProduction) {
        console.log('✅ Form Handler System initialized');
    }
});
