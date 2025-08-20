const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

// In-memory product store for demo
let products = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', stock: 10 },
  { id: 2, name: 'Phone', price: 699.99, category: 'Electronics', stock: 25 },
  { id: 3, name: 'Book', price: 19.99, category: 'Books', stock: 100 }
];
let nextId = 4;

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'product-catalog', version: '1.0.0' });
});

app.get('/products', (req, res) => {
  const { category } = req.query;
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  
  res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/products', (req, res) => {
  const { name, price, category, stock } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }
  
  const product = { 
    id: nextId++, 
    name, 
    price: parseFloat(price), 
    category, 
    stock: stock || 0 
  };
  products.push(product);
  res.status(201).json(product);
});

app.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, price, category, stock } = req.body;
  const currentProduct = products[productIndex];
  
  products[productIndex] = { 
    id, 
    name: name || currentProduct.name,
    price: price !== undefined ? parseFloat(price) : currentProduct.price,
    category: category || currentProduct.category,
    stock: stock !== undefined ? parseInt(stock) : currentProduct.stock
  };
  
  res.json(products[productIndex]);
});

app.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Product Catalog Service running on port ${PORT}`);
  });
}

module.exports = app;