var playAnims = async function(scene, mesh) {
    if (!scene) {
        console.error("Scene is undefined. Unable to play animations.");
        return;
    }
    else if (!mesh) {
        console.error("Mesh is undefined. Unable to play animations.");
        return;
    }
    else if (!mesh.animationGroups || mesh.animationGroups.length === 0) {
        console.error("No animations found. Unable to play animations.");
        return;
    }

    // Play each animation group
    mesh.animationGroups.forEach(animationGroup => {
        // Start playing the animation
        animationGroup.start(true);
    });
}