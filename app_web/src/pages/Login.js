import React, { useState } from "react";
import { useDispatch } from "react-redux"; 
import { loginSuccess } from "../features/auth/authSlice"; // Acción para almacenar el login en el store
import { useNavigate } from "react-router-dom"; // Hook para redireccionar
import axios from "axios"; 
import "./Login.css";

const Auth = () => {
  // Estado para alternar entre login y registro
  const [isLogin, setIsLogin] = useState(true);

  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({ username: "", password: "", name: "", lastname: "", confirmPassword: "" });

  // Estado para mostrar mensajes de error
  const [error, setError] = useState("");

  const dispatch = useDispatch(); // Para usar Redux
  const navigate = useNavigate(); // Para navegar a otra ruta

  // Maneja los cambios de los inputs y actualiza el estado
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja el envío del formulario de inicio de sesión
  const handleLogin = async (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del form
    setError(""); // Limpia errores previos

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        username: formData.username,
        password: formData.password,
      });

      // Si la API responde con error de validación o autorización
      if (res.data.statusCode === 400 || res.data.statusCode === 403) {
        setError(res.data.message); // Muestra el mensaje de error
      } else {
        // Si el login es exitoso, se guarda en Redux y se redirige al home
        dispatch(loginSuccess({ token: res.data.token, user: res.data.user.username }));
        navigate("/home");
      }
    } catch (err) {
      // Error general de red o credenciales
      setError("Usuario o contraseña incorrectos");
    }
  };

  // Maneja el envío del formulario de registro
  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    // Validar que las contraseñas coincidas
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        username: formData.username,
        password: formData.password,
        firstname: formData.name,
        lastname: formData.lastname,
        active: 1
      });

      // Verifica si la API respondió correctamente
      if (res.data.statusCode !== 200) {
        setError(res.data.message || "Error en el registro");
      } else {
        // Registro exitoso: se cambia a la vista de login
        setIsLogin(true);
      }
    } catch (err) {
      setError("Error al registrar usuario");
    }
  };

  return (
    <div className="login-container">
      <div className="login-image" />
      {
        isLogin ? (
          // Formulario de login
          <form className="login-form" onSubmit={handleLogin}>
            {error && <span style={{ color: "red" }}>{error}</span>}
            <h2>Iniciar Sesión</h2>

            <label>Usuario:</label>
            <input
              name="username"
              placeholder="Usuario"
              onChange={handleChange}
              value={formData.username}
              required
            />

            <label>Contraseña:</label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              value={formData.password}
              required
            />
            <button type="submit">Entrar</button>
            <p>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  // Cambia a formulario de registro y limpia errores/datos
                  setError("");
                  setIsLogin(false);
                  setFormData({ username: "", password: "", name: "", lastname: "" });
                }}
              >
                Registrarse
              </button>
            </p>
          </form>
        ) : (
          // Formulario de registro
          <form className="login-form" onSubmit={handleRegister}>
            {error && <span style={{ color: "red" }}>{error}</span>}
            <h2>Registrarse</h2>

            <label>Nombre:</label>
            <input
              name="name"
              placeholder="Nombre"
              onChange={handleChange}
              value={formData.name}
              required
            />

            <label>Apellido:</label>
            <input
              name="lastname"
              placeholder="Apellido"
              onChange={handleChange}
              value={formData.lastname}
              required
            />

            <label>Nombre de Usuario:</label>
            <input
              name="username"
              placeholder="Usuario"
              onChange={handleChange}
              value={formData.username}
              required
            />

            <label>Contraseña:</label>
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              onChange={handleChange}
              value={formData.password}
              required
            />

            <label>Confirmar contraseña:</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Repite la contraseña"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />

            <button type="submit">Registrarse</button>
            <p>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => {
                  // Cambia a formulario de login y limpia errores/datos
                  setError("");
                  setIsLogin(true);
                  setFormData({ username: "", password: "", name: "", lastname: "" });
                }}
              >
                Iniciar sesión
              </button>
            </p>
          </form>
        )
      }
    </div>
  );
};

export default Auth;
