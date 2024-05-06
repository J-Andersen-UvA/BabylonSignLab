/*
    Function: retargetAnimWithBlendshapes

    Description:
    This function takes a target mesh and an animation group and retargets the animation group
    to the target mesh. Most importantly, it will also retarget the animation group to the blendshapes
    which babylon does not do by default.

    Parameters:
    - targetMeshAsset: The mesh to retarget the animation to.
    - animGroup: The animation group to retarget.
    - cloneName: The name of the cloned animation group.

    Returns:
    Void, but the animation group will be retargeted to the target mesh.
    And we are able to play this animation group on the target mesh through the scene object.
*/
function retargetAnimWithBlendshapes(targetMeshAsset, animGroup, cloneName = "anim") {
    console.log("Retargeting animation to target mesh...");

    var morphName = null;
    var curMTM = 0;
    var morphIndex = 0;
    return animGroup.clone("anim", (target) => {
        // First set all bone targets to the linkedTransformNode
        let idx = targetMeshAsset.skeletons[0].getBoneIndexByName(target.name);
        var targetBone = targetMeshAsset.skeletons[0].bones[idx];
        if (targetBone) {
            return targetBone._linkedTransformNode;
        }

        // Iterate over morphManagers if we don't have a new morph target
        // Otherwise reset the index
        if (morphName !== target.name) {
            curMTM = 0;
            morphName = target.name;
        }

        // If we don't have bones anymore, we can assume we are in the morph target section
        morphIndex = getMorphTargetIndex(targetMeshAsset.morphTargetManagers[curMTM], target.name);
        let mtm = targetMeshAsset.morphTargetManagers[curMTM].getTarget(morphIndex);
        curMTM++;

        return mtm;
    });
}

// Helper function to get the morph target index, since babylon only provides
// morph targets through the index. Which follow GLTF standards but is not useful for us.
function getMorphTargetIndex(morphTargetManager, targetName) {
    for (var i = 0; i < morphTargetManager.numTargets; i++) {
        if (morphTargetManager.getTarget(i).name === targetName) {
            return i;
        }
    }

    return -1;
}