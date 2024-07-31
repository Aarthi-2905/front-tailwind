export async function editUser(currentRowData){
    const response = await fetch('http://localhost:8000/edit_users',{
        method : 'PUT',
        headers : {
            'content-type' : 'application/json'
        },
        body : JSON.stringify(currentRowData),
    });

    if(!response){
        console.log('Network response not ok');
        return;
    }

    const data = await response.json();
    return data;
}

export async function fetchUsers() {
    const response = await fetch('http://localhost:8000/users'); 
    if (!response) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data['detail'];
}

export async function deleteUser(email){
    const response = await fetch('http://localhost:8000/user_delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    return data;
}