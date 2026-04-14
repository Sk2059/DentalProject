import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Subject: '',
    Message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const validators = {
    Name: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Name is required';
      if (trimmed.length < 3) return '⚠️ Name must be at least 3 characters';
      if (!/^[A-Za-z\s]+$/.test(trimmed)) return '⚠️ Name can only contain letters and spaces';
      return '';
    },
    Email: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return '⚠️ Enter a valid email address';
      return '';
    },
    Phone: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Phone number is required';
      if (!/^9\d{9}$/.test(trimmed)) return '⚠️ Enter a valid Nepal mobile number (10 digits, starts with 9)';
      return '';
    },
    Subject: (value: string) => (!value.trim() ? '⚠️ Subject is required' : ''),
    Message: (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return '⚠️ Message is required';
      if (trimmed.length < 10) return '⚠️ Message must be at least 10 characters';
      if (trimmed.length > 500) return '⚠️ Message cannot exceed 500 characters';
      return '';
    },
  };

  const validateField = (name: keyof typeof validators, value: string) => validators[name](value);
  const isValidField = (name: keyof typeof validators) => touched[name] && !errors[name] && !!formData[name].trim();
  const validateAll = () => {
    const nextErrors: Record<string, string> = {};
    (Object.keys(validators) as Array<keyof typeof validators>).forEach((field) => {
      const message = validateField(field, formData[field]);
      if (message) nextErrors[field] = message;
    });
    return nextErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      Name: true,
      Email: true,
      Phone: true,
      Subject: true,
      Message: true,
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
      const response = await fetch('http://localhost:8000/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit contact form');
      }

      const data = await response.json();
      console.log('Form submitted:', data);
      
      toast({
        title: t('contactPage.successTitle'),
        description: t('contactPage.successDesc'),
        duration: 4000,
        className: 'border-primary/30 bg-primary text-primary-foreground',
      });
      
      setFormData({
        Name: '',
        Email: '',
        Phone: '',
        Subject: '',
        Message: ''
      });
      setErrors({});
      setTouched({});
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: t('contactPage.errorTitle'),
        description: error instanceof Error ? error.message : t('contactPage.errorDesc'),
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t('contactPage.info.phone.title'),
      details: ["+977-1-4567890", "+977-1-4567891"],
      description: t('contactPage.info.phone.description')
    },
    {
      icon: Mail,
      title: t('contactPage.info.email.title'),
      details: ["info@sayapatridental.com", "appointments@sayapatridental.com"],
      description: t('contactPage.info.email.description')
    },
    {
      icon: MapPin,
      title: t('contactPage.info.address.title'),
      details: [t('contactPage.addressLines.0'), t('contactPage.addressLines.1')],
      description: t('contactPage.info.address.description')
    },
    {
      icon: Clock,
      title: t('contactPage.info.hours.title'),
      details: [t('contactPage.hoursLines.0'), t('contactPage.hoursLines.1')],
      description: t('contactPage.info.hours.description')
    }
  ];
  const faqs = t('contactPage.faqs', { returnObjects: true }) as { question: string; answer: string }[];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t('contactPage.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('contactPage.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{info.title}</CardTitle>
                  <CardDescription>{info.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {info.details.map((detail, detailIndex) => (
                    <p key={detailIndex} className="text-sm text-foreground mb-1">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form and Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl">{t('contactPage.messageTitle')}</CardTitle>
                <CardDescription>
                  {t('contactPage.messageDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" action="http://localhost:8000/api/contact/" method="POST" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('contactPage.fullName')}</Label>
                      <Input
                        id="name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={t('contactPage.namePlaceholder')}
                        required
                        aria-invalid={!!errors.Name}
                        ref={(el) => { fieldRefs.current.Name = el; }}
                        className={errors.Name ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                      />
                      {errors.Name ? <p className="text-sm text-[#EF4444]">{errors.Name}</p> : isValidField('Name') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('contactPage.email')}</Label>
                      <Input
                        id="email"
                        name="Email"
                        type="email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={t('contactPage.emailPlaceholder')}
                        required
                        aria-invalid={!!errors.Email}
                        ref={(el) => { fieldRefs.current.Email = el; }}
                        className={errors.Email ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                      />
                      {errors.Email ? <p className="text-sm text-[#EF4444]">{errors.Email}</p> : isValidField('Email') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contactPage.phone')}</Label>
                      <Input
                        id="phone"
                        name="Phone"
                        type="tel"
                        value={formData.Phone}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={t('contactPage.phonePlaceholder')}
                        required
                        aria-invalid={!!errors.Phone}
                        ref={(el) => { fieldRefs.current.Phone = el; }}
                        className={errors.Phone ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                      />
                      {errors.Phone ? <p className="text-sm text-[#EF4444]">{errors.Phone}</p> : isValidField('Phone') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contactPage.subject')}</Label>
                      <Input
                        id="subject"
                        name="Subject"
                        value={formData.Subject}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder={t('contactPage.subjectPlaceholder')}
                        required
                        aria-invalid={!!errors.Subject}
                        ref={(el) => { fieldRefs.current.Subject = el; }}
                        className={errors.Subject ? 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200' : ''}
                      />
                      {errors.Subject ? <p className="text-sm text-[#EF4444]">{errors.Subject}</p> : isValidField('Subject') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contactPage.message')}</Label>
                    <Textarea
                      id="message"
                      name="Message"
                      value={formData.Message}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder={t('contactPage.messagePlaceholder')}
                      className="min-h-[120px]"
                      required
                      maxLength={500}
                      aria-invalid={!!errors.Message}
                      ref={(el) => { fieldRefs.current.Message = el; }}
                    />
                    <div className="flex items-center justify-between">
                      {errors.Message ? <p className="text-sm text-[#EF4444] inline-flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5" /> {errors.Message.replace('⚠️ ', '')}</p> : isValidField('Message') ? <p className="text-sm text-emerald-600 inline-flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Valid</p> : <span />}
                      <p className={`text-xs ${formData.Message.length > 500 ? 'text-[#EF4444]' : 'text-muted-foreground'}`}>{formData.Message.length}/500</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                    {isSubmitting ? 'Sending...' : t('contactPage.sendMessage')}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">{t('contactPage.visitTitle')}</CardTitle>
                  <CardDescription>
                    {t('contactPage.visitDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center space-y-2">
                      <MapPin className="w-12 h-12 text-primary mx-auto" />
                      <p className="text-lg font-medium text-foreground">{t('contactPage.interactiveMap')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('footer.address')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t('contactPage.directions')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('contactPage.directionsDesc')}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{t('contactPage.publicTransport')}</h4>
                      <p className="text-sm text-muted-foreground">
                        {t('contactPage.publicTransportDesc')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">{t('contactPage.emergencyContact')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-foreground">{t('contactPage.emergencyHotline')}</p>
                        <p className="text-sm text-muted-foreground">+977-1-4567890</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('contactPage.emergencyDesc')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('contactPage.faqTitle')}
            </h2>
            <p className="text-xl text-muted-foreground">
              {t('contactPage.faqDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
