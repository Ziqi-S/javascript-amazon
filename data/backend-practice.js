//create a new HTTP message to send to the backend
const xhr = new XMLHttpRequest();

//load -> the response from backend is loaded
xhr.addEventListener('load', () => {
    console.log(xhr.response)
});

xhr.open('GET', 'https://supersimplebackend.dev/products/first');
xhr.send();
