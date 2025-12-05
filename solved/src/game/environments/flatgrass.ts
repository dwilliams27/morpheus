import { Environment } from "@/game/environments/environment";
import { MeshBuilder, StandardMaterial } from "@babylonjs/core";
import { WoodProceduralTexture } from "@babylonjs/procedural-textures";


export class Flatgrass extends Environment {
  public async _loadAssets() {
    const ground = MeshBuilder.CreateGround("ground", {
      width: 100,
      height: 100
    }, this._scene);
    ground.checkCollisions = true;

    const material = new StandardMaterial("material", this._scene);
    const texture = new WoodProceduralTexture("texture", 1024, this._scene);
    material.diffuseTexture = texture;
    ground.material = material;

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
