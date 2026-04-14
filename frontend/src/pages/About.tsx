import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Users, Clock, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
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

  const values = t('aboutPage.values', { returnObjects: true }) as { title: string; description: string }[];
  const valueIcons = [Heart, Award, Users, Clock];
  const timelineEvents = t('aboutPage.journeyEvents', { returnObjects: true }) as string[];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % team.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                {t('aboutPage.title')}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t('aboutPage.description')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-sm text-muted-foreground">{t('aboutPage.yearsExcellence')}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">5000+</div>
                  <div className="text-sm text-muted-foreground">{t('aboutPage.happyPatients')}</div>
                </div>
              </div>
            </div>
            <div className="animate-scale-in">
              <img
                src="https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Dental clinic interior"
                className="rounded-2xl shadow-xl w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{t('aboutPage.missionTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t('aboutPage.missionDesc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">{t('aboutPage.visionTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {t('aboutPage.visionDesc')}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t('aboutPage.valuesTitle')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('aboutPage.valuesDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const ValueIcon = valueIcons[index];
              return (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    {ValueIcon ? <ValueIcon className="w-8 h-8 text-primary" /> : null}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      </section>

       {/* History Timeline */}
       <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative overflow-hidden">
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 transform -translate-x-1/2 hidden md:block"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-16">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
              >
                {t('aboutPage.journeyTitle')}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-muted-foreground"
              >
                {t('aboutPage.journeyDesc')}
              </motion.p>
            </div>

            <div className="relative space-y-16">
              {["2009", "2012", "2015", "2018", "2021", "2024"].map((year, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex items-center space-x-6 md:justify-center group ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-12 h-12 md:w-28 md:h-28 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm md:text-xl flex-shrink-0 shadow-[0_8px_20px_-3px_rgba(0,0,0,0.3)] transition-all duration-300 z-10 relative"
                    >
                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {year}
                    </motion.div>
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110"></div>
                  </div>
                  <div className={`flex-1 md:w-1/2 ${
                    index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'
                  }`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-card p-6 md:p-8 rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.2)] transition-all duration-300 border-2 border-primary/5 hover:border-primary/20 relative overflow-hidden group/card"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-left transition-transform duration-500 scale-x-0 group-hover/card:scale-x-100"></div>
                      <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-right transition-transform duration-500 scale-x-0 group-hover/card:scale-x-100"></div>
                      <p className="text-lg text-foreground relative">{timelineEvents[index]}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Team */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              {t('aboutPage.teamTitle')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('aboutPage.teamDesc')}
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
                            <span className="text-sm text-muted-foreground">{t('aboutPage.specialization')}</span>
                            <span className="text-sm font-medium">{team[currentSlide].specialization}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">{t('aboutPage.experience')}</span>
                            <span className="text-sm font-medium">{team[currentSlide].experience}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {team[currentSlide].bio}
                          </p>
                        </div>
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
    </Layout>
  );
};

export default About;
