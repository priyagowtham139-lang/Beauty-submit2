/* =========================================================
   STACKLY BEAUTY — Shared Behaviour
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Mobile Nav Drawer ---------- */
  const hamburger = document.getElementById("hamburgerBtn");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("navOverlay");
  const drawerClose = document.getElementById("drawerClose");
  const dashSidebar = document.getElementById("dashSidebar");
  const dashClose = document.getElementById("dashSidebarClose");
  const isDashboard = !!dashSidebar && !drawer;

  function openDrawer() {
    if (isDashboard) {
      dashSidebar.classList.add("open");
      overlay?.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      drawer?.classList.add("active");
      overlay?.classList.add("active");
      hamburger?.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
  function closeDrawer() {
    if (isDashboard) {
      dashSidebar.classList.remove("open");
      overlay?.classList.remove("active");
      document.body.style.overflow = "";
    } else {
      drawer?.classList.remove("active");
      overlay?.classList.remove("active");
      hamburger?.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
  hamburger?.addEventListener("click", () => {
    if (isDashboard) {
      dashSidebar.classList.contains("open") ? closeDrawer() : openDrawer();
    } else {
      drawer?.classList.contains("active") ? closeDrawer() : openDrawer();
    }
  });
  drawerClose?.addEventListener("click", closeDrawer);
  dashClose?.addEventListener("click", closeDrawer);
  overlay?.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  function handleDashResize() {
    if (!isDashboard) return;
    const siteHeader = document.getElementById("siteHeader");
    if (window.innerWidth <= 768) {
      if (siteHeader) siteHeader.style.display = "block";
    } else {
      if (siteHeader) siteHeader.style.display = "none";
      dashSidebar.classList.remove("open");
      overlay?.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
  window.addEventListener("resize", handleDashResize);
  handleDashResize();

  /* ---------- Header scroll shadow ---------- */
  const header = document.getElementById("siteHeader");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    const toTop = document.getElementById("toTopBtn");
    if (toTop) {
      if (window.scrollY > 500) toTop.classList.add("show");
      else toTop.classList.remove("show");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.getElementById("toTopBtn")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Footer Accordion (mobile expandable) ---------- */
  document.querySelectorAll(".footer-acc-head").forEach((head) => {
    head.addEventListener("click", () => {
      const col = head.closest(".footer-col");
      if (window.innerWidth <= 900) {
        col.classList.toggle("open");
      }
    });
  });

  /* ---------- Scroll Reveal Animations ---------- */
  const revealEls = document.querySelectorAll(".reveal, .step-card");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* =========================================================
     CART / BAG
     ========================================================= */
  const CART_KEY = "stackly_cart";

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateBagCount();
  }
  function updateBagCount() {
    const cart = getCart();
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll(".bag-count").forEach((el) => (el.textContent = count));
  }
  function addToCart(product, btn) {
    const cart = getCart();
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    saveCart(cart);
    showToast(`${product.name} added to your bag`);
    if (btn) {
      const original = btn.innerHTML;
      btn.classList.add("added");
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Bag';
      setTimeout(() => {
        btn.classList.remove("added");
        btn.innerHTML = original;
      }, 1600);
    }
  }
  document.querySelectorAll(".add-bag-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        brand: btn.dataset.brand,
        price: Number(btn.dataset.price),
        oldPrice: Number(btn.dataset.oldprice || 0),
        cat: btn.dataset.cat || "cream",
      };
      addToCart(product, btn);
    });
  });

  /* ---------- Wishlist ---------- */
  const WISH_KEY = "stackly_wishlist";

  function getWishlist() {
    try {
      return JSON.parse(localStorage.getItem(WISH_KEY)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveWishlist(list) {
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
    updateWishCount();
  }
  function updateWishCount() {
    const count = getWishlist().length;
    document.querySelectorAll(".wish-count").forEach((el) => (el.textContent = count));
  }
  function toggleWishlist(product, btn) {
    const list = getWishlist();
    const idx = list.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      list.splice(idx, 1);
      btn.classList.remove("active");
      const icon = btn.querySelector("i");
      if (icon) { icon.classList.remove("fa-solid"); icon.classList.add("fa-regular"); }
      showToast("Removed from your wishlist");
    } else {
      list.push(product);
      btn.classList.add("active");
      const icon = btn.querySelector("i");
      if (icon) { icon.classList.remove("fa-regular"); icon.classList.add("fa-solid"); }
      showToast("Saved to your wishlist");
    }
    saveWishlist(list);
  }

  document.querySelectorAll(".product-wish").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest(".product-card");
      if (!card) return;
      const bagBtn = card.querySelector(".add-bag-btn");
      const product = {
        id: bagBtn ? bagBtn.dataset.id : "",
        name: bagBtn ? bagBtn.dataset.name : card.querySelector(".product-name")?.textContent || "",
        brand: bagBtn ? bagBtn.dataset.brand : card.querySelector(".product-brand")?.textContent || "",
        price: bagBtn ? Number(bagBtn.dataset.price) : 0,
        oldPrice: bagBtn ? Number(bagBtn.dataset.oldprice || 0) : 0,
        cat: bagBtn ? bagBtn.dataset.cat : "",
      };
      toggleWishlist(product, btn);
    });
  });

  /* Restore wishlist active states on page load */
  (function restoreWishlist() {
    const list = getWishlist();
    if (!list.length) return;
    document.querySelectorAll(".product-wish").forEach((btn) => {
      const card = btn.closest(".product-card");
      if (!card) return;
      const bagBtn = card.querySelector(".add-bag-btn");
      const id = bagBtn ? bagBtn.dataset.id : "";
      if (list.some((i) => i.id === id)) {
        btn.classList.add("active");
        const icon = btn.querySelector("i");
        if (icon) { icon.classList.remove("fa-regular"); icon.classList.add("fa-solid"); }
      }
    });
  })();

  updateWishCount();

  /* ---------- Toast ---------- */
  function showToast(msg) {
    let toast = document.getElementById("globalToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.id = "globalToast";
      toast.innerHTML = '<i class="fa-solid fa-circle-check"></i><span id="toastMsg"></span>';
      document.body.appendChild(toast);
    }
    toast.querySelector("#toastMsg").textContent = msg;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  window.StackleyToast = showToast;

  updateBagCount();

  /* =========================================================
     BAG PAGE RENDER
     ========================================================= */
  const bagListEl = document.getElementById("bagList");
  if (bagListEl) {
    renderBagPage();
  }

  function catIcon(cat) {
    const icons = {
      lipstick: "fa-solid fa-pen-fancy",
      serum: "fa-solid fa-flask",
      palette: "fa-solid fa-palette",
      perfume: "fa-solid fa-spray-can-sparkles",
      cream: "fa-solid fa-jar",
      brush: "fa-solid fa-paintbrush",
      hair: "fa-solid fa-droplet",
    };
    return icons[cat] || "fa-solid fa-gift";
  }

  function renderBagPage() {
    const cart = getCart();
    const emptyEl = document.getElementById("bagEmpty");
    const layoutEl = document.getElementById("bagLayout");

    if (cart.length === 0) {
      if (emptyEl) emptyEl.style.display = "block";
      if (layoutEl) layoutEl.style.display = "none";
      return;
    }
    if (emptyEl) emptyEl.style.display = "none";
    if (layoutEl) layoutEl.style.display = "grid";

    bagListEl.innerHTML = cart
      .map(
        (item) => `
      <div class="bag-item reveal in-view" data-id="${item.id}">
        <div class="bag-item-media"><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--wine);font-size:30px;"><i class="${catIcon(item.cat)}"></i></div></div>
        <div>
          <div class="bag-item-brand">${item.brand}</div>
          <div class="bag-item-name">${item.name}</div>
          <div class="qty-control">
            <button class="qty-minus" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
            <span>${item.qty}</span>
            <button class="qty-plus" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
          </div>
          <div class="bag-item-remove"><i class="fa-solid fa-trash-can"></i> Remove</div>
        </div>
        <div class="bag-item-price">₹${(item.price * item.qty).toLocaleString("en-IN")}</div>
      </div>`
      )
      .join("");

    bagListEl.querySelectorAll(".bag-item").forEach((row) => {
      const id = row.dataset.id;
      row.querySelector(".qty-plus").addEventListener("click", () => changeQty(id, 1));
      row.querySelector(".qty-minus").addEventListener("click", () => changeQty(id, -1));
      row.querySelector(".bag-item-remove").addEventListener("click", () => removeItem(id));
    });

    updateSummary(cart);
  }

  function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      saveCart(cart.filter((i) => i.id !== id));
    } else {
      saveCart(cart);
    }
    renderBagPage();
  }
  function removeItem(id) {
    const cart = getCart().filter((i) => i.id !== id);
    saveCart(cart);
    showToast("Item removed from bag");
    renderBagPage();
  }

  function updateSummary(cart) {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const mrpTotal = cart.reduce((s, i) => s + (i.oldPrice || i.price) * i.qty, 0);
    const discount = Math.max(mrpTotal - subtotal, 0);
    const shipping = subtotal > 0 && subtotal < 999 ? 49 : 0;
    const total = subtotal + shipping;

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set("sumItems", cart.reduce((s, i) => s + i.qty, 0));
    set("sumSubtotal", "₹" + subtotal.toLocaleString("en-IN"));
    set("sumDiscount", "-₹" + discount.toLocaleString("en-IN"));
    set("sumShipping", shipping === 0 ? "FREE" : "₹" + shipping);
    set("sumTotal", "₹" + total.toLocaleString("en-IN"));
  }

  /* Checkout -> 404 (as requested) */
  document.getElementById("checkoutBtn")?.addEventListener("click", () => {
    window.location.href = "404.html";
  });

  /* Social icons -> 404 */
  document.querySelectorAll(".footer-social a, .social-link-404").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "404.html";
    });
  });

  /* =========================================================
     LOGIN PAGE
     ========================================================= */
  const roleUserBtn = document.getElementById("roleUser");
  const roleAdminBtn = document.getElementById("roleAdmin");
  const loginForm = document.getElementById("loginForm");
  let selectedRole = "user";

  if (roleUserBtn && roleAdminBtn) {
    roleUserBtn.addEventListener("click", () => setRole("user"));
    roleAdminBtn.addEventListener("click", () => setRole("admin"));
  }
  function setRole(role) {
    selectedRole = role;
    roleUserBtn.classList.toggle("active", role === "user");
    roleAdminBtn.classList.toggle("active", role === "admin");
  }

  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    const errBox = document.getElementById("loginError");

    if (!email || !pass) {
      errBox.textContent = "Please enter both email and password to continue.";
      errBox.classList.add("show");
      return;
    }
    errBox.classList.remove("show");
    localStorage.setItem("stackly_user_email", email);
    localStorage.setItem("stackly_role", selectedRole);

    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';

    setTimeout(() => {
      window.location.href = selectedRole === "admin" ? "dashboard-admin.html" : "dashboard-user.html";
    }, 700);
  });

  /* Guest quick access buttons on dashboards page (optional demo links already routed via login) */

  /* ---------- Dashboard mobile sidebar (handled above) ---------- */

  /* ---------- Animate stat progress bars ---------- */
  document.querySelectorAll(".progress-bar > div").forEach((bar) => {
    const target = bar.dataset.width || "0%";
    setTimeout(() => (bar.style.width = target), 300);
  });

  /* ---------- Countdown timer (deal strip) ---------- */
  const countdownEls = {
    h: document.getElementById("cdHours"),
    m: document.getElementById("cdMins"),
    s: document.getElementById("cdSecs"),
  };
  if (countdownEls.h) {
    let totalSeconds = 6 * 3600 + 45 * 60 + 12;
    setInterval(() => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const s = String(totalSeconds % 60).padStart(2, "0");
      countdownEls.h.textContent = h;
      countdownEls.m.textContent = m;
      countdownEls.s.textContent = s;
    }, 1000);
  }

  /* ---------- Filter chips ---------- */
  document.querySelectorAll(".filter-chips").forEach((group) => {
    const section = group.closest(".section, .section-tight");
    group.querySelectorAll(".chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        group.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const filter = (chip.dataset.filter || chip.textContent.trim()).toLowerCase();
        const grid = section ? section.querySelector(".grid") : null;
        if (!grid) return;
        grid.querySelectorAll(".product-card").forEach((card) => {
          const cat = (card.getAttribute("data-cat") || card.getAttribute("data-category") || "").toLowerCase();
          if (filter === "all" || cat === filter) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
        if (filter === "all") {
          grid.style.display = "";
          grid.style.justifyContent = "";
          grid.style.gap = "";
          grid.querySelectorAll(".product-card").forEach(c => c.style.width = "");
        } else {
          grid.style.display = "flex";
          grid.style.flexWrap = "wrap";
          grid.style.justifyContent = "center";
          var cardW = window.innerWidth <= 560 ? "calc(50% - 4px)" : window.innerWidth <= 980 ? "calc(50% - 7px)" : "calc(25% - 19.5px)";
          var gapVal = window.innerWidth <= 560 ? "8px" : "26px";
          grid.style.gap = gapVal;
          grid.querySelectorAll(".product-card").forEach(c => c.style.width = cardW);
        }
      });
    });
  });

  /* ---------- Newsletter form ---------- */
  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = form.querySelector("input[type='email']");
      const value = (email ? email.value : "").trim();
      if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(value)) {
        alert("Only Gmail addresses are allowed. Please enter a valid Gmail address.");
        if (email) email.focus();
        return;
      }
      window.location.href = "404.html";
    });
  });

  /* ---------- Dashboard toggle switches ---------- */
  document.querySelectorAll(".dash-toggle").forEach(function(toggle) {
    toggle.addEventListener("click", function() {
      var isOn = toggle.style.background === "var(--success)" || toggle.getAttribute("data-state") === "on";
      if (isOn) {
        toggle.style.background = "var(--ivory-2)";
        toggle.firstElementChild.style.right = "auto";
        toggle.firstElementChild.style.left = "2px";
        toggle.setAttribute("data-state", "off");
      } else {
        toggle.style.background = "var(--success)";
        toggle.firstElementChild.style.left = "auto";
        toggle.firstElementChild.style.right = "2px";
        toggle.setAttribute("data-state", "on");
      }
    });
  });

  /* ---------- Set active nav link based on current page ---------- */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a, .drawer-nav a").forEach((a) => {
    if (a.getAttribute("href") === path) a.classList.add("active");
  });
})();
