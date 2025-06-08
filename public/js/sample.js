async function getData(url) {
    try {
        const response = await fetch(url); // Replace URL
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

