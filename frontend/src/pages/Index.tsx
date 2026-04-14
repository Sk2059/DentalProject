import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, Clock, Shield, Star, Stethoscope, Users } from "lucide-react";
import Layout from "@/components/Layout";
import { useServices } from "@/hooks/use-services";
import { useTeamMembers } from "@/hooks/use-team";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: services = [] } = useServices();
  const { data: team = [] } = useTeamMembers();
  const { t } = useTranslation();
  const trustBadges = t("index.trustBadges", { returnObjects: true }) as string[];
  const features = t("index.features", { returnObjects: true }) as { title: string; description: string }[];
  const safeTeam = team.length > 0 ? team : [];
  const stats = [
    { icon: "Users", value: "5000+", label: t("index.stats.happyPatients") },
    { icon: "Award", value: "15+", label: t("index.stats.yearsExperience") },
    { icon: "Star", value: "4.9", label: t("index.stats.averageRating") },
    { icon: "Clock", value: "24/7", label: t("index.stats.emergencyCare") },
  ];

  useEffect(() => {
    if (safeTeam.length < 2) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % safeTeam.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [safeTeam.length]);

  return (
    <Layout>
      <section className="relative overflow-visible bg-gradient-to-br from-background to-accent/30 pt-16 md:pt-20 pb-28 md:pb-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  {t("index.heroTitle1")}
                  <span className="text-primary block">{t("index.heroTitle2")}</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                  {t("index.heroDesc")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/appointment">
                  <Button size="lg" className="w-full sm:w-auto">
                    {t("nav.bookAppointment")}
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("index.ourServices")}
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-6">
                {trustBadges.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-10 shadow-2xl min-h-[360px] flex items-center justify-center">
              <div className="w-64 h-64 rounded-full bg-[#0f1520] shadow-2xl grid place-items-center border-8 border-[#111a27]">
                <div className="w-32 h-32 rounded-full bg-white text-slate-900 grid place-items-center text-6xl font-black">
                  S
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 -mt-14 md:-mt-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-primary/15 bg-background/90 backdrop-blur-md p-4 sm:p-5 lg:p-6 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.35)]">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {stats.map((stat, index) => {
              const IconComponent =
                stat.icon === "Users"
                  ? Users
                  : stat.icon === "Award"
                    ? Award
                    : stat.icon === "Star"
                      ? Star
                      : Clock;
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-primary/10 bg-gradient-to-b from-card via-card to-accent/10 p-5 sm:p-6 text-center space-y-3 shadow-[0_10px_28px_-20px_rgba(0,0,0,0.35)] hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-primary/20 group-hover:bg-primary/15 transition-colors">
                    <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      </section>
      <section className="pt-24 md:pt-28 pb-20 bg-gradient-to-br from-primary/10 via-accent/20 to-background dark:from-[#0d1f1e] dark:via-[#0d1f1e] dark:to-[#132a2a] text-foreground dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">{t("index.whyTitle")}</h2>
            <p className="text-xl text-muted-foreground dark:text-emerald-100/80 max-w-2xl mx-auto">
              {t("index.whyDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                {[Shield, Star, Stethoscope].map((Icon, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{features[index]?.title}</h3>
                      <p className="text-muted-foreground dark:text-emerald-100/75">{features[index]?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl grid grid-cols-2 min-h-[320px]">
              <div
                className="bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80)",
                }}
              />
              <div className="bg-slate-100 dark:bg-slate-900/40 grid place-items-center">
                <div className="w-36 h-36 rounded-full bg-[#0f1520] text-white grid place-items-center text-5xl font-black">S</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("index.servicesTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 4).map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-all duration-300 group border-primary/15">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{service.description}</CardDescription>
                  <p className="text-center mt-3 text-primary font-semibold">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline">
                {t("index.viewAll")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-12 bg-gradient-to-br from-primary/5 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("index.teamTitle")}</h2>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[0_14px_40px_-18px_rgba(0,0,0,0.35)]">
            <div className="relative h-[500px] md:h-[500px]">
              {safeTeam.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={safeTeam[currentSlide].id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.45 }}
                    className="absolute inset-0"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
                      <div className="relative overflow-hidden rounded-t-2xl lg:rounded-l-2xl lg:rounded-tr-none h-[260px] md:h-[280px] lg:h-full bg-slate-200 border-b lg:border-b-0 lg:border-r border-primary/15">
                        {safeTeam[currentSlide].image ? (
                          <div className="absolute inset-0">
                            {/* Blurred fill keeps odd aspect ratios visually balanced */}
                            <img
                              src={safeTeam[currentSlide].image}
                              alt=""
                              aria-hidden="true"
                              className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-35"
                            />
                            {/* Main image always fits frame consistently */}
                            <img
                              src={safeTeam[currentSlide].image}
                              alt={safeTeam[currentSlide].name}
                              className="relative w-full h-full object-contain md:object-cover object-center"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full grid place-items-center text-4xl font-bold text-primary">S</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center p-6 md:p-8 bg-gradient-to-br from-background to-accent/10 h-full">
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground text-center lg:text-left">
                          {safeTeam[currentSlide].name}
                        </h3>
                        <p className="text-base md:text-lg text-primary font-semibold mt-1 text-center lg:text-left">
                          {safeTeam[currentSlide].role}
                        </p>
                        <div className="space-y-3 mt-5">
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-muted-foreground min-w-[110px]">{t("aboutPage.specialization")}</span>
                            <span className="text-sm font-medium leading-relaxed">{safeTeam[currentSlide].specialization || "-"}</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-sm text-muted-foreground min-w-[110px]">{t("aboutPage.experience")}</span>
                            <span className="text-sm font-medium">{safeTeam[currentSlide].experience || "-"}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed border-t border-primary/15 pt-4">
                            {safeTeam[currentSlide].bio}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                  {t("servicesPage.loading")}
                </div>
              )}
            </div>
            {safeTeam.length > 1 ? (
              <div className="flex justify-center space-x-2 mt-4 pb-4">
                {safeTeam.map((member, index) => (
                  <button
                    key={member.id}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "bg-primary scale-125" : "bg-primary/20 hover:bg-primary/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
