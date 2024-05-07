// Import the necessary dependencies
const { retargetAnimWithBlendshapes, getMorphTargetIndex } = require('../LoadingAnimation/retargetAnims');

describe('retargetAnimWithBlendshapes', () => {
    // Mock targetMeshAsset and animGroup objects
    let targetMeshAsset;
    let animGroup;

    beforeEach(() => {
        // Initialize targetMeshAsset and animGroup objects
        targetMeshAsset = {
            skeletons: [{
                bones: [{
                    name: 'targetBoneName',
                    _linkedTransformNode: {}
                }]
            }],
            morphTargetManagers: [{ getTarget: jest.fn() }]
        };
        animGroup = { clone: jest.fn() };
    });

    test('should retarget animation to target mesh successfully', () => {
        // Mock the clone method of animGroup
        const mockClone = jest.fn((cloneName, callback) => {
            const target = { name: 'targetBoneName' };
            return callback(target);
        });
        animGroup.clone.mockImplementation(mockClone);

        // Mock getBoneIndexByName method
        targetMeshAsset.skeletons[0].getBoneIndexByName = jest.fn(() => 0);

        // Call the retargetAnimWithBlendshapes function
        retargetAnimWithBlendshapes(targetMeshAsset, animGroup);

        // Assert that the clone method of animGroup is called with the correct arguments
        expect(mockClone).toHaveBeenCalledWith('anim', expect.any(Function));

        // Assert that the callback function correctly returns the linkedTransformNode
        expect(mockClone.mock.results[0].value).toBe(targetMeshAsset.skeletons[0].bones[0]._linkedTransformNode);
    });

    test('should handle morph target section', () => {
        // Mock the clone method of animGroup
        const mockClone = jest.fn((cloneName, callback) => {
            const target = { name: 'morphTargetName' };
            return callback(target);
        });

        const mockMorphManager = {
            // getTarget takes an integer as an argument, and returns an object with a name property
            getTarget: jest.fn((val) => ({ name: 'targetMorphName' })),
            numTargets: 1
        };
        animGroup.clone.mockImplementation(mockClone);

        // if res is not 'targetMorphName', then the function is not working correctly
        expect(getMorphTargetIndex(mockMorphManager, "targetMorphName")).toBe(0);

        // Call the actual getMorphTargetIndex function
        expect(getMorphTargetIndex(mockMorphManager, "nonExistingName")).toBe(-1);
    });

    // Add more test cases to cover edge cases and error scenarios
});
