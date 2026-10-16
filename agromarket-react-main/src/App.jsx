import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactForm from './components/ContactForm';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error('Ошибка сервера');
        }
        const data = await response.json();
        setProducts(data);
      } catch {
        setError('Не удалось загрузить товары');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function handleAddToCart() {
    setCartCount(cartCount + 1);
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header cartCount={cartCount} />

      <main className="page">
        <section id="catalog" className="catalog">
          <div className="catalog-toolbar">
            <h2>Каталог</h2>
            <input
              className="search-input"
              type="search"
              placeholder="Поиск товара по каталогу..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading && <p className="status-message">Загрузка товаров...</p>}
          {error && <p className="status-message" style={{ color: '#e74c3c' }}>{error}</p>}

          {!loading && !error && (
            <div className="product-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAddToCart}
                    featured={product.id === 1}
                  />
                ))
              ) : (
                <p className="status-message">Товары не найдены</p>
              )}
            </div>
          )}
        </section>

        <aside id="delivery" className="sidebar">
          <h3>Доставка</h3>
          <ul>
            <li>Астана — на следующий день</li>
            <li>Не Астана - Долговато</li>
            <li>Бесплатно от много тг</li>
          </ul>
        </aside>
        <ContactForm />
      </main>

      <Footer />
    </>
  );
}

export default App;
