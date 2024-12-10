import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine } from "@babylonjs/core";
import { ServiceLocator } from "@/game/services/serviceLocator";
import { GuiService } from "@/game/services/gui/guiService";
import { SceneService } from "@/game/services/scene/sceneService";
import { MAIN_MENU_SCENE, MainMenuScene } from "@/game/services/scene/mainMenuScene";
import { MAIN_GAME_SCENE, MainGameScene } from "@/game/services/scene/mainGameScene";
import { ControlService } from "@/game/services/controlService";

export enum State { START = 0, GAME = 1 }

export class App {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _sceneService: SceneService;
  private _controlService: ControlService;

  private _rootServiceLocator: ServiceLocator;
  private _state: State = 0;

  constructor() {
    this._canvas = this._createCanvas();

    this._engine = new Engine(this._canvas, true);
    this._rootServiceLocator = new ServiceLocator(this);
    this._sceneService = new SceneService(this._rootServiceLocator);
    this._controlService = new ControlService(this._rootServiceLocator);

    this._registerRootServices();

    this._sceneService.addScene(new MainMenuScene(this));
    this._sceneService.addScene(new MainGameScene(this));

    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+I
      try {
        if (ev.shiftKey && ev.ctrlKey && ev.keyCode === 73) {
          if (this._sceneService.getActiveScene().debugLayer.isVisible()) {
            this._sceneService.getActiveScene().debugLayer.hide();
          } else {
            this._sceneService.getActiveScene().debugLayer.show();
          }
        }
      } catch (e) {
        console.error(e);
        // Probably just before active scene is set
      }
      
    });

    this._main();
  }

  private _registerRootServices() {
    this._rootServiceLocator.addService(GuiService, new GuiService(this._rootServiceLocator));
    this._rootServiceLocator.addService(SceneService, this._sceneService);
    this._rootServiceLocator.addService(ControlService, this._controlService);
  }

  private async _main() {
    await this._sceneService.setActiveScene(this._sceneService.getScene(MAIN_MENU_SCENE));

    this._engine.runRenderLoop(() => {
      switch (this._sceneService.getActiveScene().name) {
        case MAIN_MENU_SCENE:
        case MAIN_GAME_SCENE:
          this._sceneService.getActiveScene().render();
          break;
        default: break;
      }
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  private _createCanvas() {
    this._canvas = document.createElement("canvas");
    this._canvas.style.width = "100%";
    this._canvas.style.height = "100%";
    this._canvas.id = "gameCanvas";
    return document.body.appendChild(this._canvas);
  }

  setState(state: number) {
    this._state = state;
  }

  getEngine() {
    return this._engine;
  }

  getCanvas() {
    return this._canvas;
  }

  getRootServiceLocator() {
    return this._rootServiceLocator;
  }

  setLoadingUI(visible: boolean) {
    if (visible) {
      this._engine.displayLoadingUI();
    } else {
      this._engine.hideLoadingUI();
    }
  }
}
new App();
