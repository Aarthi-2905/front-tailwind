export async function loginUser(email, password) {
    const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ email, password }) 
    });

    if (!response.ok) {
        console.log('Network response not ok');
        return;
    }

    const data = await response.json();
    return data;
}
