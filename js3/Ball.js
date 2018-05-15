import { SpriteSheet } from './SpriteSheet.js';
import { createAnim } from './SpriteSheet.js';
import Entity from './Entity.js';
import {Vel} from './math.js';

export default class Ball extends Entity {
  constructor(tiles, id) {
    super(10, 10);
    this.name = 'ball';
    this.vel = new Vel();
    this.sprites = new SpriteSheet(tiles, 660, 0, this.size.x, this.size.y);
    this.states = [['ball0', 0, 0], ['ball1', 0, 1], ['ball2', 1, 0], ['bullet', 2, 1], ['onfire', 2, 1]];
    this.anims = createAnim(1, this.states, 0, 0);
    this.createSprites(this.sprites, this.states, this.anims);
    this.id = id;
    this.dead = true;
    this.onFire = false;
    this.stuck = true;
    this.oldVel = {x: 150, y: -320};
    this.stickOffset = 0;
  }

  get box() {
    return {
      left: [this.left, this.left, this.center.y, this.center.y],
      right: [this.right, this.right, this.center.y, this.center.y],
      top: [this.center.x, this.center.x, this.top, this.top],
      bottom: [this.center.x, this.center.x, this.bottom, this.bottom],
    };
  }

  get center() {
    return {
      x: (this.left + this.right) / 2,
      y: (this.top + this.bottom) / 2,
    };
  }

  saveVel() {
    this.oldVel.x = this.vel.x;
    this.oldVel.y = this.vel.y;
  }

  stick(player) {
    this.saveVel();
    this.vel.set(0, 0);
    this.pos.y = 600;
    this.stuck = true;
  }

  update(dt) {
    if (this.dead) return false;
    if (this.vel.y === 0) return true;

    if (this.bottom > 750) {
      this.dead = true;
      this.saveVel();
      this.vel.set(0,0);
    }

    if (this.top <= 0 && this.name === 'bullet') {
      this.dead = true;
      this.saveVel();
      this.vel.set(0, 0);
    }

    if (this.left <= 0 || this.right >= 572) {
      this.vel.x = - this.vel.x;
    }
    if (this.left < 0) this.pos.x = 0;
    if (this.right > 572) this.pos.x = 572 - this.size.x;
    if (this.top <= 0) {
      this.vel.y = Math.abs(this.vel.y);
      this.pos.y = 0;
    }

    this.pos.x += this.vel.x * dt;
    this.pos.y += this.vel.y * dt;
    return true;
  }
}