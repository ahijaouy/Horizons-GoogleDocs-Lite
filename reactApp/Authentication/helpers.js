import axios from 'axios';


export function login(username, password) {
  return axios.post('http://localhost:3000/login', {
    username,
    password
  });
}

export function register(username, password, name) {
  return axios.post('http://localhost:3000/register', {
    username,
    password,
    name
  });
}