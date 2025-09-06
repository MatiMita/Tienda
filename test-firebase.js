// Import Firebase configuration
import { db } from './firebase-config.js';
import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

// Función para probar la conexión con Firebase
async function testFirebaseConnection() {
    try {
        // Intentar acceder a una colección
        const testCollection = collection(db, 'test');
        await getDocs(testCollection);
        
        console.log('✅ Conexión exitosa con Firebase!');
        // Mostrar mensaje en la página
        const message = document.createElement('div');
        message.style.backgroundColor = '#4CAF50';
        message.style.color = 'white';
        message.style.padding = '10px';
        message.style.position = 'fixed';
        message.style.top = '20px';
        message.style.right = '20px';
        message.style.borderRadius = '5px';
        message.textContent = '✅ Conectado a Firebase correctamente!';
        document.body.appendChild(message);
        
        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            message.remove();
        }, 5000);

    } catch (error) {
        console.error('❌ Error al conectar con Firebase:', error);
        // Mostrar mensaje de error en la página
        const errorMessage = document.createElement('div');
        errorMessage.style.backgroundColor = '#f44336';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '10px';
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.right = '20px';
        errorMessage.style.borderRadius = '5px';
        errorMessage.textContent = '❌ Error al conectar con Firebase: ' + error.message;
        document.body.appendChild(errorMessage);
        
        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// Ejecutar la prueba cuando se cargue la página
document.addEventListener('DOMContentLoaded', testFirebaseConnection);
