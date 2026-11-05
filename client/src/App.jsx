import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("login");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    description: "",
    category: "",
    type: "Lost",
    location: "",
    image: ""
  };

  const [form, setForm] = useState(emptyForm);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  async function request(path, options = {}) {
    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Something went wrong");
    }

    return data;
  }

  async function loadItems() {
    try {
      const data = await request("/items");
      setItems(data.items || []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadProfile() {
    try {
      const data = await request("/auth/me");
      setUser(data);
    } catch {
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (token) loadProfile();
    else setUser(null);
  }, [token]);

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        authMode === "login" ? "/auth/login" : "/auth/register";

      const body =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;

      const data = await request(endpoint, {
        method: "POST",
        body: JSON.stringify(body)
      });

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      setPage("home");
      setAuthForm({
        name: "",
        email: "",
        password: "",
        phone: ""
      });
      setMessage("Welcome! You are successfully logged in.");
      await loadItems();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitItem(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (editingId) {
        await request(`/items/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form)
        });
        setMessage("Item updated successfully.");
      } else {
        await request("/items", {
          method: "POST",
          body: JSON.stringify(form)
        });
        setMessage("Item posted successfully.");
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadItems();
      setPage("home");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function openMyItems() {
    try {
      const data = await request("/items/mine");
      setItems(data.items || []);
      setPage("mine");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editItem(item) {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      category: item.category || "",
      type: item.type || "Lost",
      location: item.location || "",
      image: item.image || ""
    });
    setPage("post");
    setMessage("");
  }

  async function deleteItem(id) {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await request(`/items/${id}`, { method: "DELETE" });
      await openMyItems();
      setMessage("Item deleted successfully.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  // OWNER CONFIRMS THAT THE ITEM HAS BEEN RECEIVED
  async function markReturned(id) {
    if (!window.confirm("Have you received this item?")) return;

    try {
      await request(`/items/${id}/return`, {
        method: "PATCH"
      });

      // Refresh My Items without clearing the success message
      const data = await request("/items/mine");
      setItems(data.items || []);
      setPage("mine");

      setMessage("Success! Your item has been marked as RETURNED.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
    setPage("home");
    setMessage("You have been logged out.");
    loadItems();
  }

  function showAllItems() {
    setPage("home");
    loadItems();
  }

  const visibleItems = items.filter((item) => {
    const matchesSearch = [
      item.title,
      item.description,
      item.category,
      item.location
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter = filter === "All" || item.type === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand" onClick={showAllItems}>
          <span className="brand-icon">🔎</span>
          Lost<span>&</span>Found
        </button>

        <nav>
          <button onClick={showAllItems}>Home</button>

          {user && (
            <>
              <button onClick={openMyItems}>My Items</button>
              <button
                onClick={() => {
                  setForm(emptyForm);
                  setEditingId(null);
                  setPage("post");
                  setMessage("");
                }}
              >
                Post Item
              </button>
            </>
          )}
        </nav>

        <div className="nav-user">
          {user ? (
            <>
              <span className="welcome">Hi, {user.name}</span>
              <button className="outline-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button
              className="primary-btn"
              onClick={() => {
                setAuthMode("login");
                setPage("auth");
                setMessage("");
              }}
            >
              Login / Register
            </button>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="eyebrow">
              YOUR COMMUNITY LOST & FOUND PORTAL
            </p>

            <h1>
              Lost something?
              <br />
              <span>Find it here.</span>
            </h1>

            <p className="hero-description">
              A simple place to report lost belongings and help reunite
              people with the things that matter.
            </p>

            <div className="hero-actions">
              <button
                className="primary-btn"
                onClick={() => {
                  if (!user) {
                    setPage("auth");
                    setAuthMode("register");
                  } else {
                    setForm(emptyForm);
                    setEditingId(null);
                    setPage("post");
                  }
                }}
              >
                + Post an Item
              </button>

              <button className="outline-btn" onClick={showAllItems}>
                Explore Items
              </button>
            </div>
          </div>

          <div className="hero-art">🔍</div>
        </section>

        <section className="content-section">
          {message && (
            <div className="notice">
              {message}
              <button onClick={() => setMessage("")}>×</button>
            </div>
          )}

          {page === "auth" && (
            <div className="form-card auth-card">
              <h2>
                {authMode === "login" ? "Welcome Back" : "Create Account"}
              </h2>

              <p className="muted">
                {authMode === "login"
                  ? "Login to manage your lost and found items."
                  : "Join the community and help reconnect belongings."}
              </p>

              <form onSubmit={handleAuth}>
                {authMode === "register" && (
                  <>
                    <label>Full Name</label>
                    <input
                      required
                      value={authForm.name}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, name: e.target.value })
                      }
                      placeholder="Your name"
                    />

                    <label>Phone Number</label>
                    <input
                      value={authForm.phone}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, phone: e.target.value })
                      }
                      placeholder="Phone number"
                    />
                  </>
                )}

                <label>Email</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                  placeholder="you@example.com"
                />

                <label>Password</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  placeholder="Enter password"
                />

                <button className="primary-btn full-btn" disabled={loading}>
                  {loading
                    ? "Please wait..."
                    : authMode === "login"
                      ? "Login"
                      : "Register"}
                </button>
              </form>

              <p className="switch-auth">
                {authMode === "login"
                  ? "New here?"
                  : "Already have an account?"}

                <button
                  onClick={() =>
                    setAuthMode(authMode === "login" ? "register" : "login")
                  }
                >
                  {authMode === "login" ? "Create an account" : "Login"}
                </button>
              </p>
            </div>
          )}

          {page === "post" && (
            <div className="form-card">
              <h2>{editingId ? "Update Item" : "Report an Item"}</h2>

              <p className="muted">
                Provide details so the community can identify it.
              </p>

              <form onSubmit={handleSubmitItem}>
                <label>Item Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="Example: Black Wallet"
                />

                <label>Description</label>
                <textarea
                  required
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the item..."
                />

                <div className="form-row">
                  <div>
                    <label>Category</label>
                    <input
                      required
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      placeholder="Electronics, Accessories..."
                    />
                  </div>

                  <div>
                    <label>Type</label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                    >
                      <option value="Lost">Lost</option>
                      <option value="Found">Found</option>
                    </select>
                  </div>
                </div>

                <label>Location</label>
                <input
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  placeholder="Where was it lost or found?"
                />

                <label>Image URL (optional)</label>
                <input
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />

                <button className="primary-btn full-btn" disabled={loading}>
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update Item"
                      : "Publish Item"}
                </button>

                <button
                  type="button"
                  className="cancel-btn full-btn"
                  onClick={() => {
                    setPage("home");
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}

          {(page === "home" || page === "mine") && (
            <>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">
                    {page === "mine" ? "YOUR POSTS" : "COMMUNITY BOARD"}
                  </p>

                  <h2>
                    {page === "mine"
                      ? "My Items"
                      : "Recently Reported Items"}
                  </h2>
                </div>

                <span className="item-count">
                  {visibleItems.length} items
                </span>
              </div>

              <div className="filters">
                <input
                  className="search-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by item, category or location..."
                />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="All">All Items</option>
                  <option value="Lost">Lost Items</option>
                  <option value="Found">Found Items</option>
                </select>
              </div>

              {visibleItems.length === 0 ? (
                <div className="empty-state">
                  <div>📦</div>
                  <h3>No items found</h3>
                  <p>Try another search or post a new item.</p>
                </div>
              ) : (
                <div className="item-grid">
                  {visibleItems.map((item) => (
                    <article className="item-card" key={item._id}>
                      <div className="item-image">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span>📦</span>
                        )}

                        <span className={`status ${item.type.toLowerCase()}`}>
                          {item.type}
                        </span>
                      </div>

                      <div className="item-info">
                        <p className="category">{item.category}</p>
                        <h3>{item.title}</h3>
                        <p className="description">{item.description}</p>
                        <p className="location">📍 {item.location}</p>

                        {page === "mine" && (
                          <>
                            <p className="item-status">
                              Status:{" "}
                              {item.status === "Returned" ? (
                                <strong style={{ color: "green" }}>
                                  ✓ Returned Successfully
                                </strong>
                              ) : (
                                <strong style={{ color: "#d97706" }}>
                                  Active - Not Returned
                                </strong>
                              )}
                            </p>

                            {item.status !== "Returned" && (
                              <button
                                className="primary-btn full-btn"
                                onClick={() => markReturned(item._id)}
                              >
                                Mark as Returned
                              </button>
                            )}

                            <div className="item-actions">
                              {item.status !== "Returned" && (
                                <button
                                  className="edit-btn"
                                  onClick={() => editItem(item)}
                                >
                                  Edit
                                </button>
                              )}

                              <button
                                className="delete-btn"
                                onClick={() => deleteItem(item._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <footer>
        <strong>Lost & Found</strong>
        <p>Helping communities reconnect with what matters.</p>
        <span>© 2026 Lost & Found Project</span>
      </footer>
    </div>
  );
}

export default App;