const NODE_ENV = process.env.REACT_APP_NODE_ENV;

let BE_URL = process.env.REACT_APP_BE_URL;

if (NODE_ENV === 'development') {
    BE_URL = 'http://localhost:5000';
}

export default BE_URL;
