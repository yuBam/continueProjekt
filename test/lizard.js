const Direction = {
  UP: "Up",
  DOWN: "Down",
  LEFT: "Left",
  RIGHT: "Right",
};

const speed = 5;
let timerRandomMove = { value: 200 };

let directionArray = [
  Direction.UP,
  Direction.DOWN,
  Direction.LEFT,
  Direction.RIGHT,
];

export default class lizard extends Phaser.Physics.Matter.Sprite {
  constructor(data) {
    let { scene, x, y, texture, frame } = data;
    super(scene.matter.world, x, y, texture, frame);
    this.scene.add.existing(this);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter;
    var lizardCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: "lizardCollider",
    });
    var lizardSensor = Bodies.circle(this.x, this.y, 20, {
      isSensor: true,
      label: "lizardSensor",
    });
    const compoundBody = Body.create({
      parts: [lizardCollider, lizardSensor],
      frictionAir: 0.35,
    });

    this.setExistingBody(compoundBody);
    this.setFixedRotation();

    this.direction = Direction.LEFT;

    //Wenn Collision passiert
    this.scene.matter.world.on("collisionstart", (event, bodyA, bodyB) => {
      //Überprüft ob die Collision Wand und Lizard war

      console.log(bodyA, bodyB);
      if (bodyA.label == "Rectangle Body" && bodyB.label == "lizardCollider") {
        this.direction = randomDirection(
          directionArray.indexOf(this.direction)
        );
      }

      if (bodyA.label == "lizardSensor" && bodyB.label == "playerSensor") {
        alert("Du bist gestorben");
      }
    });

    this.anims.play("move1", true);

    //Random Direction (die direction die davor war wird nicht ausgeführt)
    const randomDirection = (exclude) => {
      let newDirection = Phaser.Math.Between(0, 3);
      while (newDirection === exclude) {
        newDirection = Phaser.Math.Between(0, 3);
      }

      return directionArray[newDirection];
    };

    //Ramdom Movement after Time
    this.scene.tweens.add({
      targets: timerRandomMove,
      value: 0,
      duration: Phaser.Math.Between(2000, 5000),
      repeat: -1,
      onRepeat: () => {
        this.direction = randomDirection(
          directionArray.indexOf(this.direction)
        );
      },
    });
  }

  static preload(scene) {
    //scene.load.atlas("slime", "character/slime.png", "character/slime_atlas.json");
    //scene.load.animation("slime_anim", "character/slime_anim.json");
    scene.load.atlas(
      "death",
      "character/death.png",
      "character/death_atlas.json"
    );
    scene.load.animation("death_anim", "character/death_anim.json");
  }

  preupdate() {
    this.checkDirection();
  }

  checkDirection() {
    switch (this.direction) {
      case (this.direction = Direction.UP):
        this.setVelocity(0, -speed);
        break;

      case (this.direction = Direction.DOWN):
        this.setVelocity(0, speed);
        break;

      case (this.direction = Direction.LEFT):
        this.setVelocity(-speed, 0);
        this.flipX = true;
        break;

      case (this.direction = Direction.RIGHT):
        this.setVelocity(speed, 0);
        this.flipX = false;
        break;
    }
  }

  update() {
    this.preupdate();
    this.setFixedRotation();

    //this.anims.play("", true);
  }
}
