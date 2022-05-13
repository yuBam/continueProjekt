export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    var playerCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "playerCollider",
    });
    var playerSensor = Bodies.circle(this.x, this.y,20, {
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
    scene.load.atlas("slime", "character/slime.png", "character/slime_atlas.json");
    scene.load.animation("slime_anim", "character/slime_anim.json");
    scene.load.atlas("death", "character/death.png", "character/death_atlas.json");
    scene.load.animation("death_anim", "character/death_anim.json");
  }

  get velocity() {
    return this.body.velocity;
  }
  update() {
    const speed = 3;
    let playerVelocity = new Phaser.Math.Vector2();
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -1;
      this.flipX = true;
    } else if (this.inputKeys.right.isDown) {
      playerVelocity.x = 1;
      this.flipX = false;
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -1;
    } else if (this.inputKeys.down.isDown) {
      playerVelocity.y = 1;
    }
    
    this.setFixedRotation();
    //this.body.angle = 0;
    playerVelocity.normalize();
    playerVelocity.scale(speed);
    this.setVelocity(playerVelocity.x, playerVelocity.y);
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play("move1", true);
    } else {
      this.anims.play("idle1", true);
    }

    
  }
}