async function signCollectLoader(thema) {
    try {
        const response = await fetch('https://leffe.science.uva.nl:8043/fetch_all.php?limit=10&offset=0&handle=themaFilter&thema=' + thema);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const data = JSON.parse(text);
        console.log(data)
        return data;
    } catch (error) {
        console.error("Failed to load data:", error);
        return null; // or you could throw the error further if you want to handle it outside
    }
}

