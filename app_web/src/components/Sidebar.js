import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faSignOutAlt,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  // Obtiene el nombre y apellido del usuario desde el estado de autenticación
  const name = useSelector((state) => state.auth.name);
  const lastname = useSelector((state) => state.auth.lastname);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Función que cierra sesión: despacha la acción logout y redirige al login
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <h2 className="logo">{name} {lastname}</h2>
      <ul>
        <li>
          <a href="/home">
            <FontAwesomeIcon icon={faHome} />
            <span>Inicio</span>
          </a>
        </li>
        <li>
          <a href="/tasks">
            <FontAwesomeIcon icon={faListCheck} />
            <span>Tareas</span>
          </a>
        </li>

        <li>
          <button className="logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar sesión</span>
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;