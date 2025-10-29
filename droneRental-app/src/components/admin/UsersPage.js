import React, { useState, useEffect } from 'react';
import { userAPI, adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import UserModal from './UserModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      // Mock data for demo
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'USER', phone: '+1234567890' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'USER', phone: '+1234567891' },
        { id: 3, name: 'Admin User', email: 'admin@skyfleet.com', role: 'ADMIN', phone: '+1234567892' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      try {
        await userAPI.delete(user.id);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await userAPI.update(editingUser.id, userData);
        toast.success('User updated successfully');
      } else {
        await userAPI.create(userData);
        toast.success('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const badgeClass = role === 'ADMIN' ? 'badge bg-danger' : 'badge bg-primary';
    return <span className={badgeClass}>{role}</span>;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <i className="fas fa-users me-2"></i>
                User Management
              </h4>
              {/* <button className="btn btn-primary" onClick={handleAddUser}>
                <i className="fas fa-plus me-2"></i>
                Add User
              </button> */}
            </div>
            <div className="card-body">
              {/* Search and Filter */}
              <div className="row mb-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">All Roles</option>
                    <option value="USER">Users</option>
                    <option value="ADMIN">Admins</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <span className="text-muted">
                    {filteredUsers.length} of {users.length} users
                  </span>
                </div>
              </div>

              {/* Users Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditUser(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteUser(user)}
                              title="Delete User"
                              disabled={user.role === 'ADMIN'}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-users fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No users found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          show={showModal}
          onHide={() => setShowModal(false)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UsersPage; 