import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, LogOut, UserPlus, Pencil, Trash2, Search, Users, Mail, Calendar, CheckCircle2, XCircle, Clock, Filter } from 'lucide-react';

interface Message {
  id: number;
  Name: string;
  Email: string;
  Subject: string;
  Message: string;
  Message_date: string;
}

interface Appointment {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  date_joined: string;
}

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    isStaff: true
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editUserForm, setEditUserForm] = useState({
    username: '',
    email: '',
    password: '',
    is_staff: true
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageSearchTerm, setMessageSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<number | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<number | null>(null);
  const [deleteAppointmentDialogOpen, setDeleteAppointmentDialogOpen] = useState(false);
  const [deleteMessageDialogOpen, setDeleteMessageDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; type: 'appointment' | 'message' } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get CSRF token
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = csrfResponse.headers.get('X-CSRFToken');
      const authToken = localStorage.getItem('authToken');

      // Fetch messages
      const messagesResponse = await fetch('http://localhost:8000/api/messages/', {
        headers: {
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include'
      });
      const messagesData = await messagesResponse.json();
      setMessages(messagesData);

      // Fetch appointments
      const appointmentsResponse = await fetch('http://localhost:8000/api/appointments/', {
        headers: {
          'X-CSRFToken': csrfToken || '',
        },
        credentials: 'include'
      });
      const appointmentsData = await appointmentsResponse.json();
      setAppointments(appointmentsData);

      // Fetch users
      const usersResponse = await fetch('http://localhost:8000/api/users/', {
        headers: {
          'X-CSRFToken': csrfToken || '',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include'
      });
      const usersData = await usersResponse.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      setUpdatingStatus(appointmentId);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      // Get CSRF token
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = csrfResponse.headers.get('X-CSRFToken');

      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/status/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update status');
      }

      // Update the appointment locally first for immediate feedback
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      
      toast({
        title: "Status Updated",
        description: "Appointment status has been updated successfully.",
      });

      // Refresh data in the background
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update appointment status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    
    if (newUser.password !== newUser.confirmPassword) {
      setFormErrors({ confirmPassword: 'Passwords do not match' });
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get CSRF token
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = csrfResponse.headers.get('X-CSRFToken');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          is_staff: newUser.isStaff
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setFormErrors(data.errors);
        }
        throw new Error(data.message || 'Failed to create user');
      }

      toast({
        title: "Success",
        description: "User created successfully!",
      });

      setNewUser({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        isStaff: true
      });
      setFormErrors({});
      
      // Refresh the users list
      fetchData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/admin-login');
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = csrfResponse.headers.get('X-CSRFToken');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${editingUser.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken || '',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(editUserForm),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setFormErrors(data.errors);
        }
        throw new Error(data.message || 'Failed to update user');
      }

      toast({
        title: "Success",
        description: "User updated successfully!",
      });

      setEditDialogOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
      });
      const csrfToken = csrfResponse.headers.get('X-CSRFToken');
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/users/${userToDelete.id}/delete/`, {
        method: 'DELETE',
        headers: {
          'X-CSRFToken': csrfToken || '',
          'Authorization': `Token ${authToken}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete user');
      }

      toast({
        title: "Success",
        description: "User deleted successfully!",
      });

      setDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setEditUserForm({
      username: user.username,
      email: user.email,
      password: '', // Empty password field for editing
      is_staff: user.is_staff
    });
    setEditDialogOpen(true);
  };

  const openUserDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const openDeleteDialog = (id: number, type: 'appointment' | 'message') => {
    setItemToDelete({ id, type });
    if (type === 'appointment') {
      setDeleteAppointmentDialogOpen(true);
    } else {
      setDeleteMessageDialogOpen(true);
    }
  };

  // Filter functions
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = (
      appointment.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages.filter(message =>
    message.Name.toLowerCase().includes(messageSearchTerm.toLowerCase()) ||
    message.Subject.toLowerCase().includes(messageSearchTerm.toLowerCase()) ||
    message.Email.toLowerCase().includes(messageSearchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const getStatistics = () => {
    const totalAppointments = appointments.length;
    const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
    const totalMessages = messages.length;
    const totalUsers = users.length;

    return { totalAppointments, pendingAppointments, totalMessages, totalUsers };
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = getStatistics();

  const handleDeleteAppointment = async (appointmentId: number) => {
    try {
      setDeletingAppointment(appointmentId);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      // Get CSRF token
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      
      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token');
      }

      // Try to get CSRF token from cookie if not in headers
      let csrfToken = csrfResponse.headers.get('X-CSRFToken');
      if (!csrfToken) {
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
        csrfToken = csrfCookie ? csrfCookie.split('=')[1] : null;
      }

      if (!csrfToken) {
        throw new Error('No CSRF token available. Please refresh the page and try again.');
      }

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${authToken}`,
      };

      // Log request details for debugging
      console.log('Deleting appointment with ID:', appointmentId);
      console.log('Request headers:', headers);

      // Make the DELETE request to the specific appointment endpoint
      const response = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      // Log response details for debugging
      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', Object.fromEntries(response.headers.entries()));

      // For successful DELETE requests, the response should be 204 No Content
      if (response.status === 204) {
        // Remove the appointment locally
        setAppointments(prevAppointments =>
          prevAppointments.filter(appointment => appointment.id !== appointmentId)
        );
        
        toast({
          title: "Success",
          description: "Appointment has been deleted successfully.",
        });

        setDeleteAppointmentDialogOpen(false);
        return;
      }

      // If not 204, check for error response
      let errorMessage = 'Failed to delete appointment';
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          const errorData = await response.json() as ApiErrorResponse;
          errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }

      throw new Error(`${errorMessage} (Status: ${response.status})`);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to delete appointment. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeletingAppointment(null);
      setItemToDelete(null);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    try {
      setDeletingMessage(messageId);
      const authToken = localStorage.getItem('authToken');

      if (!authToken) {
        toast({
          title: "Error",
          description: "You are not authenticated. Please login again.",
          variant: "destructive",
        });
        navigate('/admin-login');
        return;
      }

      // Get CSRF token
      const csrfResponse = await fetch('http://localhost:8000/api/csrf/', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Token ${authToken}`,
        },
      });
      
      if (!csrfResponse.ok) {
        throw new Error('Failed to get CSRF token');
      }

      // Try to get CSRF token from cookie if not in headers
      let csrfToken = csrfResponse.headers.get('X-CSRFToken');
      if (!csrfToken) {
        const cookies = document.cookie.split(';');
        const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
        csrfToken = csrfCookie ? csrfCookie.split('=')[1] : null;
      }

      if (!csrfToken) {
        throw new Error('No CSRF token available. Please refresh the page and try again.');
      }

      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${authToken}`,
      };

      // Log request details for debugging
      console.log('Deleting message with ID:', messageId);
      console.log('Request headers:', headers);

      // Make the DELETE request to the specific message endpoint
      const response = await fetch(`http://localhost:8000/api/messages/${messageId}/`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      // Log response details for debugging
      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', Object.fromEntries(response.headers.entries()));

      // For successful DELETE requests, the response should be 204 No Content
      if (response.status === 204) {
        // Remove the message locally
        setMessages(prevMessages =>
          prevMessages.filter(message => message.id !== messageId)
        );
        
        toast({
          title: "Success",
          description: "Message has been deleted successfully.",
        });

        setDeleteMessageDialogOpen(false);
        return;
      }

      // If not 204, check for error response
      let errorMessage = 'Failed to delete message';
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          const errorData = await response.json() as ApiErrorResponse;
          errorMessage = errorData.error || errorData.message || errorData.detail || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
      }

      throw new Error(`${errorMessage} (Status: ${response.status})`);
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Failed to delete message. Please check your connection and try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setDeletingMessage(null);
      setItemToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Panel</h1>
          <div className="flex gap-4">
            <Button onClick={fetchData} variant="outline" size="icon" className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleLogout} variant="destructive" size="icon" className="hover:bg-red-600 transition-colors">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalAppointments}</div>
              <p className="text-xs text-slate-500">
                {stats.pendingAppointments} pending
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <Mail className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.totalMessages}</div>
              <p className="text-xs text-slate-500">
                From contact form
              </p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{stats.totalUsers}</div>
              <p className="text-xs text-slate-500">
                System users
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-900 p-1 rounded-lg">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-slate-800">Appointments</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-slate-800">Messages</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-slate-800">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Appointments</CardTitle>
                <CardDescription className="text-slate-500">Manage patient appointments and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 transition-shadow"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                      <Filter className="h-4 w-4 mr-2 text-slate-400" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ScrollArea className="h-[400px] rounded-lg border border-slate-200 dark:border-slate-700">
                  {loading ? (
                    <div className="text-center py-4 text-slate-500">Loading appointments...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Service</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Time</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAppointments.map((appointment) => (
                          <TableRow key={appointment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <TableCell className="font-medium">
                              {`${appointment.firstName} ${appointment.lastName}`}
                              <div className="text-sm text-slate-500">
                                {appointment.email}
                              </div>
                            </TableCell>
                            <TableCell>{appointment.service}</TableCell>
                            <TableCell>{appointment.preferredDate}</TableCell>
                            <TableCell>{appointment.preferredTime}</TableCell>
                            <TableCell>
                              <Badge className={`${getStatusColor(appointment.status)} font-medium px-3 py-1`}>
                                {appointment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Select
                                  value={appointment.status}
                                  onValueChange={(value) => handleStatusChange(appointment.id, value)}
                                  disabled={updatingStatus === appointment.id}
                                >
                                  <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900">
                                    {updatingStatus === appointment.id ? (
                                      <div className="flex items-center">
                                        <div className="animate-spin w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full mr-2" />
                                        Updating...
                                      </div>
                                    ) : (
                                      <SelectValue placeholder="Update status" />
                                    )}
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 inline text-yellow-500" />
                                        Pending
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                      <div className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 inline text-green-500" />
                                        Confirmed
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                      <div className="flex items-center">
                                        <XCircle className="h-4 w-4 mr-2 inline text-red-500" />
                                        Cancelled
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="completed">
                                      <div className="flex items-center">
                                        <CheckCircle2 className="h-4 w-4 mr-2 inline text-blue-500" />
                                        Completed
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {appointment.status === 'completed' && (
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => openDeleteDialog(appointment.id, 'appointment')}
                                    disabled={deletingAppointment === appointment.id}
                                    className="hover:bg-red-600 transition-colors"
                                  >
                                    {deletingAppointment === appointment.id ? (
                                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                )}

                             
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Messages</CardTitle>
                <CardDescription className="text-slate-500">View messages from the contact form.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search messages..."
                      value={messageSearchTerm}
                      onChange={(e) => setMessageSearchTerm(e.target.value)}
                      className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 transition-shadow"
                    />
                  </div>
                </div>

                <ScrollArea className="h-[400px] rounded-lg border border-slate-200 dark:border-slate-700">
                  {loading ? (
                    <div className="text-center py-4 text-slate-500">Loading messages...</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-slate-800">
                          <TableHead className="font-semibold">Name</TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">Subject</TableHead>
                          <TableHead className="font-semibold">Message</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMessages.map((message) => (
                          <TableRow key={message.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <TableCell className="font-medium">{message.Name}</TableCell>
                            <TableCell>{message.Email}</TableCell>
                            <TableCell>{message.Subject}</TableCell>
                            <TableCell>
                              <div className="max-w-[300px] truncate">
                                {message.Message}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-between">
                                <div>{new Date(message.Message_date).toLocaleDateString()}</div>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => openDeleteDialog(message.id, 'message')}
                                  disabled={deletingMessage === message.id}
                                  className="hover:bg-red-600 transition-colors ml-2"
                                >
                                  {deletingMessage === message.id ? (
                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Manage Users</CardTitle>
                <CardDescription className="text-slate-500">Add, edit, or remove system users.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <form onSubmit={handleCreateUser} className="space-y-4 p-6 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 shadow-sm">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Create New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-slate-700 dark:text-slate-300">Username</Label>
                        <Input
                          id="username"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          required
                          className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow ${formErrors.username ? "border-red-500" : ""}`}
                        />
                        {formErrors.username && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.username}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          required
                          className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow ${formErrors.email ? "border-red-500" : ""}`}
                        />
                        {formErrors.email && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          required
                          className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow ${formErrors.password ? "border-red-500" : ""}`}
                        />
                        {formErrors.password && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-700 dark:text-slate-300">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={newUser.confirmPassword}
                          onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                          required
                          className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow ${formErrors.confirmPassword ? "border-red-500" : ""}`}
                        />
                        {formErrors.confirmPassword && (
                          <p className="text-sm text-red-500 mt-1">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                    <Button type="submit" className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create User
                    </Button>
                  </form>

                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Existing Users</h3>
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search users..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow"
                        />
                      </div>
                    </div>
                    
                    <ScrollArea className="h-[400px] rounded-lg border border-slate-200 dark:border-slate-700">
                      {loading ? (
                        <div className="text-center py-4 text-slate-500">Loading users...</div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50 dark:bg-slate-800">
                              <TableHead className="font-semibold">Username</TableHead>
                              <TableHead className="font-semibold">Email</TableHead>
                              <TableHead className="font-semibold">Role</TableHead>
                              <TableHead className="font-semibold">Joined Date</TableHead>
                              <TableHead className="font-semibold">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                <TableCell className="font-medium text-slate-900 dark:text-slate-100">{user.username}</TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400">{user.email}</TableCell>
                                <TableCell>
                                  <Badge variant={user.is_staff ? "default" : "secondary"} className={user.is_staff ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-800"}>
                                    {user.is_staff ? 'Admin' : 'User'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 dark:text-slate-400">{new Date(user.date_joined).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => openEditDialog(user)}
                                      className="hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-slate-800"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="icon"
                                      onClick={() => openUserDeleteDialog(user)}
                                      className="hover:bg-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Edit User</DialogTitle>
              <DialogDescription className="text-slate-500">
                Make changes to the user account. Leave password empty to keep the current password.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username" className="text-slate-700 dark:text-slate-300">Username</Label>
                  <Input
                    id="edit-username"
                    value={editUserForm.username}
                    onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                    required
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-slate-700 dark:text-slate-300">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    required
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-password" className="text-slate-700 dark:text-slate-300">New Password (optional)</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    value={editUserForm.password}
                    onChange={(e) => setEditUserForm({ ...editUserForm, password: e.target.value })}
                    placeholder="Leave empty to keep current password"
                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 transition-shadow"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">Role</Label>
                  <Select
                    value={editUserForm.is_staff ? "admin" : "user"}
                    onValueChange={(value) => setEditUserForm({ ...editUserForm, is_staff: value === "admin" })}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white transition-colors">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete User Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500">
                This action cannot be undone. This will permanently delete the user
                account and remove their data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Appointment Confirmation Dialog */}
        <AlertDialog open={deleteAppointmentDialogOpen} onOpenChange={setDeleteAppointmentDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                Delete Appointment
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500">
                Are you sure you want to delete this appointment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
                onClick={() => {
                  setDeleteAppointmentDialogOpen(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                onClick={() => itemToDelete?.id && handleDeleteAppointment(itemToDelete.id)}
                disabled={deletingAppointment !== null}
              >
                {deletingAppointment !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Message Confirmation Dialog */}
        <AlertDialog open={deleteMessageDialogOpen} onOpenChange={setDeleteMessageDialogOpen}>
          <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                Delete Message
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500">
                Are you sure you want to delete this message? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
                onClick={() => {
                  setDeleteMessageDialogOpen(false);
                  setItemToDelete(null);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                onClick={() => itemToDelete?.id && handleDeleteMessage(itemToDelete.id)}
                disabled={deletingMessage !== null}
              >
                {deletingMessage !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Deleting...
                  </div>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminPanel;