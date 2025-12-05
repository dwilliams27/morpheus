import { App } from "@/app";
import { MScene } from "@/game/services/scene/sceneService";
import { LocatableService, ServiceLocator } from "@/game/services/serviceLocator";
import { genId } from "@/game/utils/id";
import { Mesh, TransformNode, Vector3 } from "@babylonjs/core";

export const ENTITY_SERVICE_NAME = 'ENTITY_SERVICE';

export interface EntityProperties {
  speed: number;
}

export abstract class Entity {
  app: App;
  serviceLocator: ServiceLocator;
  scene: MScene;
  id: string;
  mesh: Mesh;
  tnode: TransformNode;
  properties: EntityProperties;

  constructor(scene: MScene, prefix: string, properties: EntityProperties) {
    this.scene = scene;
    this.app = scene.app;
    this.serviceLocator = scene.serviceLocator;
    this.id = genId(prefix);
    this.properties = properties;
    this.tnode = new TransformNode(this.id, scene);

    const sphere = Mesh.CreateSphere(this.id, 4, 1, scene);
    sphere.isVisible = false;
    sphere.position = (new Vector3(scene.getTransformNodeByName(this.id)?.getAbsolutePosition().x, scene.getTransformNodeByName(this.id)?.getAbsolutePosition().y, scene.getTransformNodeByName(this.id)?.getAbsolutePosition().z));
    this.mesh = sphere;
  };
}

export class EntityService extends LocatableService {
  static readonly serviceName = ENTITY_SERVICE_NAME;
  private _entityMap: Map<string, Entity> = new Map();
  private _entityList: Entity[] = [];
  
  constructor(serviceLocator: ServiceLocator) {
    super(serviceLocator);
  }

  registerEntity(entity: Entity) {
    this._entityMap.set(entity.id, entity);
    this._hydrateEntityList();
  }

  _hydrateEntityList() {
    this._entityList = Array.from(this._entityMap.values());
  }

  getEntityList() {
    return this._entityList;
  }
}
