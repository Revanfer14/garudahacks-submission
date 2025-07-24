import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Volume2 } from "lucide-react";
import heroImage from "@/assets/hero-village.jpg";
import { features } from "./data/features";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-mist" />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 drop-shadow-lg">
            Nusantara Stories
          </h1>
          <p className="text-xl md:text-2xl text-wood-dark mb-8 drop-shadow-md">
            Melestarikan dongeng dan budaya Indonesia untuk generasi masa depan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dongeng" passHref>
              <Button
                size="lg"
                variant="default"
                className="flex items-center gap-2"
              >
                <BookOpen className="h-5 w-5" />
                Jelajahi Dongeng
              </Button>
            </Link>
            <Link href="/dongeng" passHref>
              <Button
                size="lg"
                variant="village"
                className="flex items-center gap-2"
              >
                <Volume2 className="h-5 w-5" />
                Dengarkan Cerita
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
              <Card
                key={index}
                className="border-border shadow-soft hover:shadow-warm transition-organic"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gradient-earth rounded-full w-fit">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-wood-light/30">
        <div className="container max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Tentang Nusantara Stories
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Indonesia memiliki ribuan dongeng dan cerita rakyat yang mengandung
            nilai-nilai moral dan wisdom nenek moyang. Melalui platform ini,
            kami berkomitmen untuk melestarikan warisan budaya tersebut dan
            membuatnya dapat diakses oleh semua kalangan, termasuk teman-teman
            tunanetra melalui fitur text-to-speech.
          </p>

          <Link href="/dongeng">
            <Button variant="earth" size="lg">
              Mulai Membaca Dongeng
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
