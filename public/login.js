async function sendDataToServer(loginValue, passValue) {
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login: loginValue, password: passValue })
        })
        console.log(response);
        return response.text();
    } catch (e) {
        console.log(e);
        throw e;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("button").addEventListener("click", async () => {
        const loginValue = document.getElementById("username").value
        const passValue = document.getElementById("password").value
        try {
            const response = await sendDataToServer(loginValue, passValue)
            console.log(response)
        } catch (err) {
            console.log(err)
        }
    })
})
