import React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LowStockBadge from '../components/LowStockBadge';

function Products() {
  const [products, setProducts] = useState([]);
  const [search,   setSearch]   = useState('');
  const [loading,  setLoading]  = useState(true);

  const fetchProducts = async (query = '') => {
    try {
      const res = await api.get(`/products?search=${query}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Products</h2>
        <Link to="/products/add" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(''); fetchProducts(''); }}
            className="btn-clear"
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : products.length === 0 ? (
        <p className="empty">No products found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td><strong>{product.name}</strong></td>
                <td>{product.category?.name || '—'}</td>
                <td>€{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <LowStockBadge
                    stock={product.stock}
                    lowStockLimit={product.lowStockLimit}
                  />
                </td>
                <td>
                  <Link
                    to={`/products/edit/${product._id}`}
                    className="link-edit"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="link-delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}

export default Products;