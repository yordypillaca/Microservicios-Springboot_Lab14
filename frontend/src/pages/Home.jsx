import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, Tag, Zap, Shield, Rocket } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Gestión de Productos',
      description: 'Administra tu inventario de productos de forma eficiente',
    },
    {
      icon: <Tag className="w-8 h-8" />,
      title: 'Categorías Organizadas',
      description: 'Organiza tus productos en categorías personalizadas',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Rendimiento Rápido',
      description: 'Interfaz optimizada para máxima velocidad',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Seguro y Confiable',
      description: 'Datos protegidos con tecnología moderna',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="mb-6"
          >
            <Rocket className="w-20 h-20 mx-auto text-primary-600" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">MicroStore</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Sistema de gestión de productos y categorías con microservicios. Administra tu inventario de forma moderna y eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/productos" className="btn-primary">
              Ver Productos
            </Link>
            <Link to="/categorias" className="btn-secondary">
              Ver Categorías
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card group hover:shadow-2xl"
            >
              <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            {[
              { number: '100%', label: 'Uptime' },
              { number: '<100ms', label: 'Latencia' },
              { number: '∞', label: 'Escalabilidad' },
            ].map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explora nuestro sistema de gestión de productos ahora mismo
          </p>
          <Link to="/productos" className="btn-primary inline-block">
            Ir a Productos
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
