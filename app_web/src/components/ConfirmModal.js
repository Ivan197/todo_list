import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <h3>¿Estás seguro?</h3>
        <p>Esta acción eliminará la tarea permanentemente.</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Sí, eliminar</button>
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
