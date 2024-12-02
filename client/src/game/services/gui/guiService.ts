import { App } from "@/app";
import { LocatableService, ServiceLocator } from "@/game/services/serviceLocator";

export const GUI_SERVICE_NAME = 'GUI_SERVICE';

export interface Gui {
  setup: (app: App) => void;
}

export class GuiService extends LocatableService {
  private _app: App;
  private _currentGui?: Gui;
  
  constructor(serviceLocator: ServiceLocator, app: App) {
    super(serviceLocator, GUI_SERVICE_NAME);
    this._app = app;
  }

  setGui(gui: Gui) {
    this._currentGui = gui;
    this._currentGui.setup(this._app);
  }

  getGui() {
    return this._currentGui;
  }
}
