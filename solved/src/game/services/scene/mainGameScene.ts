import { App } from "@/app";
import { Flatgrass } from "@/game/environments/flatgrass";
import { ControlService } from "@/game/services/controlService";
import { Entity } from "@/game/services/entities/entityService";
import { PlayerEntity } from "@/game/services/entities/playerEntity";
import { GuiService } from "@/game/services/gui/guiService";
import { MainHudGui } from "@/game/services/gui/mainHud";
import { MScene } from "@/game/services/scene/sceneService";
import { ActionManager, Color4, ExecuteCodeAction, FreeCamera, Quaternion, Scalar, TransformNode, UniversalCamera, Vector3 } from "@babylonjs/core";

export const MAIN_GAME_SCENE = 'MAIN_GAME_SCENE';

export class MainGameScene extends MScene {
  paused: boolean = false;
  inputMap: any;

  horizontal: number = 0;
  vertical: number = 0;

  horizontalAxis: number = 0;
  verticalAxis: number = 0;

  jumpKeyDown: boolean = false;
  dashing: boolean = false;

  player?: Entity;
  moveDirection: Vector3 = Vector3.Zero();
  inputAmt: number = 0;

  camRoot: TransformNode;
  yTilt?: TransformNode;

  private _deltaTime: number = 0;

  constructor(app: App) {
    super(MAIN_GAME_SCENE, app);

    this.camRoot = new TransformNode("root");
    this.camRoot.position = new Vector3(0, 0, 0); 
  }

  getGui() {
    return new MainHudGui(this);
  }

  async loadEnvironment() {
    console.log('Loading environment');
    const env = new Flatgrass([], this);
    await env.load();
  }

  async loadScene() {
    this.clearColor = new Color4(0, 0, 0, 1);
    this.player = new PlayerEntity(this);

    console.log('Adding cam');
    this.mainCamera = this.serviceLocator.getService(ControlService).setupUniversalCameraForScene(this);

    this.serviceLocator.getService(GuiService).setGui(this.gui);

    await this.whenReadyAsync();
  }
}
