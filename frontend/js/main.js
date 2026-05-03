const API_URL = window.location.origin + '/api';

// Theme switcher removed

// Age Verification Logic
const checkAgeVerification = () => {
    // Clear old localStorage to ensure we only use sessionStorage now
    localStorage.removeItem('ageVerified');
    
    let isVerified = sessionStorage.getItem('ageVerified');
    const ageModal = document.getElementById('age-verification');
    const mainContent = document.getElementById('main-content');
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/frontend/');

    // Always require verification when visiting the main index page directly
    if (isIndexPage) {
        isVerified = 'false';
    }

    if (isVerified !== 'true') {
        let modal = document.getElementById('age-verification');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'age-verification';
            modal.innerHTML = `
                <h1>AGE RESTRICTED</h1>
                <p>This website contains information about alcohol and is only accessible to people of legal drinking age. By entering this site, you agree to our Terms and Conditions and Privacy Policy. You must be 21+ to enter this site.</p>
                <div class="age-buttons">
                    <button id="btn-yes" class="btn btn-red">YES, I am 21+</button>
                    <button id="btn-no" class="btn">NO, I am under 21</button>
                </div>
                <p id="access-denied-msg" style="display:none; color: red; margin-top: 20px; font-weight: bold;">Access Denied. You must be 21 or older to visit this site.</p>
            `;
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
        if (mainContent) mainContent.style.display = 'none';

        document.getElementById('btn-yes').onclick = () => {
            sessionStorage.setItem('ageVerified', 'true');
            modal.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            
            if (isIndexPage) {
                window.location.href = 'home.html';
            } else if (typeof fetchProducts === 'function') {
                fetchProducts();
            }
        };

        document.getElementById('btn-no').onclick = () => {
            document.getElementById('access-denied-msg').style.display = 'block';
        };
    } else {
        if (ageModal) ageModal.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        
        if (isIndexPage) {
            window.location.href = 'home.html';
        }
    }
};

// Cart Logic
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const updateCartCount = () => {
    const countElements = document.querySelectorAll('.cart-count');
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countElements.forEach(el => el.textContent = totalCount);
};

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
};

const addToCart = (product) => {
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item._id !== productId);
    saveCart();
    renderCart();
};

// Fetch and render products (Shop Page)
let allProducts = [];

const renderProducts = (productsToRender) => {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = '';
    
    if (productsToRender.length === 0) {
        container.innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">No products found.</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/250?text=Image+Not+Found'">
            <p class="product-category">${product.category}</p>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">₹${product.price.toFixed(2)}</p>
            <button class="btn add-to-cart-btn" data-product='${JSON.stringify(product).replace(/'/g, "&#39;")}'>Add to Cart</button>
        `;
        container.appendChild(card);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const product = JSON.parse(e.target.getAttribute('data-product'));
            addToCart(product);
        });
    });
};

const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_URL}/products`);
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('products-container').innerHTML = '<p class="text-center" style="grid-column: 1 / -1;">Failed to load products.</p>';
    }
};

const setupSearch = () => {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const priceFilter = document.getElementById('price-filter');
    
    if (!searchInput || !searchBtn) return;

    const performSearch = () => {
        const query = searchInput.value.toLowerCase();
        const priceValue = priceFilter ? priceFilter.value : 'all';

        const filtered = allProducts.filter(p => {
            const matchesQuery = p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
            let matchesPrice = true;
            
            if (priceValue === 'low') {
                matchesPrice = p.price < 1000;
            } else if (priceValue === 'medium') {
                matchesPrice = p.price >= 1000 && p.price <= 5000;
            } else if (priceValue === 'high') {
                matchesPrice = p.price > 5000;
            }

            return matchesQuery && matchesPrice;
        });
        renderProducts(filtered);
    };

    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('input', performSearch);
    if (priceFilter) {
        priceFilter.addEventListener('change', performSearch);
    }
};

// Render Cart (Cart Page)
const renderCart = () => {
    const container = document.getElementById('cart-container');
    const checkoutSection = document.getElementById('checkout-section');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        checkoutSection.style.display = 'none';
        return;
    }

    checkoutSection.style.display = 'block';
    container.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/50?text=img'">
                <div>
                    <h4>${item.name}</h4>
                    <p>₹${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
            </div>
            <div>
                <span style="margin-right: 20px; font-weight: bold;">₹${itemTotal.toFixed(2)}</span>
                <button class="btn btn-red" onclick="removeFromCart('${item._id}')">Remove</button>
            </div>
        `;
        container.appendChild(cartItem);
    });

    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `Total: ₹${total.toFixed(2)}`;
    container.appendChild(totalDiv);
};

// Auth Logic
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let token = localStorage.getItem('token') || null;

const injectAuthModals = () => {
    const modalsDiv = document.createElement('div');
    modalsDiv.innerHTML = `
        <!-- Auth Modal -->
        <div id="auth-modal" class="auth-modal" style="display:none;">
            <div class="auth-modal-content">
                <span class="close-auth" id="close-auth">&times;</span>
                <div class="auth-tabs" id="auth-tabs">
                    <div class="auth-tab active" id="tab-login">Login</div>
                    <div class="auth-tab" id="tab-register">Register</div>
                </div>
                
                <p id="auth-error-msg" class="auth-error"></p>
                <p id="auth-success-msg" class="auth-error" style="color: #28a745; display:none;"></p>

                <!-- Login Form -->
                <form id="login-form" class="auth-form active">
                    <input type="email" id="login-email" placeholder="Email Address" required>
                    <input type="password" id="login-password" placeholder="Password" required>
                    <label class="show-password-container">
                        <input type="checkbox" id="toggle-login-pwd"> Show Password
                    </label>
                    <button type="submit" class="btn btn-red" style="width: 100%;">Login</button>
                    <a class="auth-link" id="link-forgot-password">Forgot Password?</a>
                </form>

                <!-- Register Form -->
                <form id="register-form" class="auth-form">
                    <input type="text" id="reg-name" placeholder="Full Name" required>
                    <input type="email" id="reg-email" placeholder="Email Address" required>
                    <label for="reg-dob" style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: -10px;">Date of Birth</label>
                    <input type="date" id="reg-dob" required>
                    <input type="password" id="reg-password" placeholder="Password" required>
                    <label class="show-password-container">
                        <input type="checkbox" id="toggle-reg-pwd"> Show Password
                    </label>
                    <button type="submit" class="btn btn-red" style="width: 100%;">Register</button>
                </form>

                <!-- Forgot Password Form -->
                <form id="forgot-form" class="auth-form">
                    <h3 style="color: var(--primary-color); margin-bottom: 15px;">Reset Password</h3>
                    <input type="email" id="forgot-email" placeholder="Email Address" required>
                    <label for="forgot-dob" style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: -10px;">Date of Birth</label>
                    <input type="date" id="forgot-dob" required>
                    <input type="password" id="forgot-new-password" placeholder="New Password" required>
                    <label class="show-password-container">
                        <input type="checkbox" id="toggle-forgot-pwd"> Show Password
                    </label>
                    <button type="submit" class="btn btn-red" style="width: 100%;">Reset & Save</button>
                    <a class="auth-link" id="link-back-login" style="margin-top: 15px;">Back to Login</a>
                </form>
            </div>
        </div>

        <!-- Settings Modal -->
        <div id="settings-modal" class="auth-modal" style="display:none;">
            <div class="auth-modal-content">
                <span class="close-auth" id="close-settings">&times;</span>
                <h3 style="color: var(--primary-color); margin-bottom: 20px;">Account Settings</h3>
                <p id="settings-error-msg" class="auth-error"></p>
                <p id="settings-success-msg" class="auth-error" style="color: #28a745; display:none;"></p>
                
                <form id="settings-form">
                    <label style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: -5px; display: block;">Change Full Name</label>
                    <input type="text" id="settings-name" required>
                    
                    <label style="color: var(--text-muted); font-size: 0.85rem; margin-top: 10px; margin-bottom: -5px; display: block;">Change Password (optional)</label>
                    <input type="password" id="settings-password" placeholder="New Password (leave blank to keep current)">
                    <label class="show-password-container" style="margin-top: 5px;">
                        <input type="checkbox" id="toggle-settings-pwd"> Show Password
                    </label>

                    <button type="submit" class="btn btn-red" style="width: 100%;">Save Changes</button>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(modalsDiv);
};

const renderProfileNav = () => {
    const profileLi = document.getElementById('nav-profile');
    if (!profileLi) return;

    const currentTheme = localStorage.getItem('site-theme') || 'default';
    let themeHtml = '';

    if (currentUser) {
        profileLi.innerHTML = `
            <div style="display: flex; align-items: center; position: relative;">
                <button class="profile-btn" id="profile-toggle">
                    <span>👤</span> ${currentUser.name.split(' ')[0]}
                </button>
                <div class="dropdown-menu" id="profile-dropdown">
                    <button id="btn-settings">⚙️ Settings</button>
                    <button id="btn-logout">🚪 Logout</button>
                </div>
            </div>
        `;
        
        document.getElementById('profile-toggle').addEventListener('click', (e) => {
            e.stopPropagation();
            document.getElementById('profile-dropdown').classList.toggle('show');
        });
        
        document.getElementById('btn-settings').addEventListener('click', () => {
            document.getElementById('settings-name').value = currentUser.name;
            document.getElementById('settings-modal').style.display = 'flex';
            document.getElementById('profile-dropdown').classList.remove('show');
        });

        document.getElementById('btn-logout').addEventListener('click', logout);
        
        window.addEventListener('click', () => {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown) dropdown.classList.remove('show');
        });
    } else {
        profileLi.innerHTML = `
            <div style="display: flex; align-items: center;">
                <button class="profile-btn" onclick="document.getElementById('auth-modal').style.display='flex'">
                    Login
                </button>
            </div>
        `;
    }
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    token = null;
    renderProfileNav();
    location.reload();
};

const setupAuthModal = () => {
    injectAuthModals();
    renderProfileNav();

    const authModal = document.getElementById('auth-modal');
    const closeBtn = document.getElementById('close-auth');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('login-form');
    const formRegister = document.getElementById('register-form');
    const formForgot = document.getElementById('forgot-form');
    const errorMsg = document.getElementById('auth-error-msg');
    const successMsg = document.getElementById('auth-success-msg');

    const closeSettings = document.getElementById('close-settings');
    const settingsModal = document.getElementById('settings-modal');
    const formSettings = document.getElementById('settings-form');

    if (!authModal) return;

    closeBtn.onclick = () => authModal.style.display = 'none';
    closeSettings.onclick = () => settingsModal.style.display = 'none';

    window.onclick = (e) => { 
        if (e.target === authModal) authModal.style.display = 'none'; 
        if (e.target === settingsModal) settingsModal.style.display = 'none';
    };

    tabLogin.onclick = () => {
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
        formLogin.classList.add('active');
        formRegister.classList.remove('active');
        formForgot.classList.remove('active');
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
    };

    tabRegister.onclick = () => {
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
        formRegister.classList.add('active');
        formLogin.classList.remove('active');
        formForgot.classList.remove('active');
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
    };

    document.getElementById('link-forgot-password').onclick = () => {
        tabLogin.classList.remove('active');
        tabRegister.classList.remove('active');
        formLogin.classList.remove('active');
        formRegister.classList.remove('active');
        formForgot.classList.add('active');
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
    };

    // Password Visibility Toggles
    document.getElementById('toggle-login-pwd').addEventListener('change', function() {
        document.getElementById('login-password').type = this.checked ? 'text' : 'password';
    });
    document.getElementById('toggle-reg-pwd').addEventListener('change', function() {
        document.getElementById('reg-password').type = this.checked ? 'text' : 'password';
    });
    document.getElementById('toggle-forgot-pwd').addEventListener('change', function() {
        document.getElementById('forgot-new-password').type = this.checked ? 'text' : 'password';
    });
    document.getElementById('toggle-settings-pwd').addEventListener('change', function() {
        document.getElementById('settings-password').type = this.checked ? 'text' : 'password';
    });

    // Theme selector removed

    document.getElementById('link-back-login').onclick = () => {
        tabLogin.onclick();
    };

    formLogin.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (res.ok) {
                token = data.token;
                currentUser = data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(data));
                authModal.style.display = 'none';
                renderProfileNav();
                
                // Automatically trigger checkout form if relevant
                const orderForm = document.getElementById('order-form');
                if (orderForm && orderForm.offsetParent !== null) {
                    orderForm.dispatchEvent(new Event('submit'));
                }
            } else {
                errorMsg.textContent = data.message;
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = 'Server error. Try again.';
            errorMsg.style.display = 'block';
        }
    };

    formRegister.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const dob = document.getElementById('reg-dob').value;
        const password = document.getElementById('reg-password').value;

        if (!dob) {
            errorMsg.textContent = 'Please enter your date of birth.';
            errorMsg.style.display = 'block';
            return;
        }

        const dobDate = new Date(dob);
        const diffMs = Date.now() - dobDate.getTime();
        const ageDate = new Date(diffMs); 
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);

        if (age < 21) {
            errorMsg.textContent = 'You must be at least 21 years old to register.';
            errorMsg.style.display = 'block';
            return;
        }

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, dob, password })
            });
            const data = await res.json();
            if (res.ok) {
                successMsg.textContent = 'Registration successful! Please login to proceed.';
                successMsg.style.display = 'block';
                tabLogin.onclick(); // switch back to login
                formRegister.reset();
            } else {
                errorMsg.textContent = data.message;
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = 'Server error. Try again.';
            errorMsg.style.display = 'block';
        }
    };

    formForgot.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('forgot-email').value;
        const dob = document.getElementById('forgot-dob').value;
        const newPassword = document.getElementById('forgot-new-password').value;

        try {
            const res = await fetch(`${API_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, dob, newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                successMsg.textContent = 'Password reset successful! You can now login.';
                successMsg.style.display = 'block';
                tabLogin.onclick();
                formForgot.reset();
            } else {
                errorMsg.textContent = data.message;
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            errorMsg.textContent = 'Server error. Try again.';
            errorMsg.style.display = 'block';
        }
    };

    formSettings.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('settings-name').value.trim();
        const password = document.getElementById('settings-password').value;
        const settingsError = document.getElementById('settings-error-msg');
        const settingsSuccess = document.getElementById('settings-success-msg');

        if (name === currentUser.name && !password) {
            settingsError.textContent = 'No changes were made.';
            settingsError.style.display = 'block';
            settingsSuccess.style.display = 'none';
            return;
        }

        try {
            const body = { name };
            if (password) body.password = password;

            const res = await fetch(`${API_URL}/auth/profile`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                currentUser.name = data.name;
                localStorage.setItem('user', JSON.stringify(currentUser));
                settingsSuccess.textContent = 'Account updated successfully!';
                settingsSuccess.style.display = 'block';
                settingsError.style.display = 'none';
                document.getElementById('settings-password').value = '';
                renderProfileNav();
                setTimeout(() => { settingsModal.style.display = 'none'; settingsSuccess.style.display = 'none'; }, 2000);
            } else {
                settingsError.textContent = data.message;
                settingsError.style.display = 'block';
            }
        } catch (err) {
            settingsError.textContent = 'Server error. Try again.';
            settingsError.style.display = 'block';
        }
    };
};

// Submit Order
const submitOrder = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    if (!token) {
        const authModal = document.getElementById('auth-modal');
        if (authModal) {
            authModal.style.display = 'flex';
        } else {
            alert("Please login first.");
        }
        return;
    }

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const pickup = document.getElementById('pickup').value;

    const orderData = {
        customerName: name,
        phoneNumber: phone,
        pickupTime: pickup,
        cartItems: cart.map(item => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
        })),
        totalPrice: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await response.json();

        if (response.ok) {
            // Clear cart
            cart = [];
            saveCart();
            
            // Show success message and IDs
            document.getElementById('cart-container').style.display = 'none';
            document.getElementById('checkout-section').style.display = 'none';
            document.getElementById('order-success').style.display = 'flex';
            
            document.getElementById('popup-order-id').textContent = data.orderId;
            document.getElementById('popup-customer-id').textContent = data.customerId;
        } else {
            if (response.status === 401) {
                // Token invalid
                localStorage.removeItem('token');
                token = null;
                const authModal = document.getElementById('auth-modal');
                if (authModal) authModal.style.display = 'flex';
            } else {
                alert(`Error placing order: ${data.message}`);
            }
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Failed to connect to server.');
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAgeVerification();
    updateCartCount();
    setupSearch();
    setupAuthModal();

    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', submitOrder);
    }
});
