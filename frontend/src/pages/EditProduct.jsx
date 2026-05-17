import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    stock: '',
    lowStockLimit: '5',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/categories'),
        ]);

        const product = productRes.data;

        setForm({
          name: product.name || '',
          description: product.description || '',
          category: product.category?._id || product.category || '',
          price: product.price ?? '',
          stock: product.stock ?? '',
          lowStockLimit: product.lowStockLimit ?? '5',
        });

        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (err) {
        console.error(err);
        setError('Could not load product. Check backend route GET /api/products/:id.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }

    try {
      await api.put(`/products/${id}`, {
        name: form.name,
        description: form.description,
        category: form.category || null,
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        lowStockLimit: Number(form.lowStockLimit) || 5,
      });

      navigate('/products');
    } catch (err) {
      console.error(err);
      setError('Could not update product.');
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Edit Product</h2>
        <Link to="/products">← Back</Link>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="">-- Select --</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price (€)</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Low Stock Limit</label>
            <input
              type="number"
              name="lowStockLimit"
              value={form.lowStockLimit}
              onChange={handleChange}
              min="1"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProduct;