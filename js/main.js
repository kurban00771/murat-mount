/* ========================================================================
   1. ЯНДЕКС.МЕТРИКА И ЗАЩИЩЁННЫЕ КОНТАКТЫ
   ======================================================================== */
const METRIKA_ID = 114121882;

function sendGoal(goalName) {
  if (typeof ym === "function") {
    ym(METRIKA_ID, "reachGoal", goalName);
  }
}

const waLinks = document.querySelectorAll(".protected-wa");
if (waLinks.length > 0) {
  const decodedWa = atob("aHR0cHM6Ly93YS5tZS83OTI4ODIyNDA0OQ==");
  waLinks.forEach((link) => {
    link.href = decodedWa;
    link.addEventListener("click", () => {
      sendGoal("click_whatsapp");
    });
  });
}

const maxLinks = document.querySelectorAll(".protected-max");
if (maxLinks.length > 0) {
  const decodedMax = atob(
    "aHR0cHM6Ly9tYXgucnUvdS9mOUxIb2REMGNPTGhRR1BSOHdycy1vOXZSZk1ySVpoaGJOd3hfbWxsRTdBVlY5MGZ3Yk81OE5WZ1ZJbw=="
  );
  maxLinks.forEach((link) => {
    link.href = decodedMax;
    link.addEventListener("click", () => {
      sendGoal("click_max");
    });
  });
}

const phoneLinks = document.querySelectorAll(".protected-phone");
if (phoneLinks.length > 0) {
  const decodedPhoneLink = atob("Kzc5Mjg4MjI0MDQ5");
  const decodedPhoneText = atob("KzcgKDkyOCkgODIyIDQwIDQ5");

  phoneLinks.forEach((phoneLink) => {
    phoneLink.href = "tel:" + decodedPhoneLink;

    if (phoneLink.textContent.trim() === "Показать телефон") {
      phoneLink.textContent = decodedPhoneText;
    }

    phoneLink.addEventListener("click", () => {
      sendGoal("click_phone");
    });
  });
}

/* ========================================================================
   2. УМНОЕ СКРЫТИЕ / ПОКАЗ ШАПКИ НА МОБИЛЬНЫХ (<= 980px)
   ======================================================================== */
const header = document.querySelector(".header");
const menuBtn = document.querySelector(".menu__btn");
const menu = document.querySelector(".menu__list");

const mobileQuery = window.matchMedia("(max-width: 980px)");
const HIDE_THRESHOLD = 16;
const SHOW_THRESHOLD = 24;

let lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
let accumulatedDelta = 0;
let isHeaderHidden = false;
let ticking = false;

function showHeader() {
  if (!header || !isHeaderHidden) return;
  header.classList.remove("header--hidden");
  isHeaderHidden = false;
}

function hideHeader() {
  if (!header || isHeaderHidden) return;
  header.classList.add("header--hidden");
  isHeaderHidden = true;
}

function syncScrollState() {
  lastScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
  accumulatedDelta = 0;
}

function handleHeaderScroll() {
  ticking = false;

  if (!header) return;

  if (menu && menu.classList.contains("menu--active")) {
    showHeader();
    syncScrollState();
    return;
  }

  if (!mobileQuery.matches) {
    showHeader();
    syncScrollState();
    return;
  }

  const rawScrollY = window.scrollY || window.pageYOffset || 0;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const topOffset = Math.max(80, header.offsetHeight + 16);

  // Защита от верхнего rubber-band отскока и зоны у верха страницы
  if (rawScrollY <= topOffset || maxScroll <= topOffset) {
    showHeader();
    lastScrollY = Math.max(0, rawScrollY);
    accumulatedDelta = 0;
    return;
  }

  // Защита от нижнего rubber-band отскока на iOS
  if (rawScrollY >= maxScroll - 12) {
    lastScrollY = Math.min(rawScrollY, maxScroll);
    accumulatedDelta = 0;
    return;
  }

  const delta = rawScrollY - lastScrollY;
  lastScrollY = rawScrollY;

  if (delta === 0) return;

  // Сброс накопленной дельты при смене направления прокрутки
  if (
    (delta > 0 && accumulatedDelta < 0) ||
    (delta < 0 && accumulatedDelta > 0)
  ) {
    accumulatedDelta = 0;
  }

  accumulatedDelta += delta;

  if (accumulatedDelta > HIDE_THRESHOLD && !isHeaderHidden) {
    hideHeader();
    accumulatedDelta = 0;
  } else if (accumulatedDelta < -SHOW_THRESHOLD && isHeaderHidden) {
    showHeader();
    accumulatedDelta = 0;
  }
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(handleHeaderScroll);
      ticking = true;
    }
  },
  { passive: true }
);

/* ========================================================================
   3. МОБИЛЬНОЕ МЕНЮ И ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
   ======================================================================== */
function closeMenu() {
  if (!menu || !menuBtn) return;
  menu.classList.remove("menu--active");
  menuBtn.classList.remove("menu__btn--active");
  document.body.classList.remove("no-scroll");
  if (header) header.classList.remove("header--menu-open");
  syncScrollState();
}

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const isOpening = !menu.classList.contains("menu--active");

    menu.classList.toggle("menu--active", isOpening);
    menuBtn.classList.toggle("menu__btn--active", isOpening);
    document.body.classList.toggle("no-scroll", isOpening);

    if (header) {
      header.classList.toggle("header--menu-open", isOpening);
      if (isOpening) showHeader();
    }

    if (!isOpening) {
      syncScrollState();
    }
  });
}

document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    const wasMenuOpen = Boolean(menu && menu.classList.contains("menu--active"));

    if (wasMenuOpen) {
      closeMenu();
    }

    const scrollToTarget = () => {
      if (targetId === "#top") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        const target = document.querySelector(targetId);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    };

    if (wasMenuOpen) {
      window.requestAnimationFrame(scrollToTarget);
    } else {
      scrollToTarget();
    }
  });
});

const onBreakpointChange = (e) => {
  if (!e.matches) {
    showHeader();
    if (menu && menu.classList.contains("menu--active")) {
      closeMenu();
    }
  }
  syncScrollState();
};

if (typeof mobileQuery.addEventListener === "function") {
  mobileQuery.addEventListener("change", onBreakpointChange);
} else if (typeof mobileQuery.addListener === "function") {
  mobileQuery.addListener(onBreakpointChange);
}

/* ========================================================================
   4. УВЕДОМЛЕНИЕ О COOKIE
   ======================================================================== */
(function () {
  const COOKIE_NAME = "murat_cookie_accepted";
  const COOKIE_DAYS = 365;

  const getCookie = (name) => {
    const matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  };

  const setCookieSeconds = (name, value, maxAgeSeconds) => {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
      value
    )}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;

    if (window.location.protocol === "https:") {
      cookieString += "; Secure";
    }

    document.cookie = cookieString;
  };

  const savedValue = getCookie(COOKIE_NAME);

  if (savedValue) {
    const now = Date.now();
    const expiryTime =
      savedValue === "true"
        ? now + COOKIE_DAYS * 24 * 60 * 60 * 1000
        : Number(savedValue);

    const remainingSeconds = Math.floor((expiryTime - now) / 1000);

    if (remainingSeconds > 0) {
      setCookieSeconds(COOKIE_NAME, String(expiryTime), remainingSeconds);
      return;
    }
  }

  const cookieBanner = document.createElement("div");
  cookieBanner.className = "cookie-notice";
  cookieBanner.setAttribute("role", "region");
  cookieBanner.setAttribute("aria-label", "Уведомление об использовании cookie");
  cookieBanner.innerHTML = `
      <p class="cookie-notice__text">
          Мы используем файлы cookie для удобства работы сайта и аналитики.
      </p>
      <button type="button" class="cookie-notice__btn">Соглашаюсь</button>
  `;
  document.body.appendChild(cookieBanner);

  let isVisible = false;
  let timerId = null;

  const showBanner = () => {
    if (isVisible) return;
    isVisible = true;
    cookieBanner.classList.add("cookie-notice--visible");
    window.removeEventListener("scroll", onScrollTrigger);
    if (timerId) clearTimeout(timerId);
  };

  const onScrollTrigger = () => {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 180) {
      showBanner();
    }
  };

  window.addEventListener("scroll", onScrollTrigger, { passive: true });
  timerId = setTimeout(showBanner, 3500);

  const acceptBtn = cookieBanner.querySelector(".cookie-notice__btn");
  acceptBtn.addEventListener("click", () => {
    const totalSeconds = COOKIE_DAYS * 24 * 60 * 60;
    const expiryTime = Date.now() + totalSeconds * 1000;

    setCookieSeconds(COOKIE_NAME, String(expiryTime), totalSeconds);

    try {
      localStorage.removeItem(COOKIE_NAME);
    } catch (e) {}

    cookieBanner.classList.remove("cookie-notice--visible");
    setTimeout(() => {
      cookieBanner.remove();
    }, 450);
  });
})();