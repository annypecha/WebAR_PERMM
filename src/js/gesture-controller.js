export class GestureController {
  constructor(modelManager) {
    this.models = modelManager;
    this.bound = false;

    this.lastTouchDist = null;
    this.lastTouchPos = null;
    this.cfg = null;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove  = this.onTouchMove.bind(this);
    this.onTouchEnd   = this.onTouchEnd.bind(this);
  }

  bind(exhibit) {
    this.cfg = exhibit.interaction || {};
    if (this.bound) return;

    document.body.addEventListener("touchstart", this.onTouchStart, { passive: false });
    document.body.addEventListener("touchmove",  this.onTouchMove,  { passive: false });
    document.body.addEventListener("touchend",   this.onTouchEnd);

    this.bound = true;
  }

  onTouchStart(e) {
    const ent = this.models.getActiveEntity();
    if (!ent) return;

    if (e.touches.length === 1) {
      this.lastTouchPos  = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      this.lastTouchDist = null;
    } else if (e.touches.length === 2) {
      this.lastTouchDist = this.getTouchDist(e.touches[0], e.touches[1]);
      this.lastTouchPos  = null;
    }
  }

  onTouchMove(e) {
    const ent = this.models.getActiveEntity();
    if (!ent) return;

    e.preventDefault();

    // ── Вращение (один палец) ──────────────────────────────────────
    if (e.touches.length === 1 && this.lastTouchPos) {
      const allowRot = this.cfg.allowRotation !== false; // default true
      if (allowRot) {
        const cur   = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        const dx    = cur.x - this.lastTouchPos.x;
        const speed = this.cfg.rotationSpeed ?? 0.35;
        const rot   = ent.getAttribute("rotation");
        ent.setAttribute("rotation", `${rot.x} ${rot.y + dx * speed} ${rot.z}`);
        this.lastTouchPos = cur;
      }
    }

    // ── Масштаб (щипок двумя пальцами) ────────────────────────────
    if (e.touches.length === 2 && this.lastTouchDist != null) {
      const allowScale = this.cfg.allowScale !== false; // default true
      if (allowScale) {
        const dist  = this.getTouchDist(e.touches[0], e.touches[1]);
        const delta = dist - this.lastTouchDist;

        const pinchSpeed = this.cfg.pinchSpeed ?? 0.008;
        const minS       = this.cfg.minScale   ?? 0.3;
        const maxS       = this.cfg.maxScale   ?? 2.2;

        const scale = ent.getAttribute("scale");
        let next    = scale.x + delta * pinchSpeed;
        next        = Math.max(minS, Math.min(maxS, next));
        ent.setAttribute("scale", `${next} ${next} ${next}`);

        this.lastTouchDist = dist;
      } else {
        // обновляем дистанцию, чтобы не было «прыжка» при включении
        this.lastTouchDist = this.getTouchDist(e.touches[0], e.touches[1]);
      }
    }
  }

  onTouchEnd() {
    this.lastTouchDist = null;
    this.lastTouchPos  = null;
  }

  getTouchDist(t1, t2) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
