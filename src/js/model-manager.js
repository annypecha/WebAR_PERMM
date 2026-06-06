/**
 * ModelManager — управление группами 3D-моделей.
 * Для каждого экспоната в index.html создается <a-entity id="model-group-...">.
 * Это позволяет одинаково управлять одиночной моделью и сценой из нескольких объектов.
 */
export class ModelManager {

  init({ exhibits }) {
    this.entityMap = new Map();
    this.activeEntity = null;
    this.activeExhibit = null;

    exhibits.forEach((exhibit) => {
      const group = document.querySelector(`#model-group-${exhibit.id}`);
      if (group) this.entityMap.set(exhibit.id, group);
    });
  }

  showExhibit(exhibit) {
    this.hideActive();
    const ent = this.entityMap.get(exhibit.id);
    if (!ent) return;
    ent.setAttribute("visible", "true");
    this.activeEntity = ent;
    this.activeExhibit = exhibit;
    this.applyTransform(ent, exhibit.defaultTransform);
  }

  hideActive() {
    this.activeEntity = null;
    this.activeExhibit = null;
  }

  resetTransform(exhibit) {
    const ent = this.entityMap.get(exhibit.id);
    if (!ent) return;
    this.applyTransform(ent, exhibit.defaultTransform);
  }

  applyTransform(entity, t) {
    if (!t) return;
    const [px, py, pz] = t.position || [0, 0, 0];
    const [rx, ry, rz] = t.rotation || [0, 0, 0];
    const [sx, sy, sz] = t.scale || [1, 1, 1];
    entity.setAttribute("position", `${px} ${py} ${pz}`);
    entity.setAttribute("rotation", `${rx} ${ry} ${rz}`);
    entity.setAttribute("scale", `${sx} ${sy} ${sz}`);
  }

  getActiveEntity() {
    return this.activeEntity;
  }
}