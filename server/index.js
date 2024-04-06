// Import necessary modules and set up the Express app
const {
  client,
  createTables,
  createAdminUser,
  createUser,
  createUserAddress,
  createUserPayment,
  createProduct,
  createProductCategory,
  createProductInventory,
  createCartItem,
  createOrderItem,
  createOrderDetail,
  createPaymentDetail,
  fetchAdminUsers,
  fetchUsers,
  fetchUserAddresses,
  fetchUserPayments,
  fetchProducts,
  fetchProductCategories,
  fetchProductInventories,
  fetchCartItems,
  fetchOrderItems,
  fetchOrderDetails,
  fetchPaymentDetails,
  deleteProduct,
  deleteCartItem,
  deleteUserAddress,
  deleteUserPayment,
  findUserWithToken,
  authenticate
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

// Serve static files for deployment
const path = require('path');

// Middleware to check if the user is logged in
const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};
const isAdmin = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    if (req.user.role === 'admin') {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  } catch (ex) {
    next(ex);
  }
};

// Authentication endpoints
app.post('/api/auth/register', async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/auth/me', isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

// Admin endpoints

app.get('/api/adminusers', isAdmin, async (req, res, next) => {
  try {
    res.send(await fetchAdminUsers());
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/admin/users', isAdmin, async (req, res, next) => {
  try {
    res.send(await fetchUser(req.params.userId));
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/admin/users/:userId', isAdmin, async (req, res, next) => {
  try {
    res.send(await fetchUser(req.params.userId));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/admin/products', isAdmin, async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});
app.post('/api/admin/products', isAdmin, async (req,res, next) => {
  try {
    res.send(await createProduct(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/admin/products/:productId', isAdmin, async (req,res, next) => {
  try {
    res.send(await fetchProduct(req.params.productId, req.body));
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/admin/products/:productId', isAdmin, async (req,res, next) => {
  try {
    res.send(await deleteProduct(req.params.productId));
  } catch (ex) {
    next(ex);
  }
});

// User endpoints
app.post('/api/users', async (req, res, next) => {
  try {
    res.status(201).send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/users/:userId/addresses', async (req, res, next) => {
  try {
    res.status(201).send(await createUserAddress({ user_id: req.params.userId, address: req.body.address }));
  } catch (ex) {
    next(ex);
  }
});

app.post('/api/users/:userId/payments', async (req, res, next) => {
  try {
    res.status(201).send(await createUserPayment({ user_id: req.params.userId, payment_method: req.body.payment_method }));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users', async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:userId/addresses', async (req, res, next) => {
  try {
    res.send(await fetchUserAddresses(req.params.userId));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/users/:userId/payments', async (req, res, next) => {
  try {
    res.send(await fetchUserPayments(req.params.userId));
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:userId/useraddress/:addressId', async (req, res, next) => {
  try {
    await deleteUserAddress(req.params.userId, req.params.addressId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:userId/userpayment/:paymentId', async (req, res, next) => {
  try {
    await deleteUserPayment(req.params.userId, req.params.paymentId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// Product endpoints
app.post('/api/products', async (req, res, next) => {
  try {
    res.status(201).send(await createProduct(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/products', async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/products/:productId', async (req, res, next) => {
  try {
    res.send(await fetchProduct(req.params.productId));
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/products/:productId', async (req, res, next) => {
  try {
    await deleteProduct(req.params.productId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// Product Category endpoints
app.post('/api/productcategories', async (req, res, next) => {
  try {
    res.status(201).send(await createProductCategory(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/productcategories', async (req, res, next) => {
  try {
    res.send(await fetchProductCategories());
  } catch (ex) {
    next(ex);
  }
});

// Product Inventory endpoints
app.post('/api/productinventories', async (req, res, next) => {
  try {
    res.status(201).send(await createProductInventory(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/productinventories', async (req, res, next) => {
  try {
    res.send(await fetchProductInventories());
  } catch (ex) {
    next(ex);
  }
});

// Cart Item endpoints
app.post('/api/cartitems', isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(await createCartItem(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/cartitems', isLoggedIn, async (req, res, next) => {
  try {
    res.send(await fetchCartItems());
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/cartitems/:productId', isLoggedIn ,async (req, res, next) => {
  try {
    await deleteCartItem(req.params.productId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.put('/api/cartitems/:productId', isLoggedIn, async (req, res,next) => {
  try {
    res.send(await fetchCartItems(req.body));
  } catch (ex) {
    next(ex);
  }
});

// Order Item endpoints
app.post('/api/orderitems', async (req, res, next) => {
  try {
    res.status(201).send(await createOrderItem(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/orderitems', async (req, res, next) => {
  try {
    res.send(await fetchOrderItems());
  } catch (ex) {
    next(ex);
  }
});

// Order Item Detail endpoints
app.post('/api/orderitems/:orderId/orderdetails', async (req, res, next) => {
  try {
    res.status(201).send(await createOrderDetail(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/orderitems/:orderId/orderdetails', async (req, res, next) => {
  try {
    res.send(await fetchOrderDetails(req.params.orderId));
  } catch (ex) {
    next(ex);
  }
});

// Payment Detail endpoints
app.post('/api/orderitems/:orderId/orderdetails/paymentdetails', async (req, res, next) => {
  try {
    res.status(201).send(await createPaymentDetail(req.body));
  } catch (ex) {
    next(ex);
  }
});

app.get('/api/orderitems/:orderId/orderdetails/paymentdetails', async (req, res, next) => {
  try {
    res.send(await fetchPaymentDetails(req.params.orderId));
  } catch (ex) {
    next(ex);
  }
});

// Delete endpoints
app.delete('/api/users/:userId/addresses/:addressId', async (req, res, next) => {
  try {
    await deleteUserAddress(req.params.userId, req.params.addressId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/users/:userId/payments/:paymentId', async (req, res, next) => {
  try {
    await deleteUserPayment(req.params.userId, req.params.paymentId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.delete('/api/cartitems/:cartItemId', async (req, res, next) => {
  try {
    await deleteCartItem(req.params.cartItemId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

// Route to checkout and place an order
app.post('/api/checkout', isLoggedIn, async (req, res, next) => {
  try {
    const { address, paymentMethod } = req.body;
    const order = await checkout(req.user.user_id, address, paymentMethod);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send({ error: err.message ? err.message : err });
});


// Initialize the server
const init = async () => {
    const port = process.env.PORT || 3000;

    // Connect to the database
    await client.connect();
    console.log('Connected to the database');

    // Create database tables
    await createTables();
    console.log('Tables created');


// Create sample admin users
const adminUsers = await Promise.all([
  createAdminUser({ admin_id: 1, username: 'admin1', password: 'admin1_password', is_admin: true }),
  createAdminUser({ admin_id: 2, username: 'admin2', password: 'admin2_password', is_admin: true })
]);

  // Create sample regular users
  const [user1, user2, user3] = await Promise.all([
    createUser({ username: 'user1', email: 'user1@example.com', password: 'password1' }),
    createUser({ username: 'user2', email: 'user2@example.com', password: 'password2' }),
    createUser({ username: 'user3', email: 'user3@example.com', password: 'password3' })
  ]);

  // Create sample products
  const [product1, product2, product3] = await Promise.all([
    createProduct({ name: 'product1', description: 'Description of product1', price: 10.99 }),
    createProduct({ name: 'product2', description: 'Description of product2', price: 19.99 }),
    createProduct({ name: 'product3', description: 'Description of product3', price: 24.99 })
  ]);

  // Log admin users, regular users, and products
  console.log('Admin Users:', adminUsers);
  console.log('Regular Users:', [user1, user2, user3]);
  console.log('Products:', [product1, product2, product3]);

    // Start the server
    app.listen(port, () => console.log(`Listening on port ${port}`));
};

// Call the initialization function
init();
