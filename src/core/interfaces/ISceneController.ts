import { Application, Container } from 'pixi.js';

/**
 * Base interface for all scenes in the application.
 * Each scene manages its own container and lifecycle.
 */
export interface ISceneController {
  readonly container: Container;
  /** Called once when the scene is first entered */
  init(app: Application): Promise<void>;
  /** Called every frame with delta time in seconds */
  update(dt: number): void;
  /** Called when leaving the scene — clean up resources */
  destroy(): void;
  /** Called when the screen is resized */
  resize(width: number, height: number): void;
}
