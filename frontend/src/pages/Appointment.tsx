import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Phone, Mail, MessageSquare, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { useServices } from '@/hooks/use-services';
import { API_BASE_URL } from '@/lib/api-config';
import { useTranslation } from 'react-i18next';

const Appointment = () => {
  const { t } = useTranslation();
  const { data: servicesData = [] } = useServices();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    preferredDate: '',
    preferredTime: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const validators = {
    firstName: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ First name is required';
      if (trimmed.length < 3) return '⚠️ First name must be at least 3 characters';
      if (!/^[A-Za-z\s]+$/.test(trimmed)) return '⚠️ First name can only contain letters and spaces';
      return '';
    },
    lastName: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Last name is required';
      if (trimmed.length < 3) return '⚠️ Last name must be at least 3 characters';
      if (!/^[A-Za-z\s]+$/.test(trimmed)) return '⚠️ Last name can only contain letters and spaces';
      return '';
    },
    email: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return '⚠️ Enter a valid email address';
      return '';
    },
    phone: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Phone number is required';
      if (!/^9\d{9}$/.test(trimmed)) return '⚠️ Enter a valid Nepal mobile number (10 digits, starts with 9)';
      return '';
    },
    service: (value: string) => (!value ? '⚠️ Please select a service' : ''),
    preferredDate: (value: string) => {
      if (!value) return '⚠️ Preferred date is required';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(value);
      if (selected < today) return '⚠️ Past dates are not allowed';
      return '';
    },
    preferredTime: (value: string) => (!value ? '⚠️ Please select a preferred time' : ''),
    message: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Message is required';
      if (trimmed.length < 10) return '⚠️ Message must be at least 10 characters';
      if (trimmed.length > 500) return '⚠️ Message cannot exceed 500 characters';
      return '';
    },
  };

  const validateField = (name: keyof typeof validators, value: string) => validators[name](value);
  const validateAll = () => {
    const nextErrors: Record<string, string> = {};
    (Object.keys(validators) as Array<keyof typeof validators>).forEach((field) => {
      const message = validateField(field, formData[field]);
      if (message) nextErrors[field] = message;
    });
    return nextErrors;
  };
  const isValidField = (name: keyof typeof validators) => touched[name] && !errors[name] && !!formData[name].trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!(name in validators)) return;
    const nextError = validateField(name as keyof typeof validators, value);
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: nextError }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateAll();
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      service: true,
      preferredDate: true,
      preferredTime: true,
      message: true,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstInvalid = Object.keys(nextErrors)[0];
      const target = fieldRefs.current[firstInvalid];
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.focus();
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/appointment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      const data = await response.json();
      console.log('Appointment booked:', data);
      
      toast({
        title: t('appointmentPage.bookedTitle'),
        description: t('appointmentPage.bookedDesc'),
        duration: 4000,
        className: 'border-primary/30 bg-primary text-primary-foreground',
      });
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        service: '',
        preferredDate: '',
        preferredTime: '',
        message: ''
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: t('appointmentPage.errorTitle'),
        description: error instanceof Error ? error.message : t('appointmentPage.errorDesc'),
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = servicesData.map((service) => service.title);

  const timeSlots = t('appointmentPage.times', { returnObjects: true }) as string[];
  const schedule = t('appointmentPage.schedule', { returnObjects: true }) as { day: string; hours: string }[];
  const expectations = t('appointmentPage.expectations', { returnObjects: true }) as string[];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('appointmentPage.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('appointmentPage.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Appointment Form */}
            <div className="lg:col-span-2">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    <span>{t('appointmentPage.scheduleVisit')}</span>
                  </CardTitle>
                  <CardDescription>
                    {t('appointmentPage.scheduleDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                        <User className="w-5 h-5 text-primary" />
                        <span>{t('appointmentPage.personalInfo')}</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">{t('appointmentPage.firstName')}</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={t('appointmentPage.firstName')}
                            required
                            ref={(el) => { fieldRefs.current.firstName = el; }}
                            aria-invalid={!!errors.firstName}
                            className={errors.firstName ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                          />
                          {errors.firstName ? <p className="text-sm text-[#EF4444]">{errors.firstName}</p> : isValidField('firstName') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">{t('appointmentPage.lastName')}</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder={t('appointmentPage.lastName')}
                            required
                            ref={(el) => { fieldRefs.current.lastName = el; }}
                            aria-invalid={!!errors.lastName}
                            className={errors.lastName ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                          />
                          {errors.lastName ? <p className="text-sm text-[#EF4444]">{errors.lastName}</p> : isValidField('lastName') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('appointmentPage.emailAddress')}</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="john.doe@example.com"
                            required
                            ref={(el) => { fieldRefs.current.email = el; }}
                            aria-invalid={!!errors.email}
                            className={errors.email ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                          />
                          {errors.email ? <p className="text-sm text-[#EF4444]">{errors.email}</p> : isValidField('email') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t('appointmentPage.phoneNumber')}</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            placeholder="+977-XX-XXXXXXX"
                            required
                            ref={(el) => { fieldRefs.current.phone = el; }}
                            aria-invalid={!!errors.phone}
                            className={errors.phone ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                          />
                          {errors.phone ? <p className="text-sm text-[#EF4444]">{errors.phone}</p> : isValidField('phone') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>{t('appointmentPage.appointmentDetails')}</span>
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="service">{t('appointmentPage.serviceRequired')}</Label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                          ref={(el) => { fieldRefs.current.service = el; }}
                          aria-invalid={!!errors.service}
                        >
                          <option value="">{t('appointmentPage.selectService')}</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                        {errors.service ? <p className="text-sm text-[#EF4444]">{errors.service}</p> : isValidField('service') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">{t('appointmentPage.preferredDate')}</Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            min={new Date().toISOString().split('T')[0]}
                            required
                            ref={(el) => { fieldRefs.current.preferredDate = el; }}
                            aria-invalid={!!errors.preferredDate}
                            className={errors.preferredDate ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                          />
                          {errors.preferredDate ? <p className="text-sm text-[#EF4444]">{errors.preferredDate}</p> : isValidField('preferredDate') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">{t('appointmentPage.preferredTime')}</Label>
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            ref={(el) => { fieldRefs.current.preferredTime = el; }}
                            aria-invalid={!!errors.preferredTime}
                          >
                            <option value="">{t('appointmentPage.selectTime')}</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                          {errors.preferredTime ? <p className="text-sm text-[#EF4444]">{errors.preferredTime}</p> : isValidField('preferredTime') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <span>{t('appointmentPage.additionalInfo')}</span>
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">{t('appointmentPage.specialRequests')}</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          placeholder={t('appointmentPage.specialRequestsPlaceholder')}
                          className="min-h-[100px]"
                          maxLength={500}
                          required
                          ref={(el) => { fieldRefs.current.message = el; }}
                          aria-invalid={!!errors.message}
                        />
                        <div className="flex items-center justify-between">
                          {errors.message ? <p className="text-sm text-[#EF4444] inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> {errors.message.replace('⚠️ ', '')}</p> : isValidField('message') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : <span />}
                          <p className={`text-xs ${formData.message.length > 500 ? 'text-[#EF4444]' : 'text-muted-foreground'}`}>{formData.message.length}/500</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full hover:scale-105 transition-transform duration-300"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
                      {isSubmitting ? 'Submitting...' : t('appointmentPage.bookAppointment')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{t('appointmentPage.officeHours')}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {schedule.map((scheduleItem, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{scheduleItem.day}</span>
                      <span className="text-sm text-muted-foreground">{scheduleItem.hours}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{t('appointmentPage.contactInformation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('contactPage.info.phone.title')}</p>
                      <p className="text-sm text-muted-foreground">+977-1-4567890</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{t('contactPage.info.email.title')}</p>
                      <p className="text-sm text-muted-foreground">appointments@sayapatridental.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Notice */}
              <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-red-700">{t('appointmentPage.emergency')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-4">
                    {t('appointmentPage.emergencyDesc')}
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    {t('contactPage.emergencyHotline')}
                  </Button>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{t('appointmentPage.whatToExpect')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {expectations.map((item) => (
                      <li className="flex items-start space-x-2" key={item}>
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Appointment;
