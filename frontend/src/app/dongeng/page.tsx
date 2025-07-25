"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, MapPin, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DongengListItem } from "../data/dongengData";
import { getDongengList } from "../data/dongengService";

export default function DongengPage() {
  const [dongengList, setDongengList] = useState<DongengListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDongengs = async () => {
      try {
        setLoading(true);
        const data = await getDongengList();
        setDongengList(data);
      } catch (err) {
        setError("Failed to load dongeng data");
        console.error("Error loading dongengs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDongengs();
  }, []);

  const filteredDongeng = dongengList.filter((dongeng) =>
    dongeng.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Terjadi kesalahan
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-sunrise py-12"
      >
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Koleksi Dongeng Nusantara
          </h1>
          <p className="text-lg text-wood-dark">
            Jelajahi kekayaan cerita rakyat dari berbagai daerah di Indonesia
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari judul dongeng..."
                className="w-full pl-12 pr-4 py-5 text-base rounded-xl shadow-soft bg-white"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dongeng Grid */}
      <section className="py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDongeng.length > 0 ? (
              filteredDongeng.map((dongeng: DongengListItem, index: number) => (
                <motion.div
                  key={dongeng.id}
                  initial={{ opacity: 0, y: 50, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="group border-border shadow-soft hover:shadow-warm transition-organic h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getCategoryColor(dongeng.category)}>
                          {dongeng.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-foreground group-hover:text-primary transition-gentle">
                        {dongeng.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {dongeng.region}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                        {dongeng.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/dongeng/${dongeng.id}`}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Baca Dongeng
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center md:col-span-2 lg:col-span-3 py-12">
                <h3 className="text-xl font-semibold text-foreground">
                  Dongeng Tidak Ditemukan
                </h3>
                <p className="text-muted-foreground mt-2">
                  Tidak ada dongeng yang cocok dengan pencarian `{searchQuery}`.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
