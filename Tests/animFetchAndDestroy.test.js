const { removeAnims, keepOnlyAnimationGroup } = require('../LoadingAnimation/animFetchAndDestroy');

describe('removeAnims', () => {
    // Mock scene and animHolder objects
    let scene;
    let animHolder;

    beforeEach(() => {
        // Initialize scene and animHolder objects
        scene = {
            animationGroups: [],
            stopAnimation: jest.fn()
        };
        animHolder = {
            animationGroups: []
        };
    });

    test('should remove animations successfully', () => {
        // Add some animation groups to the scene and animHolder
        const animationGroup1 = { dispose: jest.fn() };
        const animationGroup2 = { dispose: jest.fn() };
        scene.animationGroups.push(animationGroup1, animationGroup2);
        animHolder.animationGroups.push(animationGroup1, animationGroup2);

        // Call the removeAnims function
        const result = removeAnims(scene, animHolder);

        // Assert that animations are removed from scene and animHolder
        expect(scene.animationGroups).toHaveLength(0);
        expect(animHolder.animationGroups).toHaveLength(0);

        // Assert that dispose method is called on each animation group
        expect(animationGroup1.dispose).toHaveBeenCalled();
        expect(animationGroup2.dispose).toHaveBeenCalled();

        // Assert that the function returns true
        expect(result).toBe(true);
    });

    test('should return false if invalid input parameters', () => {
        // Call the removeAnims function with invalid input parameters
        const result = removeAnims(null, null);

        // Assert that the function returns false
        expect(result).toBe(false);
    });
});

describe('keepOnlyAnimationGroup', () => {
    // Mock data
    let scene, animAsset, loadedMesh;

    const createAnimationGroups = () => [
        { name: 'anim1', dispose: jest.fn() },
        { name: 'anim2', dispose: jest.fn() }
    ];

    beforeEach(() => {
        scene = {
            animationGroups: createAnimationGroups(),
            stopAnimation: jest.fn(),
        };
        animAsset = {
            animationGroups: createAnimationGroups(),
        };
        loadedMesh = {
            animationGroups: createAnimationGroups(),
        };
    });

    it('should keep only the specified animation group in each array', () => {
        expect(scene.animationGroups.length).toBe(2);

        keepOnlyAnimationGroup(scene, animAsset, loadedMesh, 'anim1');

        // Check scene animation groups
        expect(scene.animationGroups.length).toBe(1);
        expect(scene.animationGroups[0].name).toBe('anim1');

        // Check animAsset animation groups
        expect(animAsset.animationGroups.length).toBe(1);
        expect(animAsset.animationGroups[0].name).toBe('anim1');

        // Check loadedMesh animation groups
        expect(loadedMesh.animationGroups.length).toBe(1);
        expect(loadedMesh.animationGroups[0].name).toBe('anim1');
    });

    it('should remove animation groups not matching the specified name', () => {
        keepOnlyAnimationGroup(scene, animAsset, loadedMesh, 'anim2');

        // Check scene animation groups
        expect(scene.animationGroups.length).toBe(1);

        // Check animAsset animation groups
        expect(animAsset.animationGroups.length).toBe(1);
        expect(animAsset.animationGroups[0].name).toBe('anim2');

        // Check loadedMesh animation groups
        expect(loadedMesh.animationGroups.length).toBe(1);
    });

    it('should handle empty animation groups gracefully', () => {
        // Empty animation groups in animAsset
        animAsset.animationGroups = [];

        keepOnlyAnimationGroup(scene, animAsset, loadedMesh, 'anim');

        // Check scene animation groups
        expect(scene.animationGroups.length).toBe(0);

        // Check animAsset animation groups
        expect(animAsset.animationGroups.length).toBe(0);

        // Check loadedMesh animation groups
        expect(loadedMesh.animationGroups.length).toBe(0);
    });
});
