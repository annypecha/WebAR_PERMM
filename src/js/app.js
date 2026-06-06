import { DataStore }            from "./data-store.js";
import { UIController }         from "./ui-controller.js";
import { ARManager }            from "./ar-manager.js";
import { ModelManager }         from "./model-manager.js";
import { GestureController }    from "./gesture-controller.js";
import { AnimationController }  from "./animation-controller.js";

const AppState = Object.freeze({
  INIT:          "INIT",
  CAMERA_REQUEST:"CAMERA_REQUEST",
  SCANNING:      "SCANNING",
  TARGET_FOUND:  "TARGET_FOUND",
  TARGET_LOST:   "TARGET_LOST",
  ERROR:         "ERROR",
});

export class AppController {
  constructor() {
    this.state = AppState.INIT;

    this.ui       = new UIController();
    this.store    = new DataStore();
    this.ar       = new ARManager();
    this.models   = new ModelManager();
    this.anim     = new AnimationController(this.models);
    this.gestures = new GestureController(this.models);

    this.activeExhibit = null;
  }

  /**
   * Инициализация приложения.
   * @param {Object} config — содержимое exhibits.json, уже загруженное в index.html
   */
  async init(config) {
    try {
      this.setState(AppState.INIT, "Инициализация…");

      // Конфиг уже загружен в index.html, передаём напрямую
      this.store.setConfig(config);

      // UI — кнопки btnInfo и btnAnim могут отсутствовать в текущем HTML
      this.ui.init({
        onInfo:  () => this.ui.toggleInfo(),
        onAnim:  () => this.anim.toggle(),
        onReset: () => this.resetTransform(),
      });

      // ModelManager: корневые entity теперь — каждый target сам содержит модель
      this.models.init({ exhibits: this.store.getAllExhibits() });

      this.setState(AppState.SCANNING, "Наведите камеру на экспонат");
      this.ui.setHint?.("Наведите камеру на экспонат");

      // AR-трекинг (MindAR image targets)
      await this.ar.init({
        exhibits: this.store.getAllExhibits(),
        onTargetFound: (exhibitId) => this.onTargetFound(exhibitId),
        onTargetLost:  (exhibitId) => this.onTargetLost(exhibitId),
      });

    } catch (e) {
      console.error(e);
      this.setState(AppState.ERROR, "Ошибка инициализации.");
      this.ui.setHint?.("Ошибка. Проверьте HTTPS / камеру и консоль.");
    }
  }

  setState(state, statusText) {
    this.state = state;
    this.ui.setStatus?.(state, statusText);
  }

  async onTargetFound(exhibitId) {
    const exhibit = this.store.getExhibitById(exhibitId);
    if (!exhibit) return;

    this.activeExhibit = exhibit;

    this.setState(AppState.TARGET_FOUND, `Найден: ${exhibit.title}`);
    this.ui.showExhibit(exhibit);

    this.models.showExhibit(exhibit);
    this.gestures.bind(exhibit);
    this.anim.bind(exhibit);
  }

  onTargetLost(exhibitId) {
    if (this.state !== AppState.TARGET_FOUND) return;

    this.setState(AppState.TARGET_LOST, "Цель потеряна. Наведите снова.");
    this.ui.setHint?.("Наведите камеру снова.");
    this.models.hideActive();
  }

  resetTransform() {
    if (!this.activeExhibit) return;
    this.models.resetTransform(this.activeExhibit);
  }
}
