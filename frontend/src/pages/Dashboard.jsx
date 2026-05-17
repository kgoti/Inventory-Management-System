import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

function Dashboard() {
  const [stats, setStats]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/products');
        const products = res.data;

        const totalProducts  = products.length;
        const totalStock     = products.reduce((sum, p) => sum + p.stock, 0);
        const totalValue     = products.reduce((sum, p) => sum + p.price * p.stock, 0);
        const lowStockItems  = products.filter(p => p.stock > 0 && p.stock <= p.lowStockLimit);
        const outOfStock     = products.filter(p => p.stock === 0);

        setStats({
          totalProducts,
          totalStock,
          totalValue,
          lowStockCount: lowStockItems.length,
          outOfStockCount: outOfStock.length,
          lowStockItems,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>

      <div className="cards">

        <div className="card">
          <p>Total Products</p>
          <h3>{stats.totalProducts}</h3>
        </div>

        <div className="card">
          <p>Total Stock</p>
          <h3>{stats.totalStock}</h3>
        </div>

        <div className="card">
          <p>Stock Value</p>
          <h3>€{stats.totalValue.toFixed(2)}</h3>
        </div>

        <div className="card warning">
          <p>Low Stock</p>
          <h3>{stats.lowStockCount}</h3>
        </div>

        <div className="card danger">
          <p>Out of Stock</p>
          <h3>{stats.outOfStockCount}</h3>
        </div>

      </div>

      {/* Low stock warnings */}
      {stats.lowStockItems.length > 0 && (
        <div className="low-stock-section">
          <h3>⚠️ Low Stock Warning</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Minimum</th>
              </tr>
            </thead>
            <tbody>
              {stats.lowStockItems.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                    {p.stock}
                  </td>
                  <td>{p.lowStockLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default Dashboard;