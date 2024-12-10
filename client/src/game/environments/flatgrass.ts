import { Environment } from "@/game/environments/environment";
import { MeshBuilder } from "@babylonjs/core";


export class Flatgrass extends Environment {
  public async _loadAssets() {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 100,
      height: 100
    }, this._scene);
    ground.checkCollisions = true;

    const wall = MeshBuilder.CreateBox("wall", {
        height: 5,
        width: 10,
        depth: 1
    }, this._scene);
    wall.position.z = 5;
    wall.checkCollisions = true;

    return {
      allMeshes: [ground, wall]
    };
  }
}
