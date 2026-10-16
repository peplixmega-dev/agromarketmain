function Header({ cartCount = 0 }) {
  return (
    <header className="site-header">
      <a href="#catalog">Верити</a>
      <nav aria-label="Основная навигация">
        <ul className="nav-links">
          <li><a href="#catalog">Каталог</a></li>
          <li><a href="#delivery">Доставка</a></li>
          <li><a href="#contact">Контакты</a></li>
        </ul>
      </nav>
      <div className="cart-badge"> Корзина {cartCount}</div>
    </header>
  );
}

export default Header;
