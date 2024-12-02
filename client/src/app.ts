import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Color4, FreeCamera } from "@babylonjs/core";
import { ServiceLocator } from "@/game/services/serviceLocator";
import { GuiService } from "@/game/services/gui/guiService";
import { StartMenu } from "@/game/services/gui/startMenu";

enum State { START = 0, GAME = 1 }

export class App {
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _scene: Scene;

  private _rootServiceLocator: ServiceLocator;
  private _guiService?: GuiService;

  private _state: number = 0;

  constructor() {
    this._canvas = this._createCanvas();

    this._engine = new Engine(this._canvas, true);
    this._scene = new Scene(this._engine);
    this._rootServiceLocator = new ServiceLocator(this);

    this._registerRootServices();

    const camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this._scene);
    camera.attachControl(this._canvas, true);
    const light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this._scene);
    const sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this._scene);

    // hide/show the Inspector
    window.addEventListener("keydown", (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key === 'i') {
        if (this._scene.debugLayer.isVisible()) {
          this._scene.debugLayer.hide();
        } else {
          this._scene.debugLayer.show();
        }
      }
    });

    this._main();
  }

  private _registerRootServices() {
    this._guiService = new GuiService(this._rootServiceLocator, this);
  }

  private async _main() {
    await this.goToStart();

    this._engine.runRenderLoop(() => {
      switch (this._state) {
        case State.START:
          this._scene.render();
          break;
        case State.GAME:
          // if (this._ui.quit) {
          //   this._goToStart();
          //   this._ui.quit = false;
          // }
          this._scene.render();
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

  detatchSceneControl() {
    this._scene.detachControl();
  }

  async goToStart() {
    this._engine.displayLoadingUI();
    this._scene.detachControl();
    let scene = new Scene(this._engine);
    scene.clearColor = new Color4(0, 0, 0, 1);
    let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero());

    this._guiService?.setGui(new StartMenu());

    await scene.whenReadyAsync();
    
    this._engine.hideLoadingUI();
    //lastly set the current state to the start state and set the scene to the start scene
    this._scene.dispose();
    this._scene = scene;
    this._state = State.START;
  }

  async goToGame() {

  }
}
new App();
