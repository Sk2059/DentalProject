import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const Appointment = () => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/appointment/', {
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
        title: "Appointment Booked!",
        description: "We'll contact you soon to confirm your appointment details.",
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
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const services = [
    "General Consultation",
    "Dental Cleaning",
    "Cavity Filling",
    "Root Canal Treatment",
    "Teeth Whitening",
    "Dental Crowns",
    "Braces Consultation",
    "Wisdom Teeth Removal",
    "Dental Implants",
    "Emergency Treatment"
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Book Your Appointment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Schedule your dental appointment today. Our team is ready to provide you with 
              exceptional care in a comfortable environment.
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
                    <span>Schedule Your Visit</span>
                  </CardTitle>
                  <CardDescription>
                    Please fill out the form below to request an appointment. We'll contact you to confirm the details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                        <User className="w-5 h-5 text-primary" />
                        <span>Personal Information</span>
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="john.doe@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+977-XX-XXXXXXX"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span>Appointment Details</span>
                      </h3>

                      <div className="space-y-2">
                        <Label htmlFor="service">Service Required *</Label>
                        <select
                          id="service"
                          name="service"
                          value={formData.service}
                          onChange={handleInputChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          required
                        >
                          <option value="">Select a service</option>
                          {services.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="preferredDate">Preferred Date *</Label>
                          <Input
                            id="preferredDate"
                            name="preferredDate"
                            type="date"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            min={new Date().toISOString().split('T')[0]}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredTime">Preferred Time *</Label>
                          <select
                            id="preferredTime"
                            name="preferredTime"
                            value={formData.preferredTime}
                            onChange={handleInputChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Select time</option>
                            {timeSlots.map((time) => (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        <span>Additional Information</span>
                      </h3>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message">Special Requests or Medical History</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Please mention any allergies, medical conditions, or special requests..."
                          className="min-h-[100px]"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full hover:scale-105 transition-transform duration-300"
                      size="lg"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
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
                    <span>Office Hours</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
                    { day: "Saturday", hours: "9:00 AM - 4:00 PM" },
                    { day: "Sunday", hours: "Emergency Only" }
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-foreground">{schedule.day}</span>
                      <span className="text-sm text-muted-foreground">{schedule.hours}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">+977-1-4567890</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">appointments@sayapatridental.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Notice */}
              <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-red-700">Emergency?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-600 mb-4">
                    If you're experiencing a dental emergency, please call us immediately.
                  </p>
                  <Button variant="destructive" className="w-full">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Hotline
                  </Button>
                </CardContent>
              </Card>

              {/* What to Expect */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">What to Expect</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Confirmation call within 24 hours</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Arrive 15 minutes early for paperwork</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Bring insurance cards and ID</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span>Comfortable, modern environment</span>
                    </li>
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
