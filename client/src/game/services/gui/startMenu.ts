import { App } from "@/app";
import { Gui } from "@/game/services/gui/guiService";
import { MAIN_GAME_SCENE, MainGameScene } from "@/game/services/scene/mainGameScene";
import { MScene, SceneService } from "@/game/services/scene/sceneService";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";

export class StartMenuGui extends Gui {
  startButton: Button;
  quitButton: Button;

  constructor(scene: MScene) {
    super(scene);

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    this.startButton = Button.CreateSimpleButton("start", "PLAY");
    this.startButton.width = 0.2;
    this.startButton.height = "40px";
    this.startButton.color = "white";
    this.startButton.top = "-54px";
    this.startButton.thickness = 0;
    this.startButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(this.startButton);

    this.quitButton = Button.CreateSimpleButton("start", "QUIT");
    this.quitButton.width = 0.2;
    this.quitButton.height = "40px";
    this.quitButton.color = "white";
    this.quitButton.top = "-14px";
    this.quitButton.thickness = 0;
    this.quitButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(this.quitButton);

    this.startButton.onPointerDownObservable.add(() => {
      const sceneService = this.scene.serviceLocator.getService(SceneService);
      sceneService.setActiveScene(sceneService.getScene(MAIN_GAME_SCENE));
    });
  }
}
