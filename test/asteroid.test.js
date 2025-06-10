/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('node:assert');
const test = require('node:test');

// Minimal Phaser stub for RNG
global.Phaser = { Math: { RND: { between: (min, max) => min } } };

class MockImage {
        constructor() {
                this.scale = 1;
        }
        setVelocity(x, y) {
                this.velocity = { x, y };
        }
        setAngularVelocity(r) {
                this.angularVelocity = r;
        }
        setScale(s) {
                this.scale = s;
        }
}

class MockPhysics {
        constructor() {
                this.world = {
                        wrapCalls: [],
                        wrap: (obj, padding) => {
                                this.world.wrapCalls.push({ obj, padding });
                        }
                };
                this.add = {
                        image: () => new MockImage()
                };
        }
}

function createMockScene() {
        return {
                physics: new MockPhysics(),
                cameras: { main: { x: 0, y: 0, width: 100, height: 100 } }
        };
}

const Asteroid = require('../lib/Objects/Asteroid').default;

test('createRandom creates asteroid if below threshold', () => {
        const scene = createMockScene();
        const asteroids = [];
        Asteroid.createRandom(scene, asteroids);
        assert.strictEqual(asteroids.length, 1);
        assert.ok(asteroids[0].isBig);
});

test('createRandom respects big asteroid limit', () => {
        const scene = createMockScene();
        const asteroids = [];
        for (let i = 0; i < Asteroid.minBigAsteroids; i++) {
                asteroids.push(new Asteroid(scene, {
                        posX: 0,
                        posY: 0,
                        velocityX: 0,
                        velocityY: 0,
                        rotation: 0,
                        isBig: true
                }));
        }
        Asteroid.createRandom(scene, asteroids);
        assert.strictEqual(asteroids.length, Asteroid.minBigAsteroids);
});

test('wrap calls physics.world.wrap on each asteroid', () => {
        const scene = createMockScene();
        const asteroids = [
                new Asteroid(scene, {
                        posX: 0,
                        posY: 0,
                        velocityX: 0,
                        velocityY: 0,
                        rotation: 0,
                        isBig: true
                }),
                new Asteroid(scene, {
                        posX: 1,
                        posY: 1,
                        velocityX: 0,
                        velocityY: 0,
                        rotation: 0,
                        isBig: false
                })
        ];
        Asteroid.wrap(scene.physics, asteroids);
        assert.strictEqual(scene.physics.world.wrapCalls.length, 2);
});

test('constructor scales small asteroids', () => {
        const scene = createMockScene();
        const asteroid = new Asteroid(scene, {
                posX: 0,
                posY: 0,
                velocityX: 0,
                velocityY: 0,
                rotation: 0,
                isBig: false
        });
        assert.strictEqual(asteroid.asteroid.scale, Asteroid.smallAsteroidScale);
});
