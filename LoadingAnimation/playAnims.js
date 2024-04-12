var playAnims = async function(scene, loadedResults) {
    if (!scene) {
        console.error("Scene is undefined. Unable to play animations.");
        return;
    } else if (!loadedResults) {
        console.error("loadedResults is undefined. Unable to play animations.");
        return;
    } else if (!loadedResults.animationGroups || loadedResults.animationGroups.length === 0) {
        console.error("No animations found. Unable to play animations.");
        return;
    }

    // Use a loop instead of forEach to await on each animation play
    for (let animationGroup of loadedResults.animationGroups) {
        // Await a promise that resolves when the animation ends
        await new Promise((resolve) => {
            animationGroup.onAnimationEndObservable.addOnce(() => {
                resolve(); 
            });

            animationGroup.start(false, 1.0, animationGroup.from, animationGroup.to);
Hm
    }
};
