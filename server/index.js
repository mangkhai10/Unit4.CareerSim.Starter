// Import necessary modules and set up the Express app
const {
    client,
    createTables,
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
    fetchAdmins,
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
    deletePaymentDetail,
    findUserWithToken,
    authenticate
  } = require('./db');
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  // Serve static files for deployment
  const path = require('path');
  app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
  app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));
  
  // Middleware to check if the user is logged in
  const isLoggedIn = async (req, res, next) => {
    try {
      req.user = await findUserWithToken(req.headers.authorization);
      next();
    } catch (ex) {
      next(ex);
    }
  };
  
  // Authentication endpoint for registering a new user
  app.post('/api/auth/register', async (req, res, next) => {
    try {
      res.send(await createUser(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Authentication endpoint for user login
  app.post('/api/auth/login', async (req, res, next) => {
    try {
      res.send(await authenticate(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get user information based on the token
  app.get('/api/auth/me', isLoggedIn, (req, res, next) => {
    try {
      res.send(req.user);
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get all admins
  app.get('/api/admins', async (req, res, next) => {
    try {
      res.send(await fetchAdmins());
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get all admin users
  app.get('/api/adminusers', async (req, res, next) => {
    try {
      res.send(await fetchAdminUsers());
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new user
  app.post('/api/users', async (req, res, next) => {
    try {
      res.status(201).send(await createUser(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new user address
  app.post('/api/users/:userId/addresses', async (req, res, next) => {
    try {
      res.status(201).send(await createUserAddress({ user_id: req.params.userId, address: req.body.address }));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new user payment method
  app.post('/api/users/:userId/payments', async (req, res, next) => {
    try {
      res.status(201).send(await createUserPayment({ user_id: req.params.userId, payment_method: req.body.payment_method }));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get all users
  app.get('/api/users', async (req, res, next) => {
    try {
      res.send(await fetchUsers());
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get all user addresses
  app.get('/api/users/:userId/addresses', async (req, res, next) => {
    try {
      res.send(await fetchUserAddresses(req.params.userId));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get all user payment methods
  app.get('/api/users/:userId/payments', async (req, res, next) => {
    try {
      res.send(await fetchUserPayments(req.params.userId));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new product
  app.post('/api/products', async (req, res, next) => {
    try {
      res.status(201).send(await createProduct(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new product category
  app.post('/api/productcategories', async (req, res, next) => {
    try {
      res.status(201).send(await createProductCategory(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new product inventory
  app.post('/api/productinventories', async (req, res, next) => {
    try {
      res.status(201).send(await createProductInventory(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new cart item
  app.post('/api/cartitems', async (req, res, next) => {
    try {
      res.status(201).send(await createCartItem(req.body));
    } catch (ex) {
      next(ex);
    }
  });

  // Endpoint to delete a cart item
app.delete('/api/cartitems/:id', async (req, res, next) => {
    try {
      await deleteCartItem(req.params.id);
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to get all order items
  app.get('/api/orderitems', async (req, res, next) => {
    try {
      res.send(await fetchOrderItems());
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to create a new order item
  app.post('/api/orderitems', async (req, res, next) => {
    try {
      res.status(201).send(await createOrderItem(req.body));
    } catch (ex) {
      next(ex);
    }
  });
  
  // Endpoint to delete an order item
  app.delete('/api/orderitems/:id', async (req, res, next) => {
    try {
      await deleteOrderItem(req.params.id);
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
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
  
    // Start the server
    app.listen(port, () => console.log(`Listening on port ${port}`));
  };
  
  // Call the initialization function
  init();