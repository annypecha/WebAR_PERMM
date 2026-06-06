export class DataStore {
  setConfig(cfg) {
    this.cfg      = cfg;
    this.exhibits = cfg.exhibits || [];
  }

  getMode() {
    // MindAR работает только с image tracking
    return "image";
  }

  getDefaultExhibitId() {
    return this.cfg?.app?.defaultExhibitId || (this.exhibits[0]?.id ?? null);
  }

  getExhibitById(id) {
    return this.exhibits.find(x => x.id === id) || null;
  }

  /**
   * Поиск по targetIndex (индекс изображения в .mind-файле).
   */
  getExhibitByTargetIndex(idx) {
    return this.exhibits.find(x => x.targetIndex === idx) || null;
  }

  /**
   * Возвращает полный массив экспонатов.
   */
  getAllExhibits() {
    return this.exhibits;
  }
}
