const NODE_ENV = process.env.REACT_APP_NODE_ENV;

let BE_URL;

if (NODE_ENV === 'development') {
    BE_URL = 'http://localhost:5000';
} else if (NODE_ENV === 'production') {
    BE_URL = 'https://mern-tms-server.herokuapp.com';
}

export default BE_URL;
