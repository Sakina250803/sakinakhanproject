import React, { useState, useEffect } from 'react';
import { getRooms, addRoom, updateRoom, deleteRoom } from '../api/endpoints';
import RoomForm from '../components/RoomForm';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      if (response.data.success) {
        setRooms(response.data.rooms);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (roomData) => {
    try {
      const response = await addRoom(roomData);
      if (response.data.success) {
        setRooms([...rooms, response.data.room]);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleUpdateRoom = async (roomData) => {
    try {
      const response = await updateRoom(editingRoom._id, roomData);
      if (response.data.success) {
        setRooms(rooms.map(room => 
          room._id === editingRoom._id ? response.data.room : room
        ));
        setShowForm(false);
        setEditingRoom(null);
      }
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const response = await deleteRoom(id);
        if (response.data.success) {
          setRooms(rooms.filter(room => room._id !== id));
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return { backgroundColor: '#dcfce7', color: '#166534' };
      case 'Booked': return { backgroundColor: '#fee2e2', color: '#991b1b' };
      case 'Maintenance': return { backgroundColor: '#fef3c7', color: '#92400e' };
      default: return { backgroundColor: '#f3f4f6', color: '#374151' };
    }
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          <div style={styles.loadingBar}></div>
          <div style={styles.loadingTable}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={styles.loadingRow}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Room Management</h1>
        <button
          onClick={() => setShowForm(true)}
          style={styles.addButton}
        >
          Add New Room
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Room Number</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} style={styles.tr}>
                <td style={styles.td}>{room.roomNumber}</td>
                <td style={styles.td}>{room.type}</td>
                <td style={styles.td}>${room.price}</td>
                <td style={styles.td}>
                  <span style={{...styles.badge, ...getStatusColor(room.status)}}>
                    {room.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button
                    onClick={() => {
                      setEditingRoom(room);
                      setShowForm(true);
                    }}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(room._id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <RoomForm
          room={editingRoom}
          onSubmit={editingRoom ? handleUpdateRoom : handleAddRoom}
          onCancel={() => {
            setShowForm(false);
            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '1px solid #e5e7eb',
    fontSize: '14px'
  },
  tr: {
    borderBottom: '1px solid #e5e7eb'
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb'
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  editButton: {
    color: '#2563eb',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginRight: '10px'
  },
  deleteButton: {
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer'
  },
  loading: {
    opacity: 0.6
  },
  loadingBar: {
    height: '32px',
    backgroundColor: '#e5e7eb',
    borderRadius: '5px',
    width: '25%',
    marginBottom: '20px'
  },
  loadingTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  loadingRow: {
    height: '50px',
    backgroundColor: '#e5e7eb',
    borderRadius: '5px'
  }
};

export default Rooms;