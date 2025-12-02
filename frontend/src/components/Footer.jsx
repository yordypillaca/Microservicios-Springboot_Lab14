import { motion } from 'framer-motion';
import { Package, Github, Mail, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Package className="w-6 h-6 text-primary-400" />
              <span className="text-xl font-bold">MicroStore</span>
            </div>
            <p className="text-gray-400">
              Sistema moderno de gestión de productos y categorías con microservicios.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="/categorias" className="hover:text-primary-400 transition-colors">
                  Categorías
                </a>
              </li>
              <li>
                <a href="/productos" className="hover:text-primary-400 transition-colors">
                  Productos
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                title="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                title="Email"
              >
                <Mail size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <p>
              © {currentYear} MicroStore. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary-400 transition-colors">
                Privacidad
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Términos
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
