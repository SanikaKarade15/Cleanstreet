import React, { useState, useEffect } from 'react';
import { adminAPI, paymentAPI } from '../../services/api';
import { toast } from 'react-toastify';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllPayments();
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
      // Mock data for demo
      setPayments([
        { 
          id: 1, 
          booking: { id: 1, user: { name: 'John Doe' }, drone: { model: 'Mavic 3 Pro' } },
          amountPaid: 75.0,
          paymentMethod: 'UPI',
          paymentDate: '2024-01-15T10:30:00',
          paymentStatus: 'PAID'
        },
        { 
          id: 2, 
          booking: { id: 2, user: { name: 'Jane Smith' }, drone: { model: 'Air 2S' } },
          amountPaid: 54.0,
          paymentMethod: 'CARD',
          paymentDate: '2024-01-14T14:15:00',
          paymentStatus: 'PAID'
        },
        { 
          id: 3, 
          booking: { id: 3, user: { name: 'Bob Wilson' }, drone: { model: 'EVO II' } },
          amountPaid: 88.0,
          paymentMethod: 'CASH',
          paymentDate: '2024-01-13T09:45:00',
          paymentStatus: 'PENDING'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (payment) => {
    if (window.confirm(`Are you sure you want to delete payment #${payment.id}?`)) {
      try {
        await paymentAPI.delete(payment.id);
        toast.success('Payment deleted successfully');
        fetchPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
        toast.error('Failed to delete payment');
      }
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.booking.drone.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.paymentStatus === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PAID': { class: 'badge bg-success', text: 'Paid' },
      'PENDING': { class: 'badge bg-warning', text: 'Pending' },
      'FAILED': { class: 'badge bg-danger', text: 'Failed' },
      'REFUNDED': { class: 'badge bg-info', text: 'Refunded' }
    };
    const config = statusConfig[status] || { class: 'badge bg-secondary', text: status };
    return <span className={config.class}>{config.text}</span>;
  };

  const getMethodBadge = (method) => {
    const methodConfig = {
      'UPI': { class: 'badge bg-primary', text: 'UPI' },
      'CARD': { class: 'badge bg-info', text: 'Card' },
      'CASH': { class: 'badge bg-success', text: 'Cash' },
      'NET_BANKING': { class: 'badge bg-warning', text: 'Net Banking' }
    };
    const config = methodConfig[method] || { class: 'badge bg-secondary', text: method };
    return <span className={config.class}>{config.text}</span>;
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString();
  };

  const getTotalRevenue = () => {
    return payments
      .filter(payment => payment.paymentStatus === 'PAID')
      .reduce((total, payment) => total + payment.amountPaid, 0);
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
                <i className="fas fa-credit-card me-2"></i>
                Payment Management
              </h4>
              <div className="d-flex align-items-center">
                <span className="me-3">
                  <strong>Total Revenue:</strong> ₹{getTotalRevenue().toFixed(2)}
                </span>
              </div>
            </div>
            <div className="card-body">
              {/* Search and Filters */}
              <div className="row mb-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search payments by user or drone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="REFUNDED">Refunded</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select"
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                  >
                    <option value="all">All Methods</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card</option>
                    <option value="CASH">Cash</option>
                    <option value="NET_BANKING">Net Banking</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <span className="text-muted">
                    {filteredPayments.length} of {payments.length} payments
                  </span>
                </div>
              </div>

              {/* Payments Table */}
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Booking</th>
                      <th>User</th>
                      <th>Drone</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map(payment => (
                      <tr key={payment.id}>
                        <td>#{payment.id}</td>
                        <td>#{payment.booking.id}</td>
                        <td>{payment.booking.user.name}</td>
                        <td>{payment.booking.drone.model}</td>
                        <td>₹{payment.amountPaid}</td>
                        <td>{getMethodBadge(payment.paymentMethod)}</td>
                        <td>{formatDateTime(payment.paymentDate)}</td>
                        <td>{getStatusBadge(payment.paymentStatus)}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-info"
                              title="View Details"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeletePayment(payment)}
                              title="Delete Payment"
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

              {filteredPayments.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-credit-card fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No payments found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage; 