import { App } from "@/app";
import { Gui } from "@/game/services/gui/guiService";
import { MScene } from "@/game/services/scene/sceneService";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";

export class MainHudGui extends Gui {
  ui: AdvancedDynamicTexture;
  pauseButton: Button;
  resumeButton: Button;
  quitButton: Button;
  pauseMenu: Rectangle;

  constructor(scene: MScene) {
    super(scene);
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    this.ui.idealHeight = 720;
    this.pauseMenu = new Rectangle();
    this.resumeButton = Button.CreateSimpleButton("resume", "RESUME");
    this.quitButton = Button.CreateSimpleButton("quit", "QUIT");

    const stackPanel = new StackPanel();
    stackPanel.height = "100%";
    stackPanel.width = "100%";
    stackPanel.top = "14px";
    stackPanel.verticalAlignment = 0;
    this.ui.addControl(stackPanel);

    const pauseButton = Button.CreateImageOnlyButton("pauseBtn", "./sprites/pauseBtn.png");
    pauseButton.width = "48px";
    pauseButton.height = "86px";
    pauseButton.thickness = 0;
    pauseButton.verticalAlignment = 0;
    pauseButton.horizontalAlignment = 1;
    pauseButton.top = "-16px";
    this.ui.addControl(pauseButton);
    pauseButton.zIndex = 10;
    this.pauseButton = pauseButton;

    pauseButton.onPointerDownObservable.add(() => {
      if (!this.pauseMenu) {
        return;
      }

      this.pauseMenu.isVisible = true;
      this.ui.addControl(this.pauseMenu);
      this.pauseButton.isHitTestVisible = false;
      this.scene.paused = true;
    });

    this.createPauseMenu();
  }

  createPauseMenu() {
    this.scene.paused = false;

    this.pauseMenu.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    this.pauseMenu.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    this.pauseMenu.height = 0.8;
    this.pauseMenu.width = 0.5;
    this.pauseMenu.thickness = 0;
    this.pauseMenu.isVisible = false;

    //background image
    // const image = new Image("pause", "sprites/pause.jpeg");
    // pauseMenu.addControl(image);

    //stack panel for the buttons
    const stackPanel = new StackPanel();
    stackPanel.width = .83;
    this.pauseMenu.addControl(stackPanel);

    this.resumeButton.width = 0.18;
    this.resumeButton.height = "44px";
    this.resumeButton.color = "white";
    this.resumeButton.fontFamily = "Viga";
    this.resumeButton.paddingBottom = "14px";
    this.resumeButton.cornerRadius = 14;
    this.resumeButton.fontSize = "12px";
    if (this.resumeButton.textBlock) this.resumeButton.textBlock.resizeToFit = true;
    this.resumeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.resumeButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    stackPanel.addControl(this.resumeButton);

    //when the button is down, make menu invisable and remove control of the menu
    this.resumeButton.onPointerDownObservable.add(() => {
      this.pauseMenu.isVisible = false;
      this.ui.removeControl(this.pauseMenu);
      this.pauseMenu.isHitTestVisible = true;

      this.scene.paused = false;
    });

    this.quitButton.width = 0.18;
    this.quitButton.height = "44px";
    this.quitButton.color = "white";
    this.quitButton.fontFamily = "Viga";
    this.quitButton.paddingBottom = "12px";
    this.quitButton.cornerRadius = 14;
    this.quitButton.fontSize = "12px";
    if (this.resumeButton.textBlock) this.resumeButton.textBlock.resizeToFit = true;
    this.quitButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this.quitButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    stackPanel.addControl(this.quitButton);
  }
}
