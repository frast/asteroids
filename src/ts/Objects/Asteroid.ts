import Phaser from 'phaser';

type InitialAsteroidState = {
	readonly posX: number;
	readonly posY: number;
	readonly velocityX: number;
	readonly velocityY: number;
	readonly rotation: number;
	readonly isBig: boolean;
};

export default class Asteroid {
	static readonly minBigAsteroids = 3;
	static readonly maxRotation = 10;
	static readonly maxVelocity = 50;
	static readonly smallAsteroidScale = 0.5;

	private asteroid: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
	private isBig: boolean;

	constructor(scene: Phaser.Scene, state: InitialAsteroidState) {
		this.asteroid = scene.physics.add.image(state.posX, state.posY, "asteroid");
		this.asteroid.setVelocity(state.velocityX, state.velocityY);
		this.asteroid.setAngularVelocity(state.rotation);
		this.isBig = state.isBig;
		this.setScale();
	}

	private setScale() {
		if (!this.isBig) {
			this.asteroid.setScale(Asteroid.smallAsteroidScale);
		}
	}

	public static createRandom(scene: Phaser.Scene, asteroids: Asteroid[]): void {
		const countBigAsteroids = asteroids.filter(
			(asteroid) => asteroid.isBig
		).length;

		if (countBigAsteroids >= this.minBigAsteroids) {
			return;
		}

		enum Direction {
			Left,
			Top,
			Right,
			Bottom,
		}

		const randomSelection: Direction = Math.floor(Math.random() * 4);

		const camera = scene.cameras.main;
		const bounds = {
			left: camera.x,
			top: camera.y,
			right: camera.x + camera.width,
			bottom: camera.y + camera.height,
		};
		const getRandomCoordinateX = (): number =>
			Phaser.Math.RND.between(bounds.left, bounds.right);
		const getRandomCoordinateY = (): number =>
			Phaser.Math.RND.between(bounds.top, bounds.bottom);

		const coordinates: { posX: number; posY: number } = { posX: 0, posY: 0 };

		switch (randomSelection) {
		case Direction.Left:
			coordinates.posX = bounds.left;
			coordinates.posY = getRandomCoordinateY();
			break;
		case Direction.Top:
			coordinates.posX = getRandomCoordinateX();
			coordinates.posY = bounds.top;
			break;
		case Direction.Right:
			coordinates.posX = bounds.right;
			coordinates.posY = getRandomCoordinateY();
			break;
		case Direction.Bottom:
			coordinates.posX = getRandomCoordinateX();
			coordinates.posY = bounds.bottom;
			break;
		default:
			break;
		}

		const rotation = Math.random() * this.maxRotation * 2 - this.maxRotation;
		const velocity = {
			x: Math.random() * this.maxVelocity * 2 - this.maxVelocity,
			y: Math.random() * this.maxVelocity * 2 - this.maxVelocity,
		};

		asteroids.push(
			new Asteroid(scene, {
				...coordinates,
				isBig: true,
				rotation: rotation,
				velocityX: velocity.x,
				velocityY: velocity.y,
			})
		);
	}

	/**
	 * Wrap the given Objects
	 */
	public static wrap(
		physics: Phaser.Physics.Arcade.ArcadePhysics,
		asteroids: Asteroid[]
	): void {
		asteroids.forEach(asteroid => {
			physics.world.wrap(asteroid.asteroid, 32);
		});
	}
}
