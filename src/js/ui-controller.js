/**
 * UIController — управление интерфейсом в стилистике PERMM.
 *
 * Элементы:
 * - #statusPill  — пилюля статуса вверху (розовая точка + текст)
 * - #scanFrame   — рамка-сканер с уголками и бегущей линией
 * - #hintBar     — подсказка внизу ("Наведите камеру…")
 * - #panel       — карточка экспоната (glass-эффект, розовый акцент)
 */
export class UIController {

  init({ onInfo, onAnim, onReset }) {
    this.statusPill = document.getElementById("statusPill");
    this.statusDot  = document.getElementById("statusDot");
    this.statusText = document.getElementById("statusText");
    this.scanFrame  = document.getElementById("scanFrame");
    this.hintBar    = document.getElementById("hintBar");
    this.hintText   = document.getElementById("hintText");
    this.panel      = document.getElementById("panel");
    this.exTitle    = document.getElementById("exTitle");
    this.exDesc     = document.getElementById("exDesc");

    const btnReset = document.getElementById("btnReset");
    if (btnReset) btnReset.addEventListener("click", onReset);
  }

  setStatus(state, text) {
    if (this.statusText) this.statusText.textContent = text;

    if (this.statusPill) {
      this.statusPill.classList.add("visible");
    }

    if (this.statusDot) {
      const color =
        state === "TARGET_FOUND" ? "#E91E78" :
        state === "ERROR"        ? "#fb7185" :
        state === "TARGET_LOST"  ? "rgba(255,255,255,0.4)" :
        "#E91E78";
      this.statusDot.style.background = color;
    }

    // Show/hide scan frame based on state
    if (state === "TARGET_FOUND") {
      this._hideScanUI();
    } else if (state === "SCANNING" || state === "TARGET_LOST") {
      this._showScanUI();
    }
  }

  setHint(text) {
    if (this.hintText) this.hintText.textContent = text;
  }

  showExhibit(exhibit) {
    // Hide hint bar, show exhibit panel
    if (this.hintBar) this.hintBar.classList.remove("visible");

    if (this.panel) {
      if (this.exTitle) this.exTitle.textContent = exhibit.title;
      if (this.exDesc)  this.exDesc.textContent  = exhibit.description || "";

      // Trigger animation
      this.panel.classList.add("visible");
    }
  }

  hideExhibit() {
    if (this.panel) this.panel.classList.remove("visible");
  }

  toggleInfo() {
    // reserved for future use
  }

  _showScanUI() {
    if (this.scanFrame) this.scanFrame.classList.add("visible");
    if (this.hintBar)   this.hintBar.classList.add("visible");
    this.hideExhibit();
  }

  _hideScanUI() {
    if (this.scanFrame) this.scanFrame.classList.remove("visible");
  }
}