import { App } from "@/app";
import { Flatgrass } from "@/game/environments/flatgrass";
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
    this.setupInput();
    this.player = new PlayerEntity(this);

    console.log('Adding cam');
    this.mainCamera = this._setupPlayerCamera();
    this.activatePlayerCamera();

    this.serviceLocator.getService(GuiService).setGui(this.gui);

    await this.whenReadyAsync();
  }

  setupInput() {
    this.actionManager = new ActionManager(this);

    this.inputMap = {};
    this.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
      this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));
    this.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
      this.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    this.onBeforeRenderObservable.add(() => {
      this._updateFromKeyboard();
    });
  }

  private _updateFromKeyboard(): void {
    if ((this.inputMap["w"]) && !this.paused) {
      this.verticalAxis = 1;
      this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
    } else if ((this.inputMap["s"]) && !this.paused) {
      this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
      this.verticalAxis = -1;
    } else {
      this.vertical = 0;
      this.verticalAxis = 0;
    }

    //left - right movement
    if ((this.inputMap["a"]) && !this.paused) {
      console.log('left', this.horizontal);
      this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
      this.horizontalAxis = -1;
    } else if ((this.inputMap["d"]) && !this.paused) {
      console.log('right', this.horizontal);
      this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
      this.horizontalAxis = 1;
    }
    else {
      this.horizontal = 0;
      this.horizontalAxis = 0;
    }
  }

  private _setupPlayerCamera(): UniversalCamera {
    //to face the player from behind (180 degrees)
    this.camRoot.rotation = new Vector3(0, Math.PI, 0);

    //rotations along the x-axis (up/down tilting)
    let yTilt = new TransformNode("ytilt");
    //adjustments to camera view to point down at our player
    yTilt.rotation = new Vector3(0.5934119456780721, 0, 0);
    this.yTilt = yTilt;
    yTilt.parent = this.camRoot;

    this.mainCamera.rotationQuaternion = Quaternion.Identity();
    this.mainCamera = new UniversalCamera("cam", new Vector3(0, 0, -30), this);
    this.mainCamera.lockedTarget = this.camRoot.position;
    this.mainCamera.fov = 0.47350045992678597;
    this.mainCamera.parent = yTilt;

    this.activeCamera = this.mainCamera;
    return this.mainCamera;
  }

  private _updateFromControls(): void {
    if (!this.player) {
      return;
    }

    this._deltaTime = this.getEngine().getDeltaTime() / 1000.0;

    this.moveDirection = Vector3.Zero();

    //--MOVEMENTS BASED ON CAMERA (as it rotates)--
    let fwd = this.camRoot?.forward;
    let right = this.camRoot?.right;
    let correctedVertical = fwd.scaleInPlace(this.vertical);
    let correctedHorizontal = right.scaleInPlace(this.horizontal);

    //movement based off of camera's view
    let move = correctedHorizontal.addInPlace(correctedVertical);

    //clear y so that the character doesnt fly up, normalize for next step
    this.moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);

    //clamp the input value so that diagonal movement isn't twice as fast
    let inputMag = Math.abs(this.horizontal) + Math.abs(this.vertical);
    if (inputMag < 0) {
      this.inputAmt = 0;
    } else if (inputMag > 1) {
      this.inputAmt = 1;
    } else {
      this.inputAmt = inputMag;
    }
    //final movement that takes into consideration the inputs
    this.moveDirection = this.moveDirection.scaleInPlace(this.inputAmt * this.player?.properties.speed);
    console.log('moveDirection', this.moveDirection);

    //check if there is movement to determine if rotation is needed
    let input = new Vector3(this.horizontalAxis, 0, this.verticalAxis); //along which axis is the direction
    if (input.length() == 0) {
      return;
    }

    //rotation based on input & the camera angle
    // let angle = Math.atan2(this.horizontalAxis, this.verticalAxis);
    // angle += this.camRoot.rotation.y;
    // let targ = Quaternion.FromEulerAngles(0, angle, 0);
    // console.log(this.mainCamera.rotationQuaternion);
    // this.mainCamera.rotationQuaternion = Quaternion.Slerp(this.mainCamera.rotationQuaternion, targ, 10 * this._deltaTime);

    this.mainCamera.position.addInPlace(this.moveDirection);
  }

  private _beforeRenderUpdate(): void {
    this._updateFromControls();
  }

  public activatePlayerCamera() {
    this.registerBeforeRender(() => {
      this._beforeRenderUpdate();
      this._updateCamera();
    })
  }

  private _updateCamera(): void {
    //update camera postion up/down movement
    let centerPlayer = (this.player?.mesh.position.y || 0) + 2;
    this.camRoot.position = Vector3.Lerp(this.camRoot.position, new Vector3(this.player?.mesh.position.x, centerPlayer, this.player?.mesh.position.z), 0.4);
  }
}
