'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Volume2, Loader2 } from "lucide-react";
import { Dongeng } from "@/app/data/dongengData";
import { getDongengById } from "@/app/data/dongengService";
import { AudioPlayer } from "@/app/components/AudioPlayer";

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Moral: "bg-terracotta-light text-terracotta-dark",
    Legenda: "bg-green-hills text-green-forest",
    Petualangan: "bg-gold-sunrise text-wood-dark",
    Fantasi: "bg-wood-medium text-wood-dark",
    Fabel: "bg-accent text-accent-foreground",
  };
  return colors[category] || "bg-muted text-muted-foreground";
};

const DongengDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  const [dongeng, setDongeng] = useState<Dongeng | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!resolvedParams) return;
    
    const loadDongeng = async () => {
      try {
        setLoading(true);
        const data = await getDongengById(resolvedParams.id);
        setDongeng(data);
        if (!data) {
          setError('Dongeng tidak ditemukan');
        }
      } catch (err) {
        setError('Failed to load dongeng');
        console.error('Error loading dongeng:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDongeng();
  }, [resolvedParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat dongeng...</p>
        </div>
      </div>
    );
  }

  if (error || !dongeng) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Dongeng tidak ditemukan'}
          </h1>
          <Button asChild>
            <Link href="/dongeng">Kembali ke Daftar Dongeng</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-sunrise py-8">
        <div className="container max-w-4xl mx-auto px-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dongeng">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Dongeng
            </Link>
          </Button>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <Badge className={getCategoryColor(dongeng.category)}>
              {dongeng.category}
            </Badge>
            <div className="flex items-center text-sm text-wood-dark">
              <MapPin className="h-4 w-4 mr-1" />
              {dongeng.region}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {dongeng.title}
          </h1>

          {/* Audio Controls */}
          <div className="flex justify-center mt-8">
            <AudioPlayer content={dongeng.content} />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container max-w-4xl mx-auto px-6">
          <Card className="shadow-warm border-border">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                <Volume2 className="h-6 w-6 text-primary" />
                Isi Dongeng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                {dongeng.content
                  .split("\n\n")
                  .map((paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="mb-4 text-foreground leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Moral */}
          <Card className="mt-8 shadow-soft border-border bg-wood-light/20">
            <CardHeader>
              <CardTitle className="text-xl text-foreground">
                Pesan Moral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {dongeng.moral}
              </p>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-center mt-12">
            <Button variant="earth" asChild>
              <Link href="/dongeng">Baca Dongeng Lainnya</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DongengDetail;
