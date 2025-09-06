// Import Firebase configuration
import { db } from './firebase-config.js';
import { collection, addDoc, setDoc, doc } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

// Función para inicializar la base de datos con la estructura y algunos datos de ejemplo
async function initializeDatabase() {
    try {
        // Crear colección de categorías
        const categoriasRef = collection(db, 'categorias');
        
        // Agregar categorías principales
        await setDoc(doc(db, 'categorias', 'hombres'), {
            nombre: 'Hombres',
            descripcion: 'Ropa para hombres',
            tiposPrenda: ['camisa', 'pantalon', 'polera', 'chaqueta', 'zapatillas']
        });

        await setDoc(doc(db, 'categorias', 'ninos'), {
            nombre: 'Niños',
            descripcion: 'Ropa para niños',
            tiposPrenda: ['camisa', 'pantalon', 'polera', 'zapatillas']
        });

        // Crear colección de productos
        const productosRef = collection(db, 'productos');

        // Ejemplos de productos para hombres
        await addDoc(productosRef, {
            nombre: 'Camisa Casual Azul',
            categoria: 'hombres',
            tipoPrenda: 'camisa',
            descripcion: 'Camisa casual de algodón',
            precio: 29.99,
            tallas: ['S', 'M', 'L', 'XL'],
            colores: ['azul', 'blanco'],
            imageUrl: 'URL_DE_CLOUDINARY',
            stock: {
                S: 10,
                M: 15,
                L: 12,
                XL: 8
            },
            etiquetas: ['casual', 'algodón', 'manga larga'],
            fechaCreacion: new Date(),
            activo: true
        });

        await addDoc(productosRef, {
            nombre: 'Pantalón Formal Negro',
            categoria: 'hombres',
            tipoPrenda: 'pantalon',
            descripcion: 'Pantalón formal de vestir',
            precio: 49.99,
            tallas: ['30', '32', '34', '36'],
            colores: ['negro'],
            imageUrl: 'URL_DE_CLOUDINARY',
            stock: {
                '30': 8,
                '32': 12,
                '34': 10,
                '36': 6
            },
            etiquetas: ['formal', 'vestir', 'oficina'],
            fechaCreacion: new Date(),
            activo: true
        });

        // Ejemplos de productos para niños
        await addDoc(productosRef, {
            nombre: 'Polera Infantil Dinosaurio',
            categoria: 'ninos',
            tipoPrenda: 'polera',
            descripcion: 'Polera con estampado de dinosaurio',
            precio: 19.99,
            tallas: ['4', '6', '8', '10'],
            colores: ['verde', 'azul'],
            imageUrl: 'URL_DE_CLOUDINARY',
            stock: {
                '4': 15,
                '6': 20,
                '8': 18,
                '10': 12
            },
            etiquetas: ['casual', 'estampado', 'manga corta'],
            fechaCreacion: new Date(),
            activo: true
        });

        // Crear colección de inventario
        const inventarioRef = collection(db, 'inventario');

        // Crear colección de pedidos
        const pedidosRef = collection(db, 'pedidos');

        console.log('Base de datos inicializada correctamente');
        return true;

    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        return false;
    }
}

// Función para obtener productos filtrados
async function obtenerProductos(categoria = null, tipoPrenda = null) {
    try {
        let productosRef = collection(db, 'productos');
        let consulta = productosRef;

        if (categoria) {
            consulta = consulta.where('categoria', '==', categoria);
        }
        if (tipoPrenda) {
            consulta = consulta.where('tipoPrenda', '==', tipoPrenda);
        }

        const productos = await getDocs(consulta);
        return productos.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
}

export { initializeDatabase, obtenerProductos };
