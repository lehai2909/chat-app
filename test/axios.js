
import axios from 'axios';
async function handleLogin() {

    // await initiateAuth({
    //   username: email,
    //   password: password,
    //   clientId: import.meta.env.VITE_CLIENT_ID,
    // });
    await axios.post('https://ty9n22xoea.execute-api.ap-southeast-1.amazonaws.com/dev/api/auth', {
        "username": "leensea96@gmail.com",
        "password": "Iambawmim2609!",
        "clientId": "72mbup7jo0vls4gbe5osag0mqu"
    })
        .then(function (response) {
            console.log(response.data.body);
        })
        .catch(function (error) {
            console.log(error);
        });
}
handleLogin();