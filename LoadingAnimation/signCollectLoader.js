async function signCollectLoader(thema, filter, limit) {
    try {

        const response = await fetch(`https://leffe.science.uva.nl:8043/fetch_all.php?limit=${limit}&offset=0&handle=${filter}&thema=` + thema);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const data = JSON.parse(text);
        return data;
    } catch (error) {
        console.error("Failed to load data:", error);
        return null; // or you could throw the error further if you want to handle it outside
    }
}

//load animations from signcollect
async function loadSignCollectLabels(thema, animations, limit = 5) {
    // supress loading from signcollect if we are locally testing
    if (ParamsManager.local == 1) {
        return;
    }

    try {
        if (!thema) {
            thema = "oline" //when no thema, automatically set to oline, it contains 200 NGT glosses taken in april 2024 👌
        }
        var sCArray = await signCollectLoader(thema, "themaFilter", limit); //if you want to know thema names, go to signcollect website and ask Gomer for login
        console.log("loadedMesh animations:", animations);

        for (let i = 0; i < sCArray.length; i++) {
            animations[i] = sCArray[i].glos;
        }
        console.log("Updated animations:", animations);

        return animations;
    } catch (error) {
        // Supress error if we are locally testing
        console.error("Error while loading animations:", error);
    }
}