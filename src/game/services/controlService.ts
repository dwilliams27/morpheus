import { MScene } from "@/game/services/scene/sceneService";
import { LocatableService, ServiceLocator } from "@/game/services/serviceLocator";
import { Quaternion, UniversalCamera, Vector3 } from "@babylonjs/core";

export const CONTROL_SERVICE_NAME = 'CONTROL_SERVICE';

export class ControlService extends LocatableService {
  static readonly serviceName = CONTROL_SERVICE_NAME;
  activeScene?: MScene;
  moveSpeed = 0.5;
  rotateSpeed = 0.1;

  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator);
  }

  setupUniversalCameraForScene(scene: MScene) {
    this.activeScene = scene;

    const camera = new UniversalCamera("universalCamera", new Vector3(0, 1, -10), this.activeScene);
    camera.setTarget(Vector3.Zero());

    camera.angularSensibility = 10000 * this.rotateSpeed;
    camera.speed = this.moveSpeed;
    camera.inertia = 0.5;

    camera.rotationQuaternion = Quaternion.Identity();

    camera.attachControl(this.app.getCanvas(), true);

    camera.keysUp.push(87);    // W
    camera.keysDown.push(83);  // S
    camera.keysLeft.push(65);  // A
    camera.keysRight.push(68); // D

    camera.checkCollisions = true;
    camera.applyGravity = true;

    camera.ellipsoid = new Vector3(1, 1, 1);
    camera.ellipsoidOffset = new Vector3(0, 1, 0);

    this.activeScene.activeCamera = camera;

    return camera;
  }
}
