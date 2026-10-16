import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api';

function ContactForm() {
  const [sending, setSending] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
          throw new Error('Не удалось загрузить товары');
        }

        const data = await res.json();
        if (!Array.isArray(data) || data.some((product) =>
          !Number.isSafeInteger(Number(product.id)) ||
          Number(product.id) < 1 ||
          typeof product.name !== 'string'
        )) {
          throw new Error('Сервер вернул некорректный список товаров');
        }

        if (active) {
          setProducts(data);
        }
      } catch {
        if (active) {
          setProductsError('Не удалось загрузить товары. Заявку можно отправить без выбора товара.');
        }
      } finally {
        if (active) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = Object.fromEntries(new FormData(form));
    const data = {
      ...formData,
      product_id: formData.product_id ? Number(formData.product_id) : null,
    };

    try {
      setSending(true);
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      if (res.ok === false) {
        alert('Ошибка: ' + result.error);
        return;
      }

      alert(`Заявка №${result.id} принята!`);
      form.reset();
    } catch {
      alert('Сервер недоступен. Запущен ли agromarket-server?');
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="contact">
      <h2>Оптовая заявка</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="product_id">Выберите товар</label>
        <select id="product_id" name="product_id" defaultValue="">
          <option value="">нету</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        {productsLoading && <p className="status-message">загрузка</p>}
        {productsError && (
          <p className="status-message" role="alert">{productsError}</p>
        )}

        <label htmlFor="name">Имя</label>
        <input id="name" name="name" type="text" required />

        <label htmlFor="email">еmail</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="farmer@mail.kz"
        />

        <label htmlFor="phone">телефон</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+7 7XX XXX XX XX"
        />

        <label htmlFor="amount">объём заказа, кг</label>
        <input
          id="amount"
          name="quantity"
          type="number"
          min="10"
          required
        />

        <label htmlFor="date">желаемая дата доставки</label>
        <input
          id="date"
          name="date"
          type="date"
        />

        <label htmlFor="comment">комментарий</label>
        <textarea
          id="comment"
          name="comment"
          rows="4"
        />

        <button type="submit" disabled={sending}>
          {sending ? 'Отправка…' : 'Отправить заявку'}
        </button>
      </form>
    </section>
  );
}

export default ContactForm;
