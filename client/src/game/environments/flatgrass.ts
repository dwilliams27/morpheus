import { Environment } from "@/game/environments/environment";
import { SceneLoader } from "@babylonjs/core";


export class Flatgrass extends Environment {
  public async _loadAssets() {
    const envMesh = await SceneLoader.ImportMeshAsync(null, "./models/", "flatgrass.glb", this._scene);
    const allMeshes = envMesh.meshes[0].getChildMeshes();

    const envMesh2 = await SceneLoader.ImportMeshAsync(null, "./models/", "cubes.glb", this._scene);
    allMeshes.push(...envMesh2.meshes[0].getChildMeshes());

    return {
      env: envMesh,
      allMeshes: allMeshes
    };
  }
}
