import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useServices } from "@/hooks/use-services";
import { useTranslation } from "react-i18next";

const fallbackFeatures = [
  "Comprehensive care",
  "Modern treatment",
  "Experienced dentists",
  "Safe procedures",
];

const Services = () => {
  const { t } = useTranslation();
  const { data: services = [], isLoading, error } = useServices();
  const statsText = t("servicesPage.stats", { returnObjects: true }) as { label: string; description: string }[];
  const featureCardsText = t("servicesPage.featureCards", { returnObjects: true }) as { title: string; description: string }[];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">{t("servicesPage.loading")}</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl text-red-500">{t("servicesPage.error")}</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">{t("servicesPage.title")}</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("servicesPage.description")}</p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={service.id ?? index}
                className="hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3),0_12px_30px_-10px_rgba(0,0,0,0.2)] shadow-[0_10px_30px_-8px_rgba(0,0,0,0.15),0_4px_10px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 group animate-fade-in border-2 border-accent/20 hover:border-primary/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center px-6 pt-8 pb-6 border-b border-accent/20">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                  <CardTitle className="text-xl mb-3">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 px-6 pb-8">
                  <ul className="space-y-3">
                    {(service.features?.length ? service.features : fallbackFeatures).map((feature, featureIndex) => (
                      <li key={`${service.id ?? index}-${featureIndex}`} className="flex items-start space-x-3 group/item">
                        <span className="w-2 h-2 bg-primary rounded-full mt-[0.6rem] group-hover/item:ring-2 group-hover/item:ring-primary/30 transition-all duration-300"></span>
                        <span className="text-sm text-muted-foreground flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-6 border-t border-accent/20">
                    <p className="text-lg font-semibold text-primary mb-5 text-center">{service.price}</p>
                    <Link to="/appointment">
                      <Button className="w-full hover:scale-105 transition-transform duration-300 shadow-[0_8px_15px_-3px_rgba(0,0,0,0.3),0_4px_6px_-4px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.4),0_8px_10px_-6px_rgba(0,0,0,0.2)]">
                        {t("servicesPage.bookNow")}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-accent/5 to-background relative">
        <div className="absolute inset-0 border-y-2 border-primary/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{t("servicesPage.whyTitle")}</h2>
            <p className="text-xl text-muted-foreground">{t("servicesPage.whyDesc")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {["15+", "25,000+", "12", "99%"].map((number, index) => (
              <div
                key={index}
                className="group bg-card hover:bg-accent/5 p-8 rounded-xl relative transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] text-center overflow-hidden"
              >
                <div className="absolute inset-0 border-2 border-primary/20 rounded-xl"></div>
                <div className="absolute inset-[1px] bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transform origin-right transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
                <div className="relative">
                  <div className="text-4xl font-bold text-primary mb-3 group-hover:scale-110 transition-transform duration-300">{number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{statsText[index]?.label}</h3>
                  <p className="text-muted-foreground text-sm">{statsText[index]?.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCardsText.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg relative group overflow-hidden">
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

      <section className="py-20 bg-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("servicesPage.ctaTitle")}</h2>
          <p className="text-xl text-muted-foreground">{t("servicesPage.ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointment">
              <Button size="lg" className="hover:scale-105 transition-transform duration-300">{t("servicesPage.bookConsultation")}</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="hover:scale-105 transition-transform duration-300">{t("servicesPage.contactUs")}</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
