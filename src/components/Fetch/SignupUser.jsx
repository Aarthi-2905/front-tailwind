export async function signupUser(username, email, password) {
    const response = await fetch('http://localhost:8000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
        console.log('Signup failed');
    }

    const data = await response.json();
    return data;
}