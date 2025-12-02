import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, DollarSign, Package } from 'lucide-react';
import { productoService, categoriaService } from '../services/api';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoriaId: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productosRes, categoriasRes] = await Promise.all([
        productoService.getAll(),
        categoriaService.getAll(),
      ]);
      setProductos(productosRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      showToast('Error al cargar datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast({ ...toast, visible: false }), 3000);
  };

  const handleOpenModal = (producto = null) => {
    if (producto) {
      setEditingId(producto.id);
      setFormData({
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        categoriaId: producto.categoriaId,
      });
    } else {
      setEditingId(null);
      setFormData({ nombre: '', precio: '', stock: '', categoriaId: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ nombre: '', precio: '', stock: '', categoriaId: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.precio || !formData.stock || !formData.categoriaId) {
      showToast('Todos los campos son requeridos', 'warning');
      return;
    }

    try {
      const data = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoriaId: parseInt(formData.categoriaId),
      };

      if (editingId) {
        await productoService.update(editingId, data);
        showToast('Producto actualizado correctamente', 'success');
      } else {
        await productoService.create(data);
        showToast('Producto creado correctamente', 'success');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      showToast('Error al guardar el producto', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productoService.delete(id);
        showToast('Producto eliminado correctamente', 'success');
        fetchData();
      } catch (error) {
        showToast('Error al eliminar el producto', 'error');
      }
    }
  };

  const getCategoriaName = (categoriaId) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
  };

  const filteredProductos = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Productos</h1>
          <p className="text-gray-600">Gestiona tu inventario de productos</p>
        </motion.div>

        {/* Search and Add Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Nuevo Producto
          </button>
        </motion.div>

        {/* Productos Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-x-auto"
        >
          {filteredProductos.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Nombre</th>
                    <th className="px-6 py-4 text-left font-semibold">Categoría</th>
                    <th className="px-6 py-4 text-left font-semibold">Precio</th>
                    <th className="px-6 py-4 text-left font-semibold">Stock</th>
                    <th className="px-6 py-4 text-left font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProductos.map((producto, index) => (
                    <motion.tr
                      key={producto.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Package className="w-5 h-5 text-primary-600" />
                          <span className="font-medium text-gray-900">
                            {producto.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge badge-info">
                          {getCategoriaName(producto.categoriaId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          {producto.precio.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge ${
                            producto.stock > 10
                              ? 'badge-success'
                              : producto.stock > 0
                              ? 'badge-warning'
                              : 'badge-danger'
                          }`}
                        >
                          {producto.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenModal(producto)}
                            className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(producto.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl shadow-lg"
            >
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay productos disponibles</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="input-field"
              placeholder="Ej: Laptop"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={formData.categoriaId}
              onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
              className="input-field"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input-field"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
            >
              {editingId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={() => setToast({ ...toast, visible: false })}
      />
    </div>
  );
}
