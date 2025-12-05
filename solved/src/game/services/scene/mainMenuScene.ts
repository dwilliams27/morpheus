import { App } from "@/app";
import { Flatgrass } from "@/game/environments/flatgrass";
import { GuiService } from "@/game/services/gui/guiService";
import { StartMenuGui } from "@/game/services/gui/startMenu";
import { MScene } from "@/game/services/scene/sceneService";
import { Color4 } from "@babylonjs/core";

export const MAIN_MENU_SCENE = 'MAIN_MENU_SCENE';

export class MainMenuScene extends MScene {
  constructor(app: App) {
    super(MAIN_MENU_SCENE, app);
  }

  async loadEnvironment() {
    const env = new Flatgrass([], this);
    await env.load();
  }

  getGui() {
    return new StartMenuGui(this);
  }

  async loadScene() {
    this.clearColor = new Color4(0, 0, 0, 1);

    this.serviceLocator.getService(GuiService).setGui(this.gui);

    await this.whenReadyAsync();
  }
}
