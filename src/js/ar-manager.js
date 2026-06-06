/**
 * ARManager — модуль трекинга.
 *
 * Вместо AR.js marker-событий (markerFound / markerLost)
 * используем MindAR image-target события (targetFound / targetLost).
 *
 * MindAR вешает эти события на каждый <a-entity mindar-image-target>.
 * Мы перебираем все target-entity и привязываем коллбэки.
 */
export class ARManager {

  /**
   * @param {Object}   opts
   * @param {Array}    opts.exhibits       — массив экспонатов из конфига
   * @param {Function} opts.onTargetFound  — коллбэк(exhibitId)
   * @param {Function} opts.onTargetLost   — коллбэк(exhibitId)
   */
  async init({ exhibits, onTargetFound, onTargetLost }) {

    exhibits.forEach((exhibit) => {
      // Находим соответствующий DOM-элемент по id, заданному в index.html
      const el = document.querySelector(`#target-${exhibit.id}`);

      if (!el) {
        console.warn(`[ARManager] target-entity не найден для ${exhibit.id}`);
        return;
      }

      el.addEventListener("targetFound", () => {
        console.log(`[ARManager] targetFound → ${exhibit.id}`);
        onTargetFound(exhibit.id);
      });

      el.addEventListener("targetLost", () => {
        console.log(`[ARManager] targetLost → ${exhibit.id}`);
        onTargetLost(exhibit.id);
      });
    });
  }
}