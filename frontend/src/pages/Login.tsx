import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Lock, User } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      console.log('Sending login request...');
      const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({
            username: 'Invalid username or password',
            password: 'Invalid username or password'
          });
          throw new Error('Invalid username or password');
        } else if (response.status === 403) {
          setErrors({
            username: 'This account does not have admin privileges'
          });
          throw new Error('Access denied: This account does not have admin privileges');
        } else if (data.errors) {
          setErrors(data.errors);
          throw new Error(Object.values(data.errors).join(', '));
        }
        throw new Error(data.message || 'Login failed');
      }

      // Verify we got a token
      if (!data.token) {
        throw new Error('No authentication token received');
      }

      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
      console.log('Auth token stored successfully');

      toast({
        title: "Success",
        description: "Login successful!",
      });

      // Redirect to admin panel
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        className={`pl-9 ${errors.username ? 'border-red-500' : ''}`}
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                      {errors.username && (
                        <p className="mt-1 text-sm text-red-500">{errors.username}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className={`pl-9 ${errors.password ? 'border-red-500' : ''}`}
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        disabled={loading}
                      />
                      {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full hover:scale-105 transition-transform duration-300"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login to Admin Panel"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Login; 