export class AnimationController {
    constructor(modelManager) {
      this.models = modelManager;
      this.exhibit = null;
      this.isPlaying = false;
    }
  
    bind(exhibit) {
      this.exhibit = exhibit;
      this.isPlaying = false;
  
      // В MVP скелете анимацию включим на следующем шаге
      // через animation-mixer (A-Frame компонент) или через three.js access.
    }
  
    toggle() {
      // заглушка, чтобы UI работал
      this.isPlaying = !this.isPlaying;
      // позже: включать/выключать animation-mixer
    }
  }