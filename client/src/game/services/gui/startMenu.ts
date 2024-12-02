import { App } from "@/app";
import { Gui } from "@/game/services/gui/guiService";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";

export class StartMenu implements Gui {
  setup(app: App) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720; //fit our fullscreen ui to this height

    const startBtn = Button.CreateSimpleButton("start", "PLAY");
    startBtn.width = 0.2;
    startBtn.height = "40px";
    startBtn.color = "white";
    startBtn.top = "-14px";
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(startBtn);

    startBtn.onPointerDownObservable.add(() => {
      app.goToGame();
      app.detatchSceneControl();
  });
  }
}
