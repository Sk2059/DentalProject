import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Star, Users, Award, Clock, Shield } from 'lucide-react';
import Layout from '@/components/Layout';
import { useDentalData } from '@/hooks/use-dental-data';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data, isLoading, error } = useDentalData();

  const services = data?.services.slice(0, 4) || [
    {
      title: "General Dentistry",
      description: "Comprehensive dental care for the whole family",
      icon: "🦷",
    },
    {
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our cosmetic procedures",
      icon: "✨",
    },
    {
      title: "Orthodontics",
      description: "Straighten your teeth with modern orthodontic solutions",
      icon: "🔧",
    },
    {
      title: "Oral Surgery",
      description: "Advanced surgical procedures with expert care",
      icon: "🏥",
    },
  ];

  const stats = data?.stats || [
    { icon: Users, value: "5000+", label: "Happy Patients" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Clock, value: "24/7", label: "Emergency Care" },
  ];

  const team = [
    {
      name: "Dr. Rajesh Shrestha",
      position: "Chief Dental Officer",
      specialization: "Oral Surgery & Implantology",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Dr. Shrestha leads our team with extensive experience in complex oral surgeries and dental implants."
    },
    {
      name: "Dr. Sunita Karki",
      position: "Senior Dentist",
      specialization: "Cosmetic Dentistry",
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Specializing in smile makeovers and aesthetic dentistry, Dr. Karki brings artistry to dental care."
    },
    {
      name: "Dr. Amit Pradhan",
      position: "Orthodontist",
      specialization: "Braces & Aligners",
      experience: "10+ years",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "An expert in orthodontic treatments, Dr. Pradhan specializes in creating perfect smiles."
    },
    {
      name: "Dr. Priya Sharma",
      position: "Pediatric Dentist",
      specialization: "Children's Dentistry",
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Dr. Sharma makes dental visits fun and comfortable for our youngest patients."
    },
    {
      name: "Dr. Bikash Thapa",
      position: "Periodontist",
      specialization: "Gum Treatment",
      experience: "11+ years",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      bio: "Expert in treating gum diseases and maintaining periodontal health."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % team.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-accent/5 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Your Perfect
                  <span className="text-primary block">Smile Awaits</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Experience world-class dental care at Sayapatri Dental Hospital. 
                  We combine advanced technology with compassionate care to give you the smile you deserve.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/appointment">
                  <Button size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-300">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto hover:scale-105 transition-transform duration-300">
                    Our Services
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Expert Dentists</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Modern Equipment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Painless Treatment</span>
                </div>
              </div>
            </div>

            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Modern dental clinic"
                className="relative rounded-2xl shadow-2xl w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon === 'Users' ? Users :
                                  stat.icon === 'Award' ? Award :
                                  stat.icon === 'Star' ? Star :
                                  Clock;
              return (
                <div
                  key={index}
                  className="text-center space-y-4 hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Why Choose Sayapatri Dental?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine advanced technology with compassionate care to deliver exceptional dental services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Safe & Sterile Environment",
                    description: "Strict sterilization protocols and modern safety measures"
                  },
                  {
                    icon: Star,
                    title: "Expert Team",
                    description: "Highly qualified dentists with years of experience"
                  },
                  {
                    icon: Award,
                    title: "Advanced Technology",
                    description: "Latest dental equipment and innovative treatment methods"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dental equipment"
                className="relative rounded-2xl shadow-xl w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive dental care services using the latest technology and techniques
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-300">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experienced professionals dedicated to your dental health
            </p>
          </div>

          <div className="relative overflow-hidden">
            {/* Slider Container */}
            <div className="relative h-[400px] md:h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
                    {/* Image Side */}
                    <div className="relative overflow-hidden rounded-xl h-[200px] md:h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                      <img
                        src={team[currentSlide].image}
                        alt={team[currentSlide].name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Side */}
                    <div className="flex flex-col justify-center space-y-3 p-4">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                      >
                        <h3 className="text-2xl font-bold text-foreground">
                          {team[currentSlide].name}
                        </h3>
                        <p className="text-lg text-primary font-medium">
                          {team[currentSlide].position}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Specialization:</span>
                            <span className="text-sm font-medium">{team[currentSlide].specialization}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Experience:</span>
                            <span className="text-sm font-medium">{team[currentSlide].experience}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {team[currentSlide].bio}
                          </p>
                        </div>
                        <Link to="/about" className="inline-block mt-4">
                          <Button variant="outline" size="sm" className="hover:scale-105 transition-transform duration-300">
                            Learn More About Our Team
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-4">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-primary scale-125'
                      : 'bg-primary/20 hover:bg-primary/40'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-200/30 via-sky-200/30 to-transparent"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-sky-200/30 via-blue-200/30 to-transparent"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Ready to Transform Your Smile?
            </h2>
            <p className="text-xl text-foreground/80">
              Book your appointment today and take the first step towards a healthier, more beautiful smile.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointment">
              <Button
                size="lg"
                className="bg-blue-600/90 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Schedule Your Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/80 dark:bg-black/20 hover:bg-white dark:hover:bg-black/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Explore Our Services
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span>Easy Scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Quick Response</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Safe & Trusted</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
