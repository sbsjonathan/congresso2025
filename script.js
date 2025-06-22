document.addEventListener("DOMContentLoaded", () => {
  // —————— Debounce ——————
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // —————— 0. Última página ——————
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {
    const last = localStorage.getItem("lastPage");
    if (last && last !== window.location.pathname) {
      window.location.href = last;
      return;
    }
  } else {
    localStorage.setItem("lastPage", window.location.pathname);
  }

  // —————— 1. Cor de destaque por dia ——————
  const dia = document.body.dataset.dia || "default";
  const COLOR_KEY = `highlightColor_${dia}`;
  const colorPicker = document.getElementById("color-picker");
  function applyColor(c) {
    document.documentElement.style.setProperty("--highlight-color", c);
    if (colorPicker) colorPicker.value = c;
  }
  applyColor(localStorage.getItem(COLOR_KEY) || "#000000");
  if (colorPicker) {
    colorPicker.addEventListener("input", e => {
      applyColor(e.target.value);
      localStorage.setItem(COLOR_KEY, e.target.value);
    });
  }

  // —————— 2. Fonte (18–38px) ——————
  const btnDec = document.getElementById("font-decrease");
  const btnInc = document.getElementById("font-increase");
  const FONT_KEY = "tamanho-topico";
  const MIN_F = 18, MAX_F = 38;
  function setFont(px) {
    document.documentElement.style.setProperty("--tamanho-topico", px + "px");
    localStorage.setItem(FONT_KEY, px);
  }
  let curF = parseInt(localStorage.getItem(FONT_KEY), 10);
  if (isNaN(curF)) curF = MIN_F;
  setFont(curF);
  btnDec?.addEventListener("click", () => { if (curF > MIN_F) setFont(--curF); });
  btnInc?.addEventListener("click", () => { if (curF < MAX_F) setFont(++curF); });

  // —————— 3. Menu ocultável ——————
  const toggleMenu = document.getElementById("toggle-menu");
  const menuCont = document.getElementById("menu-container");
  function closeAllTextareas() {
    document.querySelectorAll("textarea").forEach(ta => {
      ta.style.display = "none";
    });
  }
  toggleMenu?.addEventListener("click", () => {
    menuCont?.classList.toggle("menu-visible");
    if (!menuCont?.classList.contains("menu-visible")) closeAllTextareas();
  });

  // —————— 4. Auto-resize e Toggle de Textareas (sem foco) ——————
  function autoResize(ta) {
    ta.style.height = "auto";
    ta.style.height = ta.scrollHeight + "px";
    // garantir pelo menos duas linhas
    const lh = parseInt(getComputedStyle(ta).lineHeight, 10);
    const minH = lh * 2;
    if (ta.clientHeight < minH) ta.style.height = minH + "px";
  }

  // inicializa todas escondidas
  document.querySelectorAll("textarea").forEach(ta => {
    ta.value = localStorage.getItem(ta.id) || "";
    ta.style.display = "none";
    ta.addEventListener("input", debounce(function () {
      localStorage.setItem(this.id, this.value);
      autoResize(this);
    }, 300));
  });

  // toggle sem foco
  document.querySelectorAll(".clickable").forEach(el => {
    el.addEventListener("click", () => {
      const ta = document.getElementById(el.dataset.textarea);
      if (!ta) return;
      const hidden = getComputedStyle(ta).display === "none";
      if (hidden) {
        ta.style.display = "block";
        autoResize(ta);
        // removido: ta.focus();
      } else {
        ta.style.display = "none";
      }
    });
  });

  // —————— 5. Limpar cache ——————
  document.getElementById("clear-cache")?.addEventListener("click", () => {
    localStorage.clear();
    location.reload();
  });

  // —————— 6. Destacar horário da agenda ——————
  function highlightTime() {
    const now = new Date();
    const total = now.getHours() * 60 + now.getMinutes();
    const items = Array.from(document.querySelectorAll("strong"))
      .filter(el => /^\d{2}:\d{2}/.test(el.textContent))
      .map(el => {
        const [h, m] = el.textContent.split(":").map(Number);
        return { el, total: h * 60 + m };
      });
    items.forEach(({ el }) => {
      el.classList.remove("ativo");
      el.closest("li")?.classList.remove("ativo-line");
    });
    for (let i = 0; i < items.length; i++) {
      const next = items[i + 1];
      if (total >= items[i].total && (!next || total < next.total)) {
        items[i].el.classList.add("ativo");
        items[i].el.closest("li")?.classList.add("ativo-line");
        break;
      }
    }
  }
  highlightTime();
  setInterval(highlightTime, 60 * 1000);
});

// ====  
// 7. Duplo clique no banner volta ao home  
// ====  
const banner = document.querySelector(".banner-topo");
if (banner) {
  banner.addEventListener("dblclick", () => {
    window.location.href = "index.html";
  });
}