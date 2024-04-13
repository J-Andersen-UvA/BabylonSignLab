function updateFingerRotations(skeleton, time) {
    const speed = 0.0005; // Speed of change
    const amplitude = 0.2; // Range of rotation in radians

    // Example for one finger bone
    const fingerBoneNames = ["bone_finger1", "bone_finger2", "bone_finger3"]; // List of your finger bone names
    
    
    
    fingerBoneNames.forEach(boneName => {
        const bone = skeleton.bones.find(b => b.name === boneName);
        if (bone) {
            // Generate noise-based rotation value
            const noiseValue = noise.noise2D(boneName, time * speed) * amplitude;
            bone.setRotationQuaternion(BABYLON.Quaternion.RotationYawPitchRoll(noiseValue, 0, 0));
        }
    });
}