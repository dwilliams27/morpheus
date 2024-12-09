import { Scene, Mesh, Vector3, Color3, TransformNode, SceneLoader, ParticleSystem, Color4, Texture, PBRMetallicRoughnessMaterial, VertexBuffer, AnimationGroup, Sound, ExecuteCodeAction, ActionManager, Tags, ISceneLoaderAsyncResult, AbstractMesh } from "@babylonjs/core";
import { Entity } from "@/game/services/entities/entityService";

export class Environment {
  _scene: Scene;
  _entities: Array<Entity>;
  _envMesh?: Mesh;
  _assets?: {
    env: ISceneLoaderAsyncResult;
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

  public _setupCollisions() {
    this._assets?.allMeshes.forEach(m => {
      m.receiveShadows = true;
      m.checkCollisions = true;

      if (m.name == "ground") { //dont check for collisions, dont allow for raycasting to detect it(cant land on it)
        m.checkCollisions = false;
        m.isPickable = false;
      }

      //areas that will use box collisions
      if (m.name.includes("stairs") || m.name == "cityentranceground" || m.name == "fishingground.001" || m.name.includes("lilyflwr")) {
        m.checkCollisions = false;
        m.isPickable = false;
      }
      //collision meshes
      if (m.name.includes("collision")) {
        m.isVisible = false;
        m.isPickable = true;
      }
      //trigger meshes
      if (m.name.includes("Trigger")) {
        m.isVisible = false;
        m.isPickable = false;
        m.checkCollisions = false;
      }
    });
  }

  public async _loadAssets() {
    const envMesh = await SceneLoader.ImportMeshAsync(null, "./models/", "flatgrass.glb", this._scene);
    const allMeshes = envMesh.meshes[0].getChildMeshes();

    return {
      env: envMesh,
      allMeshes: allMeshes
    };
  }
}
