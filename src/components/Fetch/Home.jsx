export async function authTest(token){
    const response = await fetch('http://localhost:8000/authtest',{
        method : 'POST',
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify({token}) 

    });

    const data = await response.json();
    return data;
}

export async function uploadFile(formData){
    const response = await fetch('http://localhost:8000/upload_file', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('File upload failed');
    }

    const data = await response.json();
    return data;
}

export async function userPrompt(inputText){
    const response = await fetch('http://localhost:8000/user/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "query": inputText }),
    });

    if (!response.ok) {
        throw new Error('Text submission failed');
    }

    const data = await response.json();
    return data;
}