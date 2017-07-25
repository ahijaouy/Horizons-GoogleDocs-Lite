import axios from 'axios';


export function login(username, password) {
  return axios.post('http://localhost:3000/login', {
    username: username,
    password: password
  });
}