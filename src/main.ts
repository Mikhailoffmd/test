import { Application } from 'pixi.js';
import { SceneManager } from './core/SceneManager';
import { FpsCounter } from './core/FpsCounter';
import { MenuSceneController } from './scenes/menu/MenuSceneController';
import { AceOfShadowsSceneController } from './scenes/aceOfShadows/AceOfShadowsSceneController';
import { MagicWordsController } from './scenes/magicWords/MagicWordsSceneController';
import { PhoenixFlameController } from './scenes/phoenixFlame/PhoenixFlameController';

/**
 * Application entry point.
 * Initializes a full-screen PixiJS application with scene management,
 * an FPS counter, and responsive resizing.
 */
async function main(): Promise<void> {
  const app = new Application();

  await app.init({
    background: '#cccccc',
    resizeTo: window,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.body.appendChild(app.canvas);

  app.stage.sortableChildren = true;

  // Scene management
  const sceneManager = new SceneManager(app);

  // FPS counter (always on top)
  const fpsCounter = new FpsCounter();
  fpsCounter.container.zIndex = 9999;
  app.stage.addChild(fpsCounter.container);

  // Navigation handler — creates scenes on demand
  const navigateTo = async (sceneName: string): Promise<void> => {
    const goBack = () => navigateTo('menu');

    switch (sceneName) {
      case 'menu':
        await sceneManager.switchTo(new MenuSceneController(navigateTo));
        break;
      case 'aceOfShadows':
        await sceneManager.switchTo(new AceOfShadowsSceneController(goBack));
        break;
      case 'magicWords':
        await sceneManager.switchTo(new MagicWordsController(goBack));
        break;
      case 'phoenixFlame':
        await sceneManager.switchTo(new PhoenixFlameController(goBack));
        break;
    }
  };

  // Handle window resize
  window.addEventListener('resize', () => {
    sceneManager.resize(window.innerWidth, window.innerHeight);
  });

  // Main update loop
  app.ticker.add((ticker) => {    
    const dt = ticker.deltaTime / 60; // Convert to seconds
    fpsCounter.update(dt);
    sceneManager.update(dt);    
  });

  // Start at menu
  await navigateTo('menu');
}

main().catch(console.error);
