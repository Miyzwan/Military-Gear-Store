import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { Link } from "wouter";
import { useGetSettings, useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { Crosshair, ArrowRight, ShieldCheck, Zap, Target } from "lucide-react";

export default function Home() {
  const { data: settings } = useGetSettings();
  const { data: products, isLoading: isLoadingProducts } = useGetProducts({ featured: true });
  const { data: categories } = useGetCategories();

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-background border-b border-border">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Tactical Background" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-6 border border-accent/30 bg-accent/10 px-4 py-2 text-accent text-sm font-bold uppercase tracking-widest backdrop-blur-sm"
          >
            <Crosshair className="w-4 h-4" /> Standar Militer Premium
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl font-bold uppercase tracking-wider text-white mb-6 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            {settings?.heroTitle || 'TACTICAL GEAR'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-2xl text-muted-foreground font-medium mb-12 max-w-3xl mx-auto drop-shadow-md"
          >
            {settings?.heroSubtitle || 'Peralatan tempur, seragam, dan aksesoris militer tangguh untuk mendukung operasi dan petualangan ekstrem Anda.'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              href="/produk" 
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold uppercase tracking-widest bg-accent text-accent-foreground shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.15)] transition-all duration-200 border-2 border-transparent w-full sm:w-auto"
            >
              Lihat Katalog
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 text-primary rounded-none border border-primary/30">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-1 text-foreground">KUALITAS TERUJI</h3>
                <p className="text-muted-foreground text-sm">Material tangguh berstandar militer yang awet dan tahan di medan ekstrem.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 text-primary rounded-none border border-primary/30">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-1 text-foreground">PRESISI TINGGI</h3>
                <p className="text-muted-foreground text-sm">Desain ergonomis yang mendukung pergerakan taktis dan fungsionalitas maksimal.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/20 text-primary rounded-none border border-primary/30">
                <Zap className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl mb-1 text-foreground">RESPON CEPAT</h3>
                <p className="text-muted-foreground text-sm">Pemesanan langsung dan cepat melalui jalur WhatsApp terdedikasi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 border-b border-border/50 pb-6 gap-4">
            <div>
              <div className="text-accent font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                <Crosshair className="w-4 h-4" /> Arsenal Pilihan
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-foreground">PRODUK UNGGULAN</h2>
            </div>
            <Link href="/produk" className="text-muted-foreground hover:text-accent font-bold uppercase tracking-widest text-sm flex items-center gap-1 transition-colors">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-card animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products?.length === 0 && (
                <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border">
                  Belum ada produk unggulan.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-card border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/tactical-pattern.png`} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl md:text-6xl text-foreground mb-4">KATEGORI PERLENGKAPAN</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-medium">Jelajahi berbagai divisi perlengkapan untuk kebutuhan spesifik Anda.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((cat) => {
              const fallbackImg = "https://images.unsplash.com/photo-1544833215-6809db324b13?w=800&q=80"; // camo tactical abstract
              return (
              <Link 
                key={cat.id} 
                href={`/produk?category=${cat.id}`}
                className="group relative h-64 overflow-hidden border border-border hover:border-accent transition-all duration-300"
              >
                <img 
                  src={cat.imageUrl || fallbackImg} 
                  alt={cat.name} 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="font-display text-4xl text-white group-hover:text-accent transition-colors drop-shadow-md">
                    {cat.name}
                  </h3>
                  <p className="text-muted-foreground text-sm font-bold uppercase tracking-wider">
                    {cat.productCount} Item Tersedia
                  </p>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
