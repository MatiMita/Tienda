// Clase principal para manejar la funcionalidad de la tienda
class TiendaApp {
    constructor() {
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.configurarEventos();
        console.log('Tienda O&C inicializada correctamente');
    }

    // Configurar todos los eventos de la página
    configurarEventos() {
        // Navegación suave
        this.configurarNavegacion();
        
        // Botón de contacto
        this.configurarContacto();
    }

    // Configurar navegación suave entre secciones
    configurarNavegacion() {
        const enlaces = document.querySelectorAll('nav a[href^="#"]');
        enlaces.forEach(enlace => {
            enlace.addEventListener('click', (e) => {
                e.preventDefault();
                const seccionId = enlace.getAttribute('href');
                const seccion = document.querySelector(seccionId);
                if (seccion) {
                    seccion.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Configurar botón de contacto
    configurarContacto() {
        const btnContacto = document.getElementById('btn-contacto');
        if (btnContacto) {
            btnContacto.addEventListener('click', () => {
                this.abrirEnlaceContacto();
            });
        }
    }

    // Abrir enlace de contacto (puedes cambiar la URL por la que necesites)
    abrirEnlaceContacto() {
        // Ejemplo con WhatsApp (cambia el número por el tuyo)
        const numeroWhatsApp = '79951310'; // Pon aquí tu número de WhatsApp
        const mensaje = encodeURIComponent('Hola, me interesa conocer más sobre sus productos');
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
        
        // Abrir WhatsApp en una nueva ventana
        window.open(urlWhatsApp, '_blank');
        
        // Ejemplos de otros enlaces que puedes usar:
        
        // Para abrir email:
        // window.open('mailto:info@oc.com?subject=Consulta&body=Hola, me interesa conocer más sobre sus productos', '_blank');
        
        // Para abrir un formulario de contacto en tu web:
        // window.open('https://tu-sitio-web.com/contacto', '_blank');
        
        // Para abrir Telegram:
        // window.open('https://t.me/tu_usuario', '_blank');
        
        // Para abrir Instagram:
        // window.open('https://instagram.com/tu_cuenta', '_blank');
        
        // Para abrir Facebook Messenger:
        // window.open('https://m.me/tu_pagina_facebook', '_blank');
    }

    // Mostrar notificaciones
    mostrarNotificacion(mensaje) {
        // Crear elemento de notificación
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        
        // Agregar al body
        document.body.appendChild(notificacion);
        
        // Mostrar y ocultar después de 3 segundos
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 100);
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                if (document.body.contains(notificacion)) {
                    document.body.removeChild(notificacion);
                }
            }, 300);
        }, 3000);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.tiendaApp = new TiendaApp();
});
