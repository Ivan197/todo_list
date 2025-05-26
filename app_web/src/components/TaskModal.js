// src/components/TaskModal.jsx
import React, { useEffect, useState } from 'react';
import './TaskModal.css';

/**
 * Componente reutilizable de modal para crear o editar tareas.
 *
 * Props:
 * - isOpen (boolean): Indica si el modal está visible.
 * - onClose (function): Función que se ejecuta al cerrar el modal.
 * - onSubmit (function): Función que se ejecuta al enviar el formulario.
 * - initialData (object): Datos iniciales para el formulario (modo edición).
 * - isEditMode (boolean): Indica si el campo "estado" debe estar habilitado.
 * - mode (string): Determina si el modal está en modo 'create' o 'edit'.
 */
const TaskModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode = {}, mode = 'create' }) => {
  // Estado local para los datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status_id: 1,
  });

  useEffect(() => {
    if (initialData) {
        setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        status_id: initialData.status_id || 1,
        });
    } else {
        // limpia el formulario cuando es modo "crear"
        setFormData({
        title: "",
        description: "",
        status_id: 1,
        });
    }
  }, [initialData]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null; // Si el modal no está abierto, no renderiza nada

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{mode === 'edit' ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
        <form onSubmit={handleSubmit}>
          <label>Título:</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <label>Estado:</label>
          <select
            name="status_id"
            value={formData.status_id}
            onChange={handleChange}
            disabled={!isEditMode}
          >
            <option value="1">Pendiente</option>
            <option value="2">En Progreso</option>
            <option value="3">Completada</option>
          </select>
          <div className="modal-actions">
            <button type="submit">
              {mode === 'edit' ? 'Actualizar' : 'Guardar'}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
