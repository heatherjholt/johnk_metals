// 1. Mock Spot Prices
let spotPrices = {
    gold: 2450.50,
    silver: 31.20,
    platinum: 980.00
};

// 2. Mock Product Catalog
const products = [
    {
        id: 1, name: "1 oz Gold American Eagle", metal: "gold", weightOz: 1, premium: 125.00,
        image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2, name: "1 oz Gold Canadian Maple", metal: "gold", weightOz: 1, premium: 85.00,
        image: "https://imgs.search.brave.com/LtMja7o8jJCYGpmgyccttprgCVKHtCmwP2alcy7jrKY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG4u/am1idWxsaW9uLmNv/bS93cC1jb250ZW50/L3VwbG9hZHMvMjAy/Mi8wOS80Njk2MTQ5/X2Zyb250LTIwMngy/MDIuanBn"
    },
    {
        id: 3, name: "10 oz Silver Bar", metal: "silver", weightOz: 10, premium: 25.00,
        image: "https://imgs.search.brave.com/yKAfBH9gomRhPAOT-Sz-cIagEETDo8M5C0vJy4adhpE/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9idWxs/aW9udHJhZGluZ2xs/Yy5jb20vd3AtY29u/dGVudC91cGxvYWRz/LzIwMjYvMDEvMGNh/NTU0MzktOTIyMS00/ZjRiLWJkMmEtMjc0/OWVmYzkyZDliLmMw/ZjNkODhmMDljZDc1/NWRmNDNiZDZhMTcz/MjdlYWU2LTMwMHgz/MDAud2VicA"
    },
    {
        id: 4, name: "1 oz Platinum Maple Leaf", metal: "platinum", weightOz: 1, premium: 65.00,
        image: "https://imgs.search.brave.com/cP_UQY10LXGB3Yca0OcdL5u4ASCCodnyxVJdeV0qWzo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9qYW5k/bWNvaW5zLmNvbS9j/ZG4vc2hvcC9maWxl/cy9mYWxzZV9lM2Rl/ZTQwNy04NTBmLTQ3/ZTYtYjcyOC05YmVl/MGZhNjAxNmQuanBn/P3Y9MTcxNzAzNDgw/NSZ3aWR0aD17d2lk/dGh9"
    }
];

// Helper to format currency
const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

// --- NEW CART LOGIC ---
// Initialize cart from local storage or create an empty array
let cart = JSON.parse(localStorage.getItem('johnsMetalsCart')) || [];

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        // Sum up total quantity of all items
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
        
        // Add a little pop animation when number changes
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 200);
    }
}

function addToCart(id, name, price, premium) {
    // Check if item is already in cart
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, premium, quantity: 1 });
    }
    
    // Save to browser memory
    localStorage.setItem('johnsMetalsCart', JSON.stringify(cart));
    
    // Update the UI
    updateCartBadge();
    
    // Temporary visual feedback
    const btn = event.currentTarget;
    const originalText = btn.innerText;
    btn.innerText = "Added to Cart ✓";
    btn.classList.add("bg-green-600");
    btn.classList.remove("bg-navy", "hover:bg-gold");
    
    setTimeout(() => {
        btn.innerText = originalText;
        btn.classList.remove("bg-green-600");
        btn.classList.add("bg-navy", "hover:bg-gold");
    }, 1500);
}
// ----------------------

// 3. Render Market Ticker
function renderTicker() {
    const tickerHtml = `
        <span class="text-gold font-bold">GOLD:</span> ${formatMoney(spotPrices.gold)} 
        <span class="mx-4 text-gray-500">|</span>
        <span class="text-gray-300 font-bold">SILVER:</span> ${formatMoney(spotPrices.silver)}
        <span class="mx-4 text-gray-500">|</span>
        <span class="text-gray-300 font-bold">PLATINUM:</span> ${formatMoney(spotPrices.platinum)}
    `;
    const tickerBar = document.getElementById('ticker-bar');
    if (tickerBar) {
        tickerBar.innerHTML = tickerHtml;
        tickerBar.classList.remove('animate-pulse');
    }
}

// 4. Render Product Cards
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = ''; 

    products.forEach(product => {
        const baseValue = spotPrices[product.metal] * product.weightOz;
        const retailPrice = baseValue + product.premium;

        const card = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col" id="prod-${product.id}">
                <div class="h-48 overflow-hidden bg-gray-200">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="p-5 flex-grow flex flex-col justify-between">
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">${product.weightOz} oz ${product.metal}</p>
                        <h3 class="text-lg font-bold text-navy mb-2 leading-tight">${product.name}</h3>
                    </div>
                    
                    <div class="mt-4 price-container rounded p-2 -mx-2 transition-colors duration-300">
                        <p class="text-sm text-gray-500">Live Retail Price:</p>
                        <p class="text-2xl font-bold text-green-600">${formatMoney(retailPrice)}</p>
                        <p class="text-xs text-gray-400 mt-1">Includes $${product.premium.toFixed(2)} markup</p>
                    </div>
                    
                    <button onclick="addToCart(${product.id}, '${product.name}', ${retailPrice}, ${product.premium})" class="mt-4 w-full bg-navy text-white font-semibold py-2 rounded hover:bg-gold transition duration-300">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// 5. Simulate Live Market Fluctuations
function simulateMarketChanges() {
    spotPrices.gold = spotPrices.gold * (1 + (Math.random() * 0.002 - 0.001));
    spotPrices.silver = spotPrices.silver * (1 + (Math.random() * 0.004 - 0.002));
    spotPrices.platinum = spotPrices.platinum * (1 + (Math.random() * 0.003 - 0.0015));

    renderTicker();
    
    // Note: In a real app we would just update the price text nodes, 
    // but for the mockup re-rendering works fine.
    renderProducts();
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    renderTicker();
    renderProducts();
    updateCartBadge(); // Load initial cart count
    
    setInterval(simulateMarketChanges, 5000);
});