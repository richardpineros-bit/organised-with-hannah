import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { ShoppingBag, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen pt-[70px] bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-2">Digital Resources</h1>
        <p className="text-center text-gray-600 mb-12">Organising guides, templates, and courses you can access instantly</p>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Digital products coming soon!</p>
            <p className="text-sm text-gray-400 mt-2">Check back for eBooks, templates, and online courses</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {product.type === 'ebook' && <Download className="w-12 h-12 text-gray-400" />}
                  {product.type === 'course' && <Lock className="w-12 h-12 text-gray-400" />}
                  {product.type === 'template' && <ShoppingBag className="w-12 h-12 text-gray-400" />}
                </div>
                <div className="p-6">
                  <div className="text-xs uppercase tracking-wider text-primary mb-2">{product.type}</div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">${product.price}</div>
                    <Button className="bg-primary hover:bg-primary-dark">Buy Now</Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
