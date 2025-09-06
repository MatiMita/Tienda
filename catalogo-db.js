// Import Firebase configuration
import { db } from './firebase-config.js';
import { collection, addDoc, setDoc, doc, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

// Función para inicializar la base de datos con la estructura del catálogo
async function initializeDatabase() {
    try {
        // Crear colección de categorías
        const categoriasRef = collection(db, 'categorias');
        
        // Agregar categorías principales
        await setDoc(doc(db, 'categorias', 'hombres'), {
            nombre: 'Hombres',
            descripcion: 'Catálogo de ropa para hombres',
            tiposPrenda: ['camisa', 'pantalon', 'polera', 'chaqueta', 'zapatillas']
        });

        await setDoc(doc(db, 'categorias', 'ninos'), {
            nombre: 'Niños',
            descripcion: 'Catálogo de ropa para niños',
            tiposPrenda: ['camisa', 'pantalon', 'polera', 'zapatillas']
        });

        // Crear colección de prendas (catálogo)
        const prendasRef = collection(db, 'prendas');

        // Ejemplos de prendas para hombres
        await addDoc(prendasRef, {
            nombre: 'Camisa Casual Azul',
            categoria: 'hombres',
            tipoPrenda: 'camisa',
            descripcion: 'Camisa casual de algodón',
            tallas: ['S', 'M', 'L', 'XL'],
            colores: ['azul', 'blanco'],
            imageUrl: 'URL_DE_CLOUDINARY',
            etiquetas: ['casual', 'algodón', 'manga larga']
        });

        await addDoc(prendasRef, {
            nombre: 'Pantalón Formal Negro',
            categoria: 'hombres',
            tipoPrenda: 'pantalon',
            descripcion: 'Pantalón formal de vestir',
            tallas: ['30', '32', '34', '36'],
            colores: ['negro'],
            imageUrl: 'URL_DE_CLOUDINARY',
            etiquetas: ['formal', 'vestir', 'oficina']
        });

        // Ejemplos de prendas para niños
        await addDoc(prendasRef, {
            nombre: 'Polera Infantil Dinosaurio',
            categoria: 'ninos',
            tipoPrenda: 'polera',
            descripcion: 'Polera con estampado de dinosaurio',
            tallas: ['4', '6', '8', '10'],
            colores: ['verde', 'azul'],
            imageUrl: 'URL_DE_CLOUDINARY',
            etiquetas: ['casual', 'estampado', 'manga corta']
        });

        console.log('Catálogo inicializado correctamente');
        return true;

    } catch (error) {
        console.error('Error al inicializar el catálogo:', error);
        return false;
    }
}

// Función para obtener prendas del catálogo con filtros
async function obtenerPrendas(categoria = null, tipoPrenda = null) {
    try {
        const prendasRef = collection(db, 'prendas');
        let q = prendasRef;

        // Aplicar filtros si se especifican
        if (categoria && tipoPrenda) {
            q = query(prendasRef, 
                where('categoria', '==', categoria),
                where('tipoPrenda', '==', tipoPrenda)
            );
        } else if (categoria) {
            q = query(prendasRef, where('categoria', '==', categoria));
        } else if (tipoPrenda) {
            q = query(prendasRef, where('tipoPrenda', '==', tipoPrenda));
        }

        const prendas = await getDocs(q);
        return prendas.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

    } catch (error) {
        console.error('Error al obtener prendas:', error);
        return [];
    }
}

// Función para obtener los tipos de prendas disponibles por categoría
async function obtenerTiposPrendas(categoria) {
    try {
        const docRef = doc(db, 'categorias', categoria);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().tiposPrenda;
        }
        return [];
    } catch (error) {
        console.error('Error al obtener tipos de prendas:', error);
        return [];
    }
}

export { initializeDatabase, obtenerPrendas, obtenerTiposPrendas };
