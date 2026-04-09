import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useDentalData } from '@/hooks/use-dental-data';

const Services = () => {
  const { data, isLoading, error } = useDentalData();

  const services = data?.services || [
    {
      title: "General Dentistry",
      description: "Comprehensive dental care including cleanings, fillings, and preventive treatments for the whole family.",
      icon: "🦷",
      features: ["Regular Cleanings", "Cavity Fillings", "Root Canal Treatment", "Dental Crowns"],
      price: "Starting from Rs. 2,000"
    },
    {
      title: "Cosmetic Dentistry",
      description: "Transform your smile with our advanced cosmetic procedures and treatments.",
      icon: "✨",
      features: ["Teeth Whitening", "Veneers", "Dental Bonding", "Smile Makeover"],
      price: "Starting from Rs. 15,000"
    },
    {
      title: "Orthodontics",
      description: "Straighten your teeth with traditional braces or modern clear aligners.",
      icon: "🔧",
      features: ["Metal Braces", "Clear Aligners", "Retainers", "Bite Correction"],
      price: "Starting from Rs. 80,000"
    },
    {
      title: "Oral Surgery",
      description: "Advanced surgical procedures performed by our experienced oral surgeons.",
      icon: "🏥",
      features: ["Tooth Extraction", "Wisdom Teeth Removal", "Dental Implants", "Jaw Surgery"],
      price: "Starting from Rs. 10,000"
    },
    {
      title: "Pediatric Dentistry",
      description: "Specialized dental care for children in a friendly and comfortable environment.",
      icon: "👶",
      features: ["Children's Cleanings", "Fluoride Treatments", "Dental Sealants", "Cavity Prevention"],
      price: "Starting from Rs. 1,500"
    },
    {
      title: "Emergency Dental Care",
      description: "24/7 emergency dental services for urgent dental problems and pain relief.",
      icon: "🚨",
      features: ["Emergency Extractions", "Pain Management", "Trauma Treatment", "After-hours Care"],
      price: "Starting from Rs. 3,000"
    }
  ];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-500">Error loading services. Please try again later.</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Our Dental Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive dental care services using the latest technology and techniques. 
              We're committed to providing you with the best possible dental experience.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_12px_30px_-10px_rgba(0,0,0,0.2)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 group animate-fade-in border-2 border-accent/20 hover:border-primary/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center px-6 pt-8 pb-6 border-b border-accent/20">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-8">
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3 group/item">
                        <span className="w-2 h-2 bg-primary rounded-full mt-[0.6rem] group-hover/item:ring-2 group-hover/item:ring-primary/30 transition-all duration-300"></span>
                        <span className="text-sm text-muted-foreground flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 border-t border-accent/20">
                    <p className="text-lg font-semibold text-primary mb-5 text-center">{service.price}</p>
                    <Link to="/appointment">
                      <Button className="w-full hover:scale-105 transition-transform duration-300 shadow-[0_8px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.4),0_8px_10px_-6px_rgba(0,0,0,0.2)]">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative">
        <div className="absolute inset-0 border-y-2 border-primary/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Sayapatri Dental?</h2>
            <p className="text-xl text-muted-foreground">Excellence in dental care, backed by numbers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "15+",
                label: "Years of Excellence",
                description: "Serving our community with dedication and expertise"
              },
              {
                number: "25,000+",
                label: "Happy Patients",
                description: "Smiles transformed and lives improved"
              },
              {
                number: "12",
                label: "Specialist Doctors",
                description: "Expert team of dental professionals"
              },
              {
                number: "99%",
                label: "Success Rate",
                description: "Consistently delivering outstanding results"
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="group bg-card hover:bg-accent/5 p-8 rounded-xl relative transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] text-center overflow-hidden"
              >
                <div className="absolute inset-0 border-2 border-primary/20 rounded-xl"></div>
                <div className="absolute inset-[1px] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-right transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground text-sm">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "State-of-the-Art Technology",
                description: "Using the latest dental technology for precise and comfortable treatments"
              },
              {
                title: "Patient-First Approach",
                description: "Personalized care plans tailored to your unique dental needs"
              },
              {
                title: "Affordable Excellence",
                description: "Quality dental care with flexible payment options and insurance coverage"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-lg relative group overflow-hidden"
              >
                <div className="absolute inset-0 border border-primary/10 rounded-lg"></div>
                <div className="absolute inset-[1px] bg-card group-hover:bg-accent/5 transition-colors duration-300 rounded-lg"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-right transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="relative">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Need a Consultation?
          </h2>
          <p className="text-xl text-muted-foreground">
            Our expert dentists are here to help you choose the right treatment for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointment">
              <Button size="lg" className="hover:scale-105 transition-transform duration-300">
                Book Consultation
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
