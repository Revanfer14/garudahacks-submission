"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import heroImage from "@/assets/hero.jpg";
import { features } from "./data/features";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-mist" />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-primary mb-6 drop-shadow-lg"
          >
            Nusakatha
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-foreground font-bold mb-8 drop-shadow-lg text-outline-primary transition-all duration-300"
          >
            Menghidupkan Kembali Keajaiban Dongeng Nusantara untuk Generasi Kini
            dan Nanti.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center sm:flex-row gap-4 justify-center"
          >
            <Link href="/dongeng" passHref>
              <Button
                size="lg"
                variant="village"
                className="flex justify-center items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Jelajahi Dongeng
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Warisan Budaya Indonesia
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan kekayaan dongeng nusantara yang telah diwariskan
              turun-temurun, dengan teknologi modern untuk aksesibilitas yang
              lebih baik.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border shadow-soft hover:shadow-warm transition-organic h-full">
                  <CardHeader>
                    <div className="p-3 bg-gradient-earth rounded-lg inline-block mb-4 shadow-warm">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-wood-light/30">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Tentang Nusakatha
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Indonesia memiliki ribuan dongeng dan cerita rakyat yang mengandung
            nilai-nilai moral dan wisdom nenek moyang. Melalui platform ini,
            kami berkomitmen untuk melestarikan warisan budaya tersebut dan
            membuatnya dapat diakses oleh semua kalangan, termasuk teman-teman
            tunanetra melalui fitur text-to-speech.
          </p>

          <Separator className="my-4" />

          <p className="text-lg font-bold text-muted-foreground mt-10 mb-4 leading-relaxed">
            Mau dengar cerita apa lagi?
          </p>

          <Link href="/request">
            <Button variant="earth" size="lg">
              Request Dongeng
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
