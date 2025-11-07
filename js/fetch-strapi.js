const STRAPI_URL = 'https://meaningful-cow-f24113ac1c.strapiapp.com'; 
const SINGLE_TYPE_ENDPOINT = 'court-bat';

// ... ส่วนที่เหลือของโค้ด fetch ... 
const url = `${STRAPI_URL}/api/${SINGLE_TYPE_ENDPOINT}?populate=*`;

async function fetchCourtBatData() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching court-bat data:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchCourtBatData().then(data => {
        // Display the Name in the console
        if (data && data.data && data.data.Name) {
            console.log('Name:', data.data.Name);
            document.getElementById('court-bat-name').textContent = data.data.Name;
        } else {
            console.error('Name not found in the fetched data');
        }
    });
});