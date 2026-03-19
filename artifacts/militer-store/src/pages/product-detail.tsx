import { PublicLayout } from "@/components/layout/PublicLayout";
import { useParams, Link } from "wouter";
import { useGetProduct, useGetSettings, useGetProducts } from "@workspace/api-client-react";
import { ArrowLeft, ShieldCheck, Check, Info, MessageCircleWarning } from "lucide-react";
import { format } from "date-fns";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading } = useGetProduct(productId);
  const { data: settings } = useGetSettings();
  
  // Fetch related by category
  const { data: relatedProducts } = useGetProducts({ categoryId: product?.categoryId || undefined });

  const formatIDR = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const handleBuyWhatsApp = () => {
    if (!settings?.whatsappNumber || !product) return;
    const message = `Halo ${settings.storeName},\n\nSaya ingin memesan produk berikut:\n*${product.name}*\nHarga: ${formatIDR(product.price)}\nURL: ${window.location.href}\n\nApakah stok masih tersedia?`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-24 flex justify-center">
           <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PublicLayout>
    )
  }

  if (!product) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="font-display text-6xl mb-4">404 - PRODUK HILANG</h1>
          <p className="text-muted-foreground mb-8">Produk yang Anda cari tidak ditemukan dalam database arsenal kami.</p>
          <Link href="/produk" className="text-accent font-bold uppercase tracking-widest hover:underline">Kembali ke Katalog</Link>
        </div>
      </PublicLayout>
    )
  }

  const fallbackImg = "https://images.unsplash.com/photo-1595590424283-b8f1784cb2c6?w=800&q=80";

  return (
    <PublicLayout>
      <div className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-4">
          <Link href="/produk" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> KEMBALI
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Image Gallery Area */}
          <div className="bg-card border border-border p-4 relative">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-accent -translate-x-2 -translate-y-2 pointer-events-none" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-accent translate-x-2 translate-y-2 pointer-events-none" />
             
             <div className="aspect-square bg-muted relative overflow-hidden">
               <img 
                 src={product.imageUrl || fallbackImg} 
                 alt={product.name} 
                 className="w-full h-full object-cover" 
               />
               {!product.isActive && (
                 <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                   <span className="font-display text-5xl text-destructive rotate-12 border-4 border-destructive px-6 py-2">STOK HABIS</span>
                 </div>
               )}
             </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-accent font-bold uppercase tracking-widest text-sm mb-4">
              {product.categoryName || 'Taktikal'}
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-foreground leading-none mb-6">
              {product.name}
            </h1>
            
            <div className="text-4xl font-bold text-foreground mb-8 pb-8 border-b border-border/50">
              {formatIDR(product.price)}
            </div>

            <div className="space-y-6 mb-10 flex-1">
              <div>
                <h3 className="flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-muted-foreground mb-3">
                  <Info className="w-4 h-4" /> Spesifikasi & Deskripsi
                </h3>
                <div className="prose prose-invert prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
                  <p className="whitespace-pre-wrap">{product.description}</p>
                </div>
              </div>

              <div className="bg-card border border-border p-5 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Status</div>
                  <div className="flex items-center gap-2 font-bold text-sm uppercase">
                    {product.isActive ? (
                      <><Check className="w-4 h-4 text-primary" /> <span className="text-primary">Tersedia</span></>
                    ) : (
                      <><MessageCircleWarning className="w-4 h-4 text-destructive" /> <span className="text-destructive">Habis</span></>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Sisa Stok</div>
                  <div className="font-bold text-lg">{product.stock} Unit</div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBuyWhatsApp}
              disabled={!product.isActive || !settings?.whatsappNumber}
              className="w-full group relative inline-flex items-center justify-center px-8 py-5 text-xl font-bold uppercase tracking-widest bg-accent text-accent-foreground shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.15)] hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
            >
              <ShieldCheck className="w-6 h-6 mr-3" />
              {product.isActive ? 'PESAN VIA WHATSAPP' : 'STOK KOSONG'}
            </button>
            {!settings?.whatsappNumber && (
              <p className="text-center text-xs text-destructive mt-3 uppercase font-bold">Nomor WhatsApp toko belum diatur</p>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
