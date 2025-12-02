import axios from 'axios';

// API Gateway - punto de entrada único para todos los servicios
const apiGateway = axios.create({
  baseURL: 'http://localhost:8083/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios para Categorías
const categoriaApi = apiGateway;

// Servicios para Productos
const productoApi = apiGateway;

// Servicios para Categorías
export const categoriaService = {
  getAll: () => categoriaApi.get('/categorias'),
  getById: (id) => categoriaApi.get(`/categorias/${id}`),
  create: (data) => categoriaApi.post('/categorias', data),
  update: (id, data) => categoriaApi.put(`/categorias/${id}`, data),
  delete: (id) => categoriaApi.delete(`/categorias/${id}`),
};

// Servicios para Productos
export const productoService = {
  getAll: () => productoApi.get('/productos'),
  getById: (id) => productoApi.get(`/productos/${id}`),
  create: (data) => productoApi.post('/productos', data),
  update: (id, data) => productoApi.put(`/productos/${id}`, data),
  delete: (id) => productoApi.delete(`/productos/${id}`),
};

export default categoriaApi;