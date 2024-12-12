import { Scene, Mesh, Vector3, Color3, TransformNode, SceneLoader, ParticleSystem, Color4, Texture, PBRMetallicRoughnessMaterial, VertexBuffer, AnimationGroup, Sound, ExecuteCodeAction, ActionManager, Tags, ISceneLoaderAsyncResult, AbstractMesh } from "@babylonjs/core";
import { Entity } from "@/game/services/entities/entityService";

export abstract class Environment {
  _scene: Scene;
  _entities: Array<Entity>;
  _envMesh?: Mesh;
  _assets?: {
    allMeshes: AbstractMesh[];
  };

  constructor(entities: Entity[], scene: Scene) {
    this._scene = scene;
    this._entities = entities;
  }

  public async load() {
    this._assets = await this._loadAssets();
    this._setupCollisions();
  }

  public _setupCollisions() {}

  abstract _loadAssets(): Promise<{ allMeshes: AbstractMesh[] }>;
}
