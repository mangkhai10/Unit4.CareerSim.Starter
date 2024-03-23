import { useState, useEffect } from 'react';

// Login component
const Login= ({ login,register }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submitLogin = ev => {
    ev.preventDefault();
    login({ username, password });
};
const submitRegister = ev => {
  ev.preventDefault();
  register({ username, password });
};
  return (
    <form onSubmit={submitLogin}>
      <input value={username} placeholder='username' onChange={ev => setUsername(ev.target.value)} />
      <input value={password} placeholder='password' onChange={ev => setPassword(ev.target.value)} />
      <button disabled={!username || !password} onClick={submitLogin}>Login</button>
      <button disabled={!username || !password} onClick={submitRegister}>Register</button>
    </form>
  );
};

// App component
function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Attempt to log in with the token when the component mounts
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem('token');
    if (token) {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token
        }
      });
      const json = await response.json();
      if (response.ok) {
        setAuth(json);
      } else {
        window.localStorage.removeItem('token');
      }
    }
  };

  useEffect(() => {
    // Fetch products when the component mounts
    const fetchProducts = async () => {
      const response = await fetch('/api/products');
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Fetch favorites when auth changes
    const fetchFavorites = async () => {
      const response = await fetch(`/api/users/${auth.id}/favorites`, {
        headers: {
          authorization: window.localStorage.getItem('token')
        }
      });
      const json = await response.json();
      if (response.ok) {
        setFavorites(json);
      }
    };
    if (auth.id) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [auth]);

  const login = async (credentials) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
      console.log(json.message || "Login successful");
    } else {
      console.log(json.message || "Login failed");
    }
  };

  const register = async (credentials) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem('token', json.token);
      attemptLoginWithToken();
      console.log(json.message || "Register successful");
      login(credentials);
    } else {
      console.log(json);
    }
  };
  

  const addFavorite = async (product_id) => {
    const response = await fetch(`/api/users/${auth.id}/favorites`, {
      method: 'POST',
      body: JSON.stringify({ product_id }),
      headers: {
        'Content-Type': 'application/json',
        authorization: window.localStorage.getItem('token')
      }
    });

    const json = await response.json();
    if (response.ok) {
      setFavorites([...favorites, json]);
    } else {
      console.log(json);
    }
  };

  const removeFavorite = async (id) => {
    const response = await fetch(`/api/users/${auth.id}/favorites/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    });

    if (!response.ok) {
      const json = await response.json();
      console.log(json);
    } else {
      setFavorites(favorites.filter(favorite => favorite.id !== id));
    }
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    setAuth({});
  };

  return (
    <>
      {/* Render login form or logout button based on authentication status */}
      {!auth.id ? <Login login={login} register={register} />: <button onClick={logout}>Logout {auth.username}</button>}

      {/* Render product list with favorites */}
      <ul>
        {products.map(product => {
          const isFavorite = favorites.find(favorite => favorite.product_id === product.id);
          return (
            <li key={product.id} className={isFavorite ? 'favorite' : ''}>
              {product.name}
              {auth.id && isFavorite && <button onClick={() => removeFavorite(isFavorite.id)}>-</button>}
              {auth.id && !isFavorite && <button onClick={() => addFavorite(product.id)}>+</button>}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
