function ProductCard({ product, onAdd, featured }) {
    return (
        <article className={featured ? 'card card--featured' : 'card'}>
            {featured === true && <span className="badge">мега товары</span>}
            <img src={product.image} alt={product.name} />
            <div className="card-body">
                <h3>{product.name}</h3>
                <p className="card-price">{product.price} тенге</p>
                <button className="card-button" onClick={() => onAdd(product)}>
                    В корзину
                </button>
            </div>
        </article>
    );
}

export default ProductCard;
