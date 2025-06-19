import Phaser from 'phaser';
import Asteroid from "../Objects/Asteroid";
import Utilities from "../Utilities";

export default class MainGame extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static readonly Name = "MainGame";

	spaceship: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	asteroids: Asteroid[] = [];
	cursors: Phaser.Types.Input.Keyboard.CursorKeys;

	readonly angularAcceleration = 5;
	readonly maxAngularVelocity = 300;

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("MainGame", "create");

		this.spaceship = this.physics.add.sprite(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			"spaceship",
			0
		);
		this.spaceship.setDamping(true);
		this.spaceship.setDrag(0.99);
		this.spaceship.setMaxVelocity(200);

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	public update(): void {
		Asteroid.createRandom(this, this.asteroids);
		if (this.cursors.up.isDown) {
			this.physics.velocityFromRotation(
				this.spaceship.rotation - Math.PI / 2,
				200,
				this.spaceship.body.acceleration
			);
			this.spaceship.setFrame(1);
		} else {
			this.spaceship.setAcceleration(0);
			if (this.cursors.left.isDown) {
				this.spaceship.body.angularVelocity -= this.angularAcceleration;
				this.spaceship.setFrame(2);
			} else if (this.cursors.right.isDown) {
				this.spaceship.body.angularVelocity += this.angularAcceleration;
				this.spaceship.setFrame(3);
			} else {
				this.spaceship.setFrame(0);
			}
		}

		if (this.spaceship.body.angularVelocity > this.maxAngularVelocity) {
			this.spaceship.body.angularVelocity = this.maxAngularVelocity;
		} else if (this.spaceship.body.angularVelocity < -this.maxAngularVelocity) {
			this.spaceship.body.angularVelocity = -this.maxAngularVelocity;
		}

		this.physics.world.wrap(this.spaceship, 32);
		Asteroid.wrap(this.physics, this.asteroids);
	}
}
