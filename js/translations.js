// Sistema de traducciones para Centro Médico San Rafael
// Soporte para Español (ES) e Inglés (EN)

const translations = {
    es: {
        // Meta y título
        title: "Centro Médico - Cuidado de la Salud",
        metaDescription: "Centro médico profesional con servicios de salud integral. Consultas médicas, especialidades y atención de emergencia.",
        
        // Navegación
        nav: {
            home: "Inicio",
            about: "Nosotros", 
            timeline: "Servicios",
            testimonials: "Testimonios",
            booking: "Citas",
            contact: "Contacto"
        },
        
        // Marca
        brand: {
            name: "Centro Médico",
            subtitle: "Especialistas en Salud"
        },
        
        // Hero Section
        hero: {
            title: "Mejor",
            animatedItems: ["salud", "atención", "cuidado"],
            description: "Centro Médico San Rafael es su clínica de confianza con más de 15 años de experiencia brindando atención médica integral y personalizada para toda la familia en el corazón de la Ciudad de México.",
            bookAppointment: "Agendar Cita"
        },
        
        // About Section
        about: {
            title: "Dr. Carlos Mendoza - Director Médico",
            description1: "Con más de 15 años de experiencia en medicina interna y familiar, el Dr. Carlos Mendoza lidera nuestro equipo médico especializado. Egresado de la UNAM con especialidad en el Hospital General de México, se dedica a brindar atención médica integral y personalizada.",
            description2: "Centro Médico San Rafael cuenta con instalaciones modernas en Insurgentes Sur y un equipo multidisciplinario de especialistas. Utilizamos tecnología de vanguardia para garantizar diagnósticos precisos y tratamientos efectivos para toda la familia.",
            experience: "Años de Experiencia"
        },
        
        // Timeline/Services Section
        timeline: {
            title: "Especialidades Médicas",
            services: [
                {
                    title: "Medicina Interna",
                    description: "Dr. Carlos Mendoza - Diagnóstico y tratamiento integral de enfermedades en adultos. Manejo de diabetes, hipertensión y enfermedades crónicas.",
                    date: "Lun-Vie 9:00-18:00"
                },
                {
                    title: "Cardiología",
                    description: "Dra. Ana Patricia Ruiz - Especialista en enfermedades del corazón. Electrocardiogramas, ecocardiogramas y prevención cardiovascular.",
                    date: "Mar-Jue 10:00-16:00"
                },
                {
                    title: "Traumatología",
                    description: "Dr. Miguel Ángel Torres - Tratamiento de lesiones óseas y musculares. Fracturas, esguinces y rehabilitación deportiva.",
                    date: "Lun-Mié-Vie 8:00-14:00"
                },
                {
                    title: "Pediatría",
                    description: "Dra. Sofía Hernández - Atención médica especializada para niños y adolescentes. Vacunación, control de crecimiento y desarrollo.",
                    date: "Lun-Vie 14:00-19:00"
                },
                {
                    title: "Dermatología",
                    description: "Dr. Roberto Castillo - Diagnóstico y tratamiento de enfermedades de la piel. Dermatología clínica, estética y cirugía dermatológica.",
                    date: "Mié-Vie 9:00-15:00"
                }
            ]
        },
        
        // Reviews Section
        reviews: {
            title: "Testimonios de Pacientes",
            testimonials: [
                {
                    title: "Excelente Atención Cardiológica",
                    text: "La Dra. Ana Patricia Ruiz me salvó la vida. Su diagnóstico temprano y tratamiento profesional me permitieron recuperarme completamente de mi problema cardíaco.",
                    name: "Roberto Jiménez",
                    role: "Paciente Cardiología"
                },
                {
                    title: "Traumatología de Primera",
                    text: "Después de mi accidente, el Dr. Miguel Torres me atendió de manera excepcional. Su experiencia y dedicación me ayudaron a recuperar la movilidad completa.",
                    name: "Carmen Vásquez",
                    role: "Paciente Traumatología"
                },
                {
                    title: "Pediatría Confiable",
                    text: "La Dra. Sofía Hernández ha cuidado a mis hijos desde pequeños. Su paciencia y profesionalismo nos dan total tranquilidad como padres.",
                    name: "Patricia Morales",
                    role: "Madre de Familia"
                },
                {
                    title: "Medicina Interna Integral",
                    text: "El Dr. Carlos Mendoza maneja mi diabetes de manera excelente. Sus consejos y seguimiento constante han mejorado significativamente mi calidad de vida.",
                    name: "Eduardo Ramírez",
                    role: "Paciente Medicina Interna"
                }
            ]
        },
        
        // Booking Section
        booking: {
            title: "Reservar una Cita",
            form: {
                fullName: "Nombre completo",
                email: "Correo electrónico",
                phone: "Teléfono: 123-456-7890",
                date: "Fecha de la cita",
                message: "Mensaje adicional",
                submit: "Reservar Ahora"
            }
        },
        
        // Footer/Contact Section
        footer: {
            hours: {
                title: "Horarios de Atención",
                sunday: "Domingo: Cerrado",
                weekdays: "Lunes a Viernes",
                weekdaysTime: "8:00 AM - 8:00 PM",
                saturday: "Sábado",
                saturdayTime: "9:00 AM - 2:00 PM"
            },
            clinic: {
                title: "Centro Médico San Rafael",
                email: "contacto@centromedicosanrafael.com",
                address: "Av. Insurgentes Sur 1457, Col. San José Insurgentes, CDMX 03900"
            },
            socials: {
                title: "Redes Sociales"
            },
            copyright: "Copyright © Centro Médico San Rafael 2024",
            social: {
                title: "Redes Sociales"
            }
        },

        // Contact section
        contact: {
            title: "Ubicación y Contacto",
            info: {
                title: "Información de Contacto"
            },
            address: {
                label: "Dirección:",
                full: "Av. Insurgentes Sur 1457, Col. San José Insurgentes, CDMX 03900"
            },
            phone: {
                label: "Teléfono:",
                number: "55 5661-8420"
            },
            email: {
                label: "Email:",
                address: "contacto@centromedicosanrafael.com"
            },
            hours: {
                label: "Horarios:",
                weekdays: "Lun - Vie: 8:00 AM - 8:00 PM",
                saturday: "Sáb: 9:00 AM - 2:00 PM",
                sunday: "Dom: Cerrado"
            },
            map: {
                title: "Nuestra Ubicación"
            }
        },

        // Dark Mode System
        darkMode: {
            theme: "Tema",
            switchToLight: "Cambiar a modo claro",
            switchToDark: "Cambiar a modo oscuro",
            auto: "Automático"
        }
    },

    en: {
        // Meta and title
        title: "Medical Center - Health Care",
        metaDescription: "Professional medical center with comprehensive health services. Medical consultations, specialties and emergency care.",

        // Navigation
        nav: {
            home: "Home",
            about: "About",
            timeline: "Services",
            testimonials: "Testimonials",
            booking: "Booking",
            contact: "Contact"
        },

        // Brand
        brand: {
            name: "San Rafael Medical Center",
            subtitle: "Comprehensive Health Specialists"
        },

        // Hero Section
        hero: {
            title: "Better",
            animatedItems: ["health", "care", "wellness"],
            description: "San Rafael Medical Center is your trusted clinic with over 15 years of experience providing comprehensive and personalized medical care for the whole family in the heart of Mexico City.",
            bookAppointment: "Book Appointment"
        },

        // About Section
        about: {
            title: "Dr. Carlos Mendoza - Medical Director",
            description1: "With over 15 years of experience in internal and family medicine, Dr. Carlos Mendoza leads our specialized medical team. UNAM graduate with specialty training at Hospital General de México, dedicated to providing comprehensive and personalized medical care.",
            description2: "We have modern facilities and state-of-the-art equipment to ensure accurate diagnoses and effective treatments. The health of our patients is our number one priority.",
            experience: "Years of Experience"
        },

        // Timeline/Services Section
        timeline: {
            title: "Our Services",
            services: [
                {
                    title: "General Consultation",
                    description: "Comprehensive medical care for the whole family. Diagnosis, treatment and follow-up of common and chronic diseases.",
                    date: "Monday to Friday"
                },
                {
                    title: "Preventive Medicine",
                    description: "Prevention programs and regular medical checkups. Vaccination, routine examinations and health counseling.",
                    date: "Scheduled Appointments"
                },
                {
                    title: "Medical Specialties",
                    description: "We have specialists in cardiology, dermatology, gynecology and internal medicine for comprehensive care.",
                    date: "By Appointment"
                },
                {
                    title: "Emergency Care",
                    description: "24-hour emergency medical service available. Immediate attention for cases requiring rapid intervention.",
                    date: "24/7 Available"
                },
                {
                    title: "Telemedicine",
                    description: "Virtual medical consultations for greater convenience and accessibility. Treatment follow-up from the comfort of your home.",
                    date: "Extended Hours"
                }
            ]
        },

        // Reviews Section
        reviews: {
            title: "Our Patients",
            testimonials: [
                {
                    title: "Excellent Medical Care",
                    text: "Dr. García and his team provide exceptional care. I feel very comfortable and confident with the treatment received.",
                    name: "María González",
                    role: "Patient"
                },
                {
                    title: "Doctor cares for everyone!",
                    text: "The personalized attention and constant follow-up make the difference. I highly recommend this medical center.",
                    name: "Carlos Mendoza",
                    role: "Recovered Patient"
                },
                {
                    title: "Great services!",
                    text: "Modern facilities, trained staff and quality care. Definitely the best medical center in the area.",
                    name: "Laura Rodríguez",
                    role: "New Patient"
                },
                {
                    title: "Best Advice",
                    text: "Dr. García always takes the necessary time to explain everything clearly and give the best health advice.",
                    name: "Ana Martínez",
                    role: "Recovering"
                }
            ]
        },

        // Booking Section
        booking: {
            title: "Book an Appointment",
            form: {
                fullName: "Full name",
                email: "Email address",
                phone: "Phone: 123-456-7890",
                date: "Appointment date",
                message: "Additional message",
                submit: "Book Now"
            }
        },

        // Contact section
        contact: {
            title: "Location and Contact",
            info: {
                title: "Contact Information"
            },
            address: {
                label: "Address:",
                full: "1457 Insurgentes Sur Ave, San José Insurgentes, Mexico City 03900"
            },
            phone: {
                label: "Phone:",
                number: "55 5661-8420"
            },
            email: {
                label: "Email:",
                address: "contacto@centromedicosanrafael.com"
            },
            hours: {
                label: "Hours:",
                weekdays: "Mon - Fri: 8:00 AM - 8:00 PM",
                saturday: "Sat: 9:00 AM - 2:00 PM",
                sunday: "Sun: Closed"
            },
            map: {
                title: "Our Location"
            }
        },

        // Footer section
        footer: {
            hours: {
                title: "Opening Hours",
                sunday: "Sunday: Closed",
                weekdays: "Monday to Friday",
                weekdaysTime: "8:00 AM - 8:00 PM",
                saturday: "Saturday",
                saturdayTime: "9:00 AM - 2:00 PM"
            },
            clinic: {
                title: "San Rafael Medical Center",
                email: "contacto@centromedicosanrafael.com",
                address: "1457 Insurgentes Sur Ave, San José Insurgentes, Mexico City 03900"
            },
            social: {
                title: "Social Media"
            },
            copyright: "Copyright © San Rafael Medical Center 2024"
        },

        // Dark Mode System
        darkMode: {
            theme: "Theme",
            switchToLight: "Switch to light mode",
            switchToDark: "Switch to dark mode",
            auto: "Auto"
        }
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
