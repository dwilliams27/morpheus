import { App } from "@/app";
import { Environment } from "@/game/environments/environment";
import { Gui } from "@/game/services/gui/guiService";
import { LocatableService, ServiceLocator } from "@/game/services/serviceLocator";
import { Color3, DirectionalLight, HemisphericLight, MeshBuilder, Scene, ShadowGenerator, UniversalCamera, Vector3 } from "@babylonjs/core";

export const SCENE_SERVICE_NAME = 'SCENE_SERVICE';

export abstract class MScene extends Scene {
  name: string;
  app: App;
  serviceLocator: ServiceLocator;
  gui: Gui;
  paused: boolean = false;
  mainCamera: UniversalCamera;
  environment?: Environment;

  constructor(name: string, app: App) {
    super(app.getEngine());
    this.app = app;
    this.name = name;
    this.serviceLocator = app.getRootServiceLocator();
    this.gui = this.getGui();

    // Camera
    this.mainCamera = new UniversalCamera("camera1", new Vector3(0, 1, 0), this);
    this.mainCamera.setTarget(new Vector3(1, 1, 0));

    // Lighting
    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      this
    );
    hemisphericLight.intensity = 0.7;
    hemisphericLight.groundColor = new Color3(0.2, 0.2, 0.2);

    const directionalLight = new DirectionalLight(
        "directionalLight",
        new Vector3(-1, -2, -1),
        this
    );
    directionalLight.intensity = 0.5;
    directionalLight.position = new Vector3(20, 40, 20);
    
    const shadowGenerator = new ShadowGenerator(1024, directionalLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.blurScale = 2;
    shadowGenerator.setDarkness(0.3);

    // Collisions
    this.collisionsEnabled = true;
    this.gravity = new Vector3(0, -9.81, 0);
  }

  abstract loadEnvironment(): Promise<void>;
  abstract loadScene(): Promise<void>;
  abstract getGui(): Gui;
}

export class SceneService extends LocatableService {
  static readonly serviceName = SCENE_SERVICE_NAME;
  private _activeScene?: MScene;
  private _scenes: Record<string, MScene> = {};
  
  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator);
  }

  async setActiveScene(scene: MScene) {
    console.log('Setting active scene: ', scene.name);
    this.app.setLoadingUI(true);
    this._activeScene?.detachControl();
    scene.detachControl();

    await scene.loadScene();
    await scene.loadEnvironment();

    this.app.setLoadingUI(false);
    this._activeScene?.dispose();
    this._activeScene = scene;
    this._activeScene.attachControl();
    console.log('Successfully set active scene: ', scene.name);
  }

  addScene(scene: MScene) {
    this._scenes[scene.name] = scene;
  }

  getActiveScene() {
    if (!this._activeScene) {
      throw new Error('No active scene');
    }
    return this._activeScene;
  }

  getScene(name: string) {
    return this._scenes[name];
  }
}
