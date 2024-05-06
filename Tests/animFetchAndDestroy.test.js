const { removeAnims } = require('../LoadingAnimation/animFetchAndDestroy');

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
