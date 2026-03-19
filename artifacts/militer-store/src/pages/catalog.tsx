import { PublicLayout } from "@/components/layout/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { clsx } from "clsx";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Read URL params for initial category
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) setSelectedCategory(Number(cat));
  }, []);

  const { data: products, isLoading } = useGetProducts({ 
    search: debouncedSearch || undefined,
    categoryId: selectedCategory 
  });
  
  const { data: categories } = useGetCategories();

  return (
    <PublicLayout>
      <div className="bg-card border-b border-border py-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/tactical-pattern.png`} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-widest mb-4">ARSENAL PRODUK</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Koleksi lengkap perlengkapan taktis, seragam, dan aksesoris militer untuk segala medan operasi.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle */}
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="md:hidden w-full flex items-center justify-center gap-2 bg-card border border-border p-4 font-bold uppercase tracking-widest text-sm"
        >
          <Filter className="w-4 h-4" /> Filter Kategori
        </button>

        {/* Sidebar Filters */}
        <aside className={clsx(
          "w-full md:w-64 shrink-0 flex flex-col gap-6",
          "fixed inset-0 z-50 bg-background md:bg-transparent md:static p-6 md:p-0 overflow-y-auto transition-transform duration-300 md:translate-x-0",
          isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex md:hidden items-center justify-between mb-4 pb-4 border-b border-border">
            <span className="font-display text-3xl">FILTER</span>
            <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-6 h-6" /></button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari item..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-card border border-border pl-10 pr-4 py-3 text-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all uppercase tracking-wider text-sm font-bold placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="bg-card border border-border p-5">
            <h3 className="font-display text-2xl mb-4 border-b border-border/50 pb-2">KATEGORI</h3>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setSelectedCategory(undefined); setIsMobileFilterOpen(false); }}
                className={clsx(
                  "text-left px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-l-2",
                  !selectedCategory ? "border-accent text-accent bg-accent/10" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                Semua Produk
              </button>
              {categories?.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setIsMobileFilterOpen(false); }}
                  className={clsx(
                    "text-left px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors border-l-2 flex justify-between items-center",
                    selectedCategory === cat.id ? "border-accent text-accent bg-accent/10" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {cat.name}
                  <span className="text-[10px] bg-background px-2 py-0.5 border border-border">{cat.productCount}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <div className="flex-1 w-full">
          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="aspect-[3/4] bg-card animate-pulse border border-border" />
               ))}
             </div>
          ) : products?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border bg-card/50">
              <Filter className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-display text-3xl mb-2">TARGET TIDAK DITEMUKAN</h3>
              <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter kategori.</p>
              <button 
                onClick={() => { setSearch(""); setSelectedCategory(undefined); }}
                className="mt-6 font-bold uppercase tracking-widest text-accent hover:underline"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products?.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}
