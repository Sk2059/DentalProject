import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Lock, User, CheckCircle2, Loader2 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, ENDPOINTS } from '@/lib/api-config';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const fieldRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const validateField = (name: 'username' | 'password', value: string) => {
    const trimmed = value.trim();
    if (name === 'username') {
      if (!trimmed) return '⚠️ Username is required';
      if (trimmed.length < 3) return '⚠️ Username must be at least 3 characters';
      return '';
    }
    if (!trimmed) return '⚠️ Password is required';
    if (trimmed.length < 8) return '⚠️ Password must be at least 8 characters';
    if (!/\d/.test(trimmed)) return '⚠️ Password must include at least one number';
    return '';
  };

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

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== 'username' && name !== 'password') return;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isValidField = (name: 'username' | 'password') =>
    touched[name] && !errors[name] && !!formData[name].trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = {
      username: validateField('username', formData.username),
      password: validateField('password', formData.password),
    };
    setTouched({ username: true, password: true });
    setErrors(nextErrors);
    const firstInvalid = Object.entries(nextErrors).find(([, message]) => message)?.[0];
    if (firstInvalid) {
      const target = fieldRefs.current[firstInvalid];
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.focus();
      return;
    }
    setLoading(true);

    try {
      console.log('Sending login request...');
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.login}`, {
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
            username: t('loginPage.invalidCredentials'),
            password: t('loginPage.invalidCredentials')
          });
          throw new Error(t('loginPage.invalidCredentials'));
        } else if (response.status === 403) {
          setErrors({
            username: t('loginPage.noPrivileges')
          });
          throw new Error(t('loginPage.accessDenied'));
        } else if (data.errors) {
          setErrors(data.errors);
          throw new Error(Object.values(data.errors).join(', '));
        }
        throw new Error(data.message || t('loginPage.loginFailed'));
      }

      // Verify we got a token
      if (!data.token) {
        throw new Error(t('loginPage.noToken'));
      }

      // Store the token in localStorage
      localStorage.setItem('authToken', data.token);
      console.log('Auth token stored successfully');

      toast({
        title: t('loginPage.successTitle'),
        description: t('loginPage.successDesc'),
        duration: 4000,
        className: 'border-primary/30 bg-primary text-primary-foreground',
      });

      // Redirect to admin panel
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: t('loginPage.errorTitle'),
        description: error instanceof Error ? error.message : t('loginPage.errorFallback'),
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
              <CardTitle className="text-3xl font-bold">{t('loginPage.title')}</CardTitle>
              <CardDescription>
                {t('loginPage.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('loginPage.username')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder={t('loginPage.usernamePlaceholder')}
                        className={`pl-9 ${errors.username ? 'border-red-500' : ''}`}
                        value={formData.username}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        disabled={loading}
                        ref={(el) => { fieldRefs.current.username = el; }}
                      />
                    </div>
                    {errors.username ? <p className="mt-1 text-sm text-[#EF4444]">{errors.username}</p> : isValidField('username') ? <p className="mt-1 text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('loginPage.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder={t('loginPage.passwordPlaceholder')}
                        className={`pl-9 ${errors.password ? 'border-red-500' : ''}`}
                        value={formData.password}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        required
                        disabled={loading}
                        ref={(el) => { fieldRefs.current.password = el; }}
                      />
                    </div>
                    {errors.password ? <p className="mt-1 text-sm text-[#EF4444]">{errors.password}</p> : isValidField('password') ? <p className="mt-1 text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full hover:scale-105 transition-transform duration-300"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {loading ? t('loginPage.loggingIn') : t('loginPage.loginButton')}
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