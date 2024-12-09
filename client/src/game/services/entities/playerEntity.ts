import { Entity } from "@/game/services/entities/entityService";
import { MScene } from "@/game/services/scene/sceneService";

export class PlayerEntity extends Entity {
  constructor(scene: MScene) {
    super(scene, "plr", { speed: 1 });
  }
}
