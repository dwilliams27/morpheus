import { App } from "@/app";
import { MScene } from "@/game/services/scene/sceneService";
import { LocatableService, ServiceLocator } from "@/game/services/serviceLocator";

export const GUI_SERVICE_NAME = 'GUI_SERVICE';

export class Gui {
  scene: MScene;
  constructor(scene: MScene) {
    this.scene = scene;
  };
}

export class GuiService extends LocatableService {
  static readonly serviceName = GUI_SERVICE_NAME;
  private _currentGui?: Gui;
  
  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator);
  }

  setGui(gui: Gui) {
    this._currentGui = gui;
  }

  getGui() {
    return this._currentGui;
  }
}
