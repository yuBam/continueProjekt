import Player from "./Player.js";
import enemy from "../enemy.js";
import lizard from "../lizard.js";

let visions;
let rts;
let lampIsOn;
export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    Player.preload(this);
    enemy.preload(this);

    this.load.image("base_tiles", "base_tiles/tileset.png");
    this.load.tilemapTiledJSON("tilemap", "base_tiles/map.json");
  }
  //lampIsON = true;
  create() {
    this.time = { value: 0 };

    const map = this.make.tilemap({ key: "tilemap" });
    const tileset = map.addTilesetImage(
      "test-tiles",
      "base_tiles",
      64,
      64,
      0,
      0
    );

    // "Ground" layer will be on top of "Background" layer
    const GroundLayer = map.createLayer("Ground", tileset, 0, 0);
    // "Ground" layer will be on top of "Background" layer

    const anotherStuffLayer = map.createLayer("Another-stuff", tileset, 0, 0);
    anotherStuffLayer.setCollisionByProperty({ collide: true });
    this.matter.world.convertTilemapLayer(anotherStuffLayer);
    anotherStuffLayer.setDepth(100);
    // make a RenderTexture that is the size of the screen
    const width = 2500;
    const height = 2500;
    const rt = this.make.renderTexture(
      {
        width,
        height,
      },
      true
    );

    // fill it with black
    //rt.fill(0x000000, 1);
    // draw the floorLayer into it
    rt.setDepth(100);
    rt.draw(GroundLayer);
    //rt.draw(treeLayer)
    // set a dark blue tint
    rt.setTint(0x0a2948);
    rts = rt;

    this.enemy = new enemy({
      scene: this,
      x: 450,
      y: 260,
      texture: "slime",
      frame: "slime-idle-0",
    });

    this.enemy.setScale(1.5);
    this.player = new Player({
      scene: this,
      x: 450,
      y: 360,
      texture: "death",
      frame: "idle_000",
    });

    this.lizards = this.add.group();
    for (let index = 0; index < 1; index++) {
      this.lizards.add(
        new lizard({
          scene: this,
          x: Phaser.Math.Between(200, 400),
          y: Phaser.Math.Between(200, 400),
          texture: "death",
          frame: "idle_000",
        })
      );
    }

    const vision = this.make.image({
      x: this.player.x,
      y: this.player.y,
      key: "vision",
      add: false,
    });
    visions = vision;

    vision.scale = 0;

    rt.mask = new Phaser.Display.Masks.BitmapMask(this, vision);
    rt.mask.invertAlpha = true;
    this.player.setScale(1.3);
    //this.player.setDepth(100);
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      lamp: Phaser.Input.Keyboard.KeyCodes.E,
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 0.6;
    this.cameras.main.setBounds(0, 0, 2550, 2550);

    var tween = this.tweens.add({
      targets: this.time,
      value: 0.99,
      ease: "Cubic", 
      duration: 10000,
      yoyo: true,
      repeat: -1,
    });
  }

  update() {
    this.player.update();
    // if (time <= 1 && isDay) {
    //   time += 0.001;
    // } else if (time <= 0 && isDay) {
    //   time -= 0.001;
    // }
    this.enemy.update();
    Phaser.Actions.Call(
      this.lizards.getChildren(),
      function (lizard) {
        lizard.update();
      },
      this
    );
    if (this.player.inputKeys.lamp.isDown && this.time.value >= 0.8) {
      if (lampIsOn) {
        visions.scale = 0;
        lampIsOn = false;
      } else {
        lampIsOn = true;
        visions.scale = 2.5;
      }
    }
    if (this.time.value <= 0.9) {
      visions.scale = 0;
    }
    /*if (this.enemy.x == 260){
      this.player.x=-50
    }*/
    //addEventListener("keydown", foo);

    rts.setAlpha(this.time.value);
    if (visions) {
      visions.x = this.player.x;
      visions.y = this.player.y;
    }

    this.moveEnemy();
  }
  moveEnemy() {
    this.enemy.x += 5;
    if (this.enemy.y == 460) {
      this.enemy.x -= 5;
    }
  }
}
/*
function foo(e) {
  if (e.keyCode == 32) {
    console.log("1");
  }
  removeEventListener("keydown", foo);
}
*/
