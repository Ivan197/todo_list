// src/pages/Tasks.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import TaskModal from "../components/TaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrash, faPencil} from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from '../components/ConfirmModal';
import "./Tasks.css";

const Tasks = () => {
  // Obtener el token desde el estado de Redux para autenticación
  const token = useSelector((state) => state.auth.token);

  // Estados para almacenar las tareas, errores, estado del modal y tarea seleccionada
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false); //mostrar o no modal 
  const [taskToDelete, setTaskToDelete] = useState(null); // guardar tarea a eliminar
  const [toastMessage, setToastMessage] = useState(""); // mensajes al eliminar tarea
  const [isEditMode, setIsEditMode] = useState(false); // identifica si modal esta en crear o editar


  // useEffect para cargar las tareas cuando el componente se monta
  useEffect(() => {
    fetchTasks();
  }, [token]);

  // Función para obtener las tareas del usuario autenticado desde la API
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data.message);

      if (res.data.message === 203) {
        // sin datos
        setError(res.data.message);
        // setTasks([]); // Guardar tareas en el estado
      } else {
        setTasks(res.data.data); // Guardar tareas en el estado
        console.log(res.data.data);
      }
    } catch (err) {
      setError("No se pudieron cargar las tareas");
    }
  };

  // Función para abrir el modal en modo creación
  const handleCreate = () => {
    setSelectedTask(null);
    setIsEditMode(false);
    setModalOpen(true);
  };

  // Función para abrir el modal en modo edición con la tarea seleccionada
  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsEditMode(true);
    setModalOpen(true);
  };

  // Función para manejar el envío del formulario del modal (crear o editar)
  const handleSubmit = async (formData) => {
    try {
      if (selectedTask) {
        // Si hay una tarea seleccionada, actualizamos la tarea existente (modo edición)
        await axios.put(
          `http://localhost:4000/api/tasks/${selectedTask.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Si no hay tarea seleccionada, creamos una nueva (modo creación)
        await axios.post("http://localhost:4000/api/tasks", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Cerrar modal y recargar tareas después de la operación
      setModalOpen(false);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      setError("Error al guardar la tarea");
    }
  };

  const handleDeleteRequest = (taskId) => {
  setTaskToDelete(taskId);
  setShowConfirm(true);
};

// funcion para mostrar modal si desea eliminar la tarea
const confirmDeleteTask = async () => {
  try {
    const res = await axios.delete(`http://localhost:4000/api/tasks/${taskToDelete}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 200) {
      setTasks(prev => prev.filter(task => task.id !== taskToDelete));
      setToastMessage("Tarea eliminada correctamente");
    }
  } catch (err) {
    setToastMessage("Error al eliminar la tarea");
    console.error(err);
  } finally {
    setShowConfirm(false);
    setTaskToDelete(null);
    setTimeout(() => setToastMessage(""), 3000); // mostrar alerta
  }
};

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-content">
        <h1>Mis Tareas</h1>
        <button className="create-btn" onClick={handleCreate}>
          Crear nueva tarea
        </button>

        {error && <p className="error">{error}</p>}

        <table className="tasks-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Descripción</th>
              <th>Fecha de creación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.fecha_hora}</td>
                  <td>{task.status_title}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => handleDeleteRequest(task.id)}>
                      <FontAwesomeIcon icon={faTrash} /><span>Eliminar</span>
                    </button>
                    <button className="action-btn edit" onClick={() => handleEdit(task)}>
                      <FontAwesomeIcon icon={faPencil} /><span>Editar</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay tareas disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Modal para crear o editar tareas */}
        <TaskModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          isEditMode={isEditMode}
          initialData={selectedTask}
          mode={selectedTask ? "edit" : "create"}
        />

        <ConfirmModal
          isOpen={showConfirm}
          onConfirm={confirmDeleteTask}
          onCancel={() => setShowConfirm(false)}
        />

        {toastMessage && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#333",
            color: "white",
            padding: "1rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 1000
          }}>
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
