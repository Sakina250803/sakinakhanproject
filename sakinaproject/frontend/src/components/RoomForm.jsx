import React, { useState, useEffect } from 'react';

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'Single',
    price: '',
    status: 'Available'
  });

  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        type: room.type,
        price: room.price,
        status: room.status
      });
    }
  }, [room]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>
          {room ? 'Edit Room' : 'Add New Room'}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Room Number</label>
            <input
              type="number"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Room Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Price ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Available">Available</option>
              <option value="Booked">Booked</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitButton}
            >
              {room ? 'Update' : 'Add'} Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '5px',
    fontWeight: '500',
    color: '#374151',
    fontSize: '14px'
  },
  input: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '14px'
  },
  select: {
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '5px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default RoomForm;