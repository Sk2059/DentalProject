import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Layout from '@/components/Layout';

const Contact = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Subject: '',
    Message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });
      
      setFormData({
        Name: '',
        Email: '',
        Phone: '',
        Subject: '',
        Message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+977-1-4567890", "+977-1-4567891"],
      description: "Call us for immediate assistance"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@sayapatridental.com", "appointments@sayapatridental.com"],
      description: "Send us an email anytime"
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["New Road, Kathmandu", "Nepal - 44600"],
      description: "Visit our modern clinic"
    },
    {
      icon: Clock,
      title: "Hours",
      details: ["Mon-Sat: 9:00 AM - 6:00 PM", "Sun: Emergency Only"],
      description: "We're here when you need us"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get in touch with our team. We're here to help with all your dental care needs 
              and answer any questions you may have.
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
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" action="http://localhost:8000/api/contact/" method="POST">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="Name"
                        value={formData.Name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="Email"
                        type="email"
                        value={formData.Email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="Phone"
                        type="tel"
                        value={formData.Phone}
                        onChange={handleInputChange}
                        placeholder="+977-XX-XXXXXXX"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="Subject"
                        value={formData.Subject}
                        onChange={handleInputChange}
                        placeholder="How can we help?"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="Message"
                      value={formData.Message}
                      onChange={handleInputChange}
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full hover:scale-105 transition-transform duration-300"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map and Additional Info */}
            <div className="space-y-8">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl">Visit Our Clinic</CardTitle>
                  <CardDescription>
                    Located in the heart of Kathmandu, our modern clinic is easily accessible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                    <div className="text-center space-y-2">
                      <MapPin className="w-12 h-12 text-primary mx-auto" />
                      <p className="text-lg font-medium text-foreground">Interactive Map</p>
                      <p className="text-sm text-muted-foreground">
                        New Road, Kathmandu, Nepal
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Directions</h4>
                      <p className="text-sm text-muted-foreground">
                        Our clinic is located on New Road, easily accessible by public transport. 
                        Parking is available nearby.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Public Transport</h4>
                      <p className="text-sm text-muted-foreground">
                        Take any bus to New Road bus stop. We're just a 2-minute walk from there.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-xl">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-foreground">Emergency Hotline</p>
                        <p className="text-sm text-muted-foreground">+977-1-4567890</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For dental emergencies outside business hours, call our emergency hotline. 
                      We provide 24/7 emergency dental care.
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                question: "Do you accept insurance?",
                answer: "Yes, we accept most major dental insurance plans. Contact us to verify your coverage."
              },
              {
                question: "Do you offer payment plans?",
                answer: "We offer flexible payment options including installment plans for major treatments."
              },
              {
                question: "How far in advance should I book?",
                answer: "We recommend booking routine appointments 2-3 weeks in advance. Emergency appointments available same day."
              },
              {
                question: "Do you treat children?",
                answer: "Yes, we have a dedicated pediatric dentistry department for children of all ages."
              }
            ].map((faq, index) => (
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
