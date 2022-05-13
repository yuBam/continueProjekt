export default class enemy extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    var playerCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "playerCollider",
    });
    var playerSensor = Bodies.circle(this.x, this.y, 20, {
      isSensor: true,
      label: "playerSensor",
    });
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    });
    this.setExistingBody(compoundBody);
    this.setFixedRotation();
  }
  static preload(scene) {
    scene.load.atlas(
      "slime",
      "character/slime.png",
      "character/slime_atlas.json"
    );
    scene.load.animation("slime_anim", "character/slime_anim.json");
  }

  update() {
    this.setFixedRotation();
    this.anims.play("idle", true);
    //this.anims.play("", true);
  }
}
