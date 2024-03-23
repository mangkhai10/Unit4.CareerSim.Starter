// Import necessary modules
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_Anime_Figures_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'figures';

// Function to create database tables
const createTables = async () => {
    const SQL = `
      -- Drop existing tables if they exist
      DROP TABLE IF EXISTS admin;
      DROP TABLE IF EXISTS adminuser;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS user_address;
      DROP TABLE IF EXISTS user_payment;
  
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS product_categories;
      DROP TABLE IF EXISTS product_inventories;
      DROP TABLE IF EXISTS cart_items;
      DROP TABLE IF EXISTS order_items;
      DROP TABLE IF EXISTS order_details;
      DROP TABLE IF EXISTS payment_details;
  
      -- Create admin table
      CREATE TABLE admin (
        admin_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
  
      -- Create adminuser table
      CREATE TABLE adminuser (
        adminuser_id SERIAL PRIMARY KEY,
        admin_id INT REFERENCES admin(admin_id),
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
  
      -- Create users table
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
  
      -- Create user_address table
      CREATE TABLE user_address (
        address_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        address VARCHAR(255) NOT NULL
      );
  
      -- Create user_payment table
      CREATE TABLE user_payment (
        payment_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        payment_method VARCHAR(50) NOT NULL
      );
  
      -- Create products table
      CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL
      );
  
      -- Create product_categories table
      CREATE TABLE product_categories (
        category_id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      );
  
      -- Create product_inventories table
      CREATE TABLE product_inventories (
        inventory_id SERIAL PRIMARY KEY,
        product_id INT REFERENCES products(product_id),
        quantity INT NOT NULL
      );
  
      -- Create cart_items table
      CREATE TABLE cart_items (
        cart_item_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        product_id INT REFERENCES products(product_id),
        quantity INT NOT NULL
      );
  
      -- Create order_items table
      CREATE TABLE order_items (
        order_item_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        product_id INT REFERENCES products(product_id),
        quantity INT NOT NULL
      );
  
      -- Create order_details table
      CREATE TABLE order_details (
        order_detail_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending'
      );
  
      -- Create payment_details table
      CREATE TABLE payment_details (
        payment_detail_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id),
        payment_method VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL
      );
    `;
    // Execute the SQL query to create tables
    await client.query(SQL);
  };
  
  
// Function to create a new admin
const createAdmin = async ({ username, password }) => {
    const SQL = `
      INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [username, await bcrypt.hash(password, 10)]);
    return response.rows[0];
  };

  // Function to create a new admin user
const createAdminUser = async ({ admin_id, username, password }) => {
    const SQL = `
      INSERT INTO adminuser (admin_id, username, password) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [admin_id, username, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  };

  // Function to create a new user
const createUser = async ({ username, email, password }) => {
    const SQL = `
      INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [username, email, await bcrypt.hash(password, 5)]);
    return response.rows[0];
  };
  
  
// Function to create a new user address
const createUserAddress = async ({ user_id, address }) => {
    const SQL = `
      INSERT INTO user_address (user_id, address) VALUES ($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [user_id, address]);
    return response.rows[0];
  };
  
  // Function to create a new user payment method
const createUserPayment = async ({ user_id, payment_method }) => {
    const SQL = `
      INSERT  INTO user_payment (user_id, payment_method) VALUES ($1, $2) RETURNING *
      `;
const response = await client.query(SQL, [user_id, payment_method]);
  return response.rows[0];
};

// Function to create a new product
const createProduct = async ({ name, description, price }) => {
    const SQL = `
      INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [name, description, price]);
    return response.rows[0];
  };

  // Function to create a new product category
const createProductCategory = async ({ name }) => {
    const SQL = `
      INSERT INTO product_categories (name) VALUES ($1) RETURNING *
    `;
    const response = await client.query(SQL, [name]);
    return response.rows[0];
  };
  

  // Function to create a new product inventory
const createProductInventory = async ({ product_id, quantity }) => {
    const SQL = `
      INSERT INTO product_inventories (product_id, quantity) VALUES ($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [product_id, quantity]);
    return response.rows[0];
  };

  // Function to create a new cart item
const createCartItem = async ({ user_id, product_id, quantity }) => {
    const SQL = `
      INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [user_id, product_id, quantity]);
    return response.rows[0];
  };

  // Function to create a new order item
const createOrderItem = async ({ user_id, product_id, quantity }) => {
    const SQL = `
      INSERT INTO order_items (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [user_id, product_id, quantity]);
    return response.rows[0];
  };

  // Function to create a new order detail
const createOrderDetail = async ({ user_id, total_amount, status }) => {
    const SQL = `
      INSERT INTO order_details (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [user_id, total_amount, status]);
    return response.rows[0];
  };

  // Function to create a new payment detail
const createPaymentDetail = async ({ user_id, payment_method, amount }) => {
    const SQL = `
      INSERT INTO payment_details (user_id, payment_method, amount) VALUES ($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [user_id, payment_method, amount]);
    return response.rows[0];
  };

  const fetchAdmins = async () => {
    const SQL = `
      SELECT * FROM admin
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchAdminUsers = async () => {
    const SQL = `
      SELECT * FROM adminuser
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchUsers = async () => {
    const SQL = `
      SELECT * FROM users
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchUserAddresses = async () => {
    const SQL = `
      SELECT * FROM user_address
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchUserPayments = async () => {
    const SQL = `
      SELECT * FROM user_payment
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchProducts = async () => {
    const SQL = `
      SELECT * FROM products
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchProductCategories = async () => {
    const SQL = `
      SELECT * FROM product_categories
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchProductInventories = async () => {
    const SQL = `
      SELECT * FROM product_inventories
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchCartItems = async () => {
    const SQL = `
      SELECT * FROM cart_items
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchOrderItems = async () => {
    const SQL = `
      SELECT * FROM order_items
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchOrderDetails = async () => {
    const SQL = `
      SELECT * FROM order_details
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchPaymentDetails = async () => {
    const SQL = `
      SELECT * FROM payment_details
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

 // Function to delete a product by ID
const deleteProduct = async (productId) => {
    const SQL = `
      DELETE FROM products WHERE product_id = $1 RETURNING *
    `;
    const response = await client.query(SQL, [productId]);
    return response.rows[0]; 
};

// Function to delete a cart item by ID
const deleteCartItem = async (cartItemId) => {
    const SQL = `
      DELETE FROM cart_items WHERE cart_item_id = $1 RETURNING *
    `;
    const response = await client.query(SQL, [cartItemId]);
    return response.rows[0]; 
};

// Function to delete a payment detail by ID
const deletePaymentDetail = async (paymentDetailId) => {
    const SQL = `
      DELETE FROM payment_details WHERE payment_detail_id = $1 RETURNING *
    `;
    const response = await client.query(SQL, [paymentDetailId]);
    return response.rows[0]; 
};

// Function to find a user using their token
const findUserWithToken = async (token) => {
    let id;
    try {
      const payload = await jwt.verify(token, JWT);
      id = payload.id;
    } catch (ex) {
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    const SQL = `
      SELECT id, username FROM users WHERE id=$1;
    `;
    const response = await client.query(SQL, [id]);
    if (!response.rows.length) {
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    return response.rows[0];
  };

  // Function for user authentication
const authenticate = async ({ username, password }) => {
    const SQL = `
      SELECT id, password
     FROM users 
     WHERE username=$1;
    `;
    const response = await client.query(SQL, [username]);
    if (!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false) {
      const error = Error('not authorized');
      error.status = 401;
      throw error;
    }
    const token = await jwt.sign({ id: response.rows[0].id }, JWT);
    return { token };
  };

  module.exports = {
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
  };