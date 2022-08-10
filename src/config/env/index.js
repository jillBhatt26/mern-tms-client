const NODE_ENV = 'development';

let BE_URL = 'https://mern-tms-server.herokuapp.com';

if (NODE_ENV === 'development') {
    BE_URL = 'http://localhost:5000';
}

export default BE_URL;
