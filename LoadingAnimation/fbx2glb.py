import aspose.threed as a3d

scene = a3d.Scene.from_file("AAP.fbx")
scene.save("Output.glb")