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
  const decodedMax = atob("aHR0cHM6Ly9tYXgucnUvdS9mOUxIb2REMGNPTGhRR1BSOHdycy1vOXZSZk1ySVpoaGJOd3hfbWxsRTdBVlY5MGZ3Yk81OE5WZ1ZJbw==");
  maxLinks.forEach((link) => {
    link.href = decodedMax;
    link.addEventListener("click", () => {
      sendGoal("click_max");
    });
  });
}

const phoneLinks = document.querySelectorAll(".protected-phone");
if (phoneLinks.length > 0) {
  phoneLinks.forEach(function (phoneLink) {
    const decodedPhoneLink = atob("Kzc5Mjg4MjI0MDQ5");

    phoneLink.href = "tel:" + decodedPhoneLink;

    if (phoneLink.textContent.trim() === "Показать телефон") {
      const decodedPhoneText = atob("KzcgKDkyOCkgODIyIDQwIDQ5");
      phoneLink.textContent = decodedPhoneText;
    }

    phoneLink.addEventListener("click", () => {
      sendGoal("click_phone");
    });
  });
}

const menuBtn = document.querySelector(".menu__btn");
const menu = document.querySelector(".menu__list");

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("menu--active");
    menuBtn.classList.toggle("menu__btn--active");
    document.body.classList.toggle("no-scroll");
  });

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");

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

      if (menu.classList.contains("menu--active")) {
        menu.classList.remove("menu--active");
        menuBtn.classList.remove("menu__btn--active");
        document.body.classList.remove("no-scroll");
      }
    });
  });
}

let lastScrollY = window.scrollY;
const header = document.querySelector(".header");
const threshold = 10;
let ticking = false;

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (menu && menu.classList.contains("menu--active")) {
          ticking = false;
          return;
        }

        if (window.innerWidth > 980) {
          if (header) header.classList.remove("header--hidden");
          lastScrollY = currentScrollY;
          ticking = false;
          return;
        }

        if (currentScrollY <= 80) {
          if (header) header.classList.remove("header--hidden");
          lastScrollY = currentScrollY;
          ticking = false;
          return;
        }

        if (Math.abs(currentScrollY - lastScrollY) <= threshold) {
          ticking = false;
          return;
        }

        if (currentScrollY > lastScrollY) {
          if (header) header.classList.add("header--hidden");
        } else {
          if (header) header.classList.remove("header--hidden");
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });

      ticking = true;
    }
  },
  { passive: true }
);

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
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;

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
    } catch (e) { }

    cookieBanner.classList.remove("cookie-notice--visible");
    setTimeout(() => {
      cookieBanner.remove();
    }, 450);
  });
})();
