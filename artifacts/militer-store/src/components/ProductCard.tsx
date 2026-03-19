import { Link } from "wouter";
import { Product } from "@workspace/api-client-react/src/generated/api.schemas";
import { ShoppingCart, Crosshair } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const formatIDR = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  {/* tactical placeholder */}
  const fallbackImg = "https://images.unsplash.com/photo-1595590424283-b8f1784cb2c6?w=800&q=80";

  return (
    <Link href={`/produk/${product.id}`} className="group relative bg-card flex flex-col h-full border border-border transition-all duration-300 hover:border-accent hover:shadow-[0_0_20px_rgba(255,191,0,0.1)]">
      {/* Target reticle corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-muted-foreground/30 group-hover:border-accent z-20 pointer-events-none transition-colors" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-muted-foreground/30 group-hover:border-accent z-20 pointer-events-none transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-muted-foreground/30 group-hover:border-accent z-20 pointer-events-none transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-muted-foreground/30 group-hover:border-accent z-20 pointer-events-none transition-colors" />

      <div className="aspect-square w-full overflow-hidden bg-muted relative border-b border-border">
        <img 
          src={product.imageUrl || fallbackImg} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 group-hover:brightness-110 transition-all duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {product.featured && (
          <div className="absolute top-3 left-3 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-md">
            Unggulan
          </div>
        )}
        {!product.isActive && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-1">
            Habis
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 relative z-10 bg-card">
        <div className="text-[10px] text-accent font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
          <Crosshair className="w-3 h-3" />
          {product.categoryName || 'Taktikal'}
        </div>
        
        <h3 className="font-display text-2xl leading-tight mb-2 group-hover:text-accent transition-colors line-clamp-2 uppercase">
          {product.name}
        </h3>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
          <span className="font-bold text-xl tracking-wide text-foreground">
            {formatIDR(product.price)}
          </span>
          <div className="w-10 h-10 bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-accent group-hover:border-accent group-hover:text-accent-foreground transition-all duration-300">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  )
}
