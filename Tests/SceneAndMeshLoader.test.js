// Mock BABYLON namespace
global.BABYLON = {
    Animation: {
        AllowMatricesInterpolation: false
    },
    Engine: class {
        constructor(canvas, options, babylon) {
            this._canvas = canvas;
            this._options = options;
            this._babylon = babylon;
            this.disableManifestCheck = true;
        }
    },
    Scene: class {
        constructor(engine) {
            this._engine = engine;
            this.onBeforeRenderObservable = {
                add: () => {},
                clear: () => {}
            };
        }
    },
    Vector3: class {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
    },
    HemisphericLight: class {
        constructor(name, direction) {
            this.name = name;
            this.direction = direction;
        }
    },
};
const { createScene } = require('../LoadingAnimation/SceneAndMeshLoader');
const { JSDOM } = require('jsdom');

test('should create a scene and engine', async () => {
    // Create a simulated DOM environment using jsdom
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;

    // Mock the canvas and basePathMesh
    const canvas = document.createElement('canvas');

    // Call the createScene function
    const [scene, engine] = await createScene(canvas);

    // Assert that the scene and engine are created successfully
    expect(scene).toBeInstanceOf(BABYLON.Scene);
    expect(engine).toBeInstanceOf(BABYLON.Engine);
});
