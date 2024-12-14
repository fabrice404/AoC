import { arrayToPoint } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import { manhattanDistance } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Particle {
  id: number;
  position: Point;
  velocity: Point;
  acceleration: Point;
}

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const particles: Particle[] = this.lines.map((line, id) => {
      const particle = line.match(/p=<(.+?)>, v=<(.+?)>, a=<(.+?)>/)!;

      const position = arrayToPoint(particle[1].trim().split(",").map(Number));
      const velocity = arrayToPoint(particle[2].trim().split(",").map(Number));
      const acceleration = arrayToPoint(particle[3].trim().split(",").map(Number));

      return { id, position, velocity, acceleration };
    });

    const closest: number[] = [];

    const samples = 5000;

    while (closest.length < samples || new Set(closest.slice(0, samples)).size !== 1) {
      particles.forEach((particle) => {
        particle.velocity.x += particle.acceleration.x;
        particle.velocity.y += particle.acceleration.y;
        particle.velocity.z! += particle.acceleration.z!;

        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        particle.position.z! += particle.velocity.z!;
      });

      closest.unshift(
        particles
          .map((particle) => ({
            id: particle.id,
            distance: manhattanDistance(particle.position, { x: 0, y: 0, z: 0 }),
          }))
          .sort((a, b) => a.distance - b.distance)[0].id,
      );
    }

    return closest[0];
  }

  public async part2(): Promise<string | number> {
    let particles: Particle[] = this.lines.map((line, id) => {
      const particle = line.match(/p=<(.+?)>, v=<(.+?)>, a=<(.+?)>/)!;

      const position = arrayToPoint(particle[1].trim().split(",").map(Number));
      const velocity = arrayToPoint(particle[2].trim().split(",").map(Number));
      const acceleration = arrayToPoint(particle[3].trim().split(",").map(Number));

      return { id, position, velocity, acceleration };
    });

    const samples = 100;
    const counts: number[] = [];

    while (counts.length < samples || new Set(counts.slice(0, samples)).size !== 1) {
      particles.forEach((particle) => {
        particle.velocity.x += particle.acceleration.x;
        particle.velocity.y += particle.acceleration.y;
        particle.velocity.z! += particle.acceleration.z!;

        particle.position.x += particle.velocity.x;
        particle.position.y += particle.velocity.y;
        particle.position.z! += particle.velocity.z!;
      });

      const collisions: string[] = [];

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          if (particles[i].position.x === particles[j].position.x && particles[i].position.y === particles[j].position.y && particles[i].position.z === particles[j].position.z) {
            collisions.push(pointToKey(particles[i].position));
          }
        }
      }

      particles = particles.filter((particle) => !collisions.includes(pointToKey(particle.position)));
      counts.unshift(particles.length);
    }

    return particles.length;
  }
}
