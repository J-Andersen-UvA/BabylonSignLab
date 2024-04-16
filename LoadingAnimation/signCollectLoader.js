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

