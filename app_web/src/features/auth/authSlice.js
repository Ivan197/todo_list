import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const token = localStorage.getItem('token'); 
// Variables para almacenar los datos del usuario autenticado
let id_user = null;
let username = null;
let lastname = null;
let name = null;
let isAuthenticated = false;

if (token) {
  try {
    const decoded = jwtDecode(token); // Decodifica el JWT
    const currentTime = Date.now() / 1000;

    if (decoded.exp > currentTime) {
      id_user = decoded.id;
      username = decoded.username;
      name = decoded.name;
      lastname = decoded.lastname;
      isAuthenticated = true;
    } else {
      localStorage.removeItem('token'); // token expirado
    }

  } catch (error) {
    localStorage.removeItem('token');
  }
}

const initialState = {
  id_user,
  username,
  lastname,
  name,
  token,
  isAuthenticated,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => { //actualiza el estado con los datos del usuario y guarda el token.
      state.id_user = action.payload.id_user;
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.lastname = action.payload.lastname;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {// Limpia todos los datos del usuario del estado y borra el token del almacenamiento.
      state.id_user = null;
      state.username = null;
      state.name = null;
      state.lastname = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;