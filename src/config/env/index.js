const NODE_ENV = 'production';

let BE_URL = 'http://159.65.145.66/api';

if (NODE_ENV === 'development') {
    BE_URL = 'http://localhost:5000';
}

export default BE_URL;
