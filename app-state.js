import { db } from './firebase-config.js';
import { cloudinaryConfig } from './cloudinary-config.js';
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    addDoc,
    deleteDoc
} from 'https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js';

// Estado global de la aplicación
class AppState {
    constructor() {
        this.isInitialized = false;
        this.productos = [];
        this.categorias = {};
    }

    // Verificar el estado de las colecciones
    async checkCollectionsStatus() {
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        const prendasSnapshot = await getDocs(collection(db, 'prendas'));
        
        return {
            categoriasEmpty: categoriasSnapshot.empty,
            prendasEmpty: prendasSnapshot.empty
        };
    }

    // Inicializar la aplicación
    async initialize() {
        if (this.isInitialized) {
            console.log('La aplicación ya está inicializada');
            return;
        }

        try {
            // Verificar el estado de las colecciones
            const status = await this.checkCollectionsStatus();
            console.log('Estado de las colecciones:', status);

            if (status.categoriasEmpty || status.prendasEmpty) {
                console.log('Una o más colecciones están vacías, inicializando datos...');
                await this.createInitialData();
            }

            // Cargar datos existentes
            await this.loadData();
            
            this.isInitialized = true;
            console.log('Aplicación inicializada correctamente');
            
            // Disparar evento de inicialización completada
            window.dispatchEvent(new CustomEvent('appStateInitialized'));
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
            throw error;
        }
    }

    // Cargar datos existentes
    async loadData() {
        // Cargar categorías
        const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
        categoriasSnapshot.forEach(doc => {
            this.categorias[doc.id] = doc.data();
        });

        // Cargar productos
        const productosSnapshot = await getDocs(collection(db, 'prendas'));
        this.productos = productosSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    // Crear datos iniciales (solo se ejecuta si alguna colección está vacía)
    async createInitialData() {
        try {
            const status = await this.checkCollectionsStatus();
            
            // Crear categorías si es necesario
            if (status.categoriasEmpty) {
                console.log('Creando categorías...');
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
            }

            // Crear productos iniciales solo si la colección está vacía
            if (status.prendasEmpty) {
                console.log('Creando productos iniciales...');
                const prendasRef = collection(db, 'prendas');
                
                await addDoc(prendasRef, {
                    nombre: 'Camisa Casual Azul',
                    categoria: 'hombres',
                    tipoPrenda: 'camisa',
                    descripcion: 'Camisa casual de algodón',
                    tallas: ['S', 'M', 'L', 'XL'],
                    colores: ['azul', 'blanco'],
                    imageUrl: 'https://via.placeholder.com/200x200',
                    etiquetas: ['casual', 'algodón', 'manga larga']
                });

                await addDoc(prendasRef, {
                    nombre: 'Pantalón Formal Negro',
                    categoria: 'hombres',
                    tipoPrenda: 'pantalon',
                    descripcion: 'Pantalón formal de vestir',
                    tallas: ['30', '32', '34', '36'],
                    colores: ['negro'],
                    imageUrl: 'https://via.placeholder.com/200x200',
                    etiquetas: ['formal', 'vestir', 'oficina']
                });

                await addDoc(prendasRef, {
                    nombre: 'Polera Infantil Dinosaurio',
                    categoria: 'ninos',
                    tipoPrenda: 'polera',
                    descripcion: 'Polera con estampado de dinosaurio',
                    tallas: ['4', '6', '8', '10'],
                    colores: ['verde', 'azul'],
                    imageUrl: 'https://via.placeholder.com/200x200',
                    etiquetas: ['casual', 'estampado', 'manga corta']
                });
            }

            console.log('Datos iniciales creados correctamente');
        } catch (error) {
            console.error('Error al crear datos iniciales:', error);
            throw error;
        }
    }

    // Obtener todos los productos
    getProducts() {
        return this.productos;
    }

    // Obtener un producto por ID
    getProductById(id) {
        return this.productos.find(producto => producto.id === id);
    }

    // Actualizar un producto
    async updateProduct(id, data) {
        try {
            const producto = this.getProductById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Si estamos actualizando la imagen, primero eliminamos la anterior de Cloudinary
            if (data.imageUrl && producto.imageUrl && producto.imageUrl !== data.imageUrl) {
                await this.deleteImageFromCloudinary(producto.imageUrl);
            }

            const docRef = doc(db, 'prendas', id);
            await setDoc(docRef, data, { merge: true });
            
            // Actualizar el estado local
            const index = this.productos.findIndex(p => p.id === id);
            if (index !== -1) {
                this.productos[index] = { ...this.productos[index], ...data };
            }

            // Disparar evento de actualización
            window.dispatchEvent(new CustomEvent('productUpdated', {
                detail: { id, data }
            }));
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    // Obtener el public_id de una URL de Cloudinary
    getPublicIdFromUrl(url) {
        try {
            // La URL de Cloudinary tiene este formato: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.ext
            const matches = url.match(/\/v\d+\/(.+?)\./);
            return matches ? matches[1] : null;
        } catch (error) {
            console.error('Error al extraer public_id de URL:', error);
            return null;
        }
    }

    // Eliminar una imagen de Cloudinary
    async deleteImageFromCloudinary(imageUrl) {
        try {
            const publicId = this.getPublicIdFromUrl(imageUrl);
            if (!publicId) return;

            // Usamos el endpoint de eliminación de Cloudinary
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    public_id: publicId,
                    upload_preset: cloudinaryConfig.uploadPreset
                })
            });

            if (!response.ok) {
                throw new Error('Error al eliminar imagen de Cloudinary');
            }

            console.log('Imagen eliminada de Cloudinary:', publicId);
        } catch (error) {
            console.error('Error al eliminar imagen de Cloudinary:', error);
            // No lanzamos el error para que no interrumpa el flujo principal
        }
    }

    // Obtener todas las categorías
    getCategories() {
        return this.categorias;
    }
    
    // Obtener productos por categoría
    getProductsByCategory(categoria) {
        return this.productos.filter(producto => producto.categoria === categoria);
    }

    // Eliminar un producto
    async deleteProduct(id) {
        try {
            const producto = this.getProductById(id);
            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Primero eliminamos la imagen de Cloudinary si existe
            if (producto.imageUrl) {
                await this.deleteImageFromCloudinary(producto.imageUrl);
            }

            // Luego eliminamos el documento de Firebase
            const docRef = doc(db, 'prendas', id);
            await deleteDoc(docRef);

            // Actualizamos el estado local
            this.productos = this.productos.filter(p => p.id !== id);

            // Disparar evento de eliminación
            window.dispatchEvent(new CustomEvent('productDeleted', {
                detail: { id }
            }));

            console.log('Producto eliminado completamente:', id);
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

// Exportar una única instancia del estado global
export const appState = new AppState();
