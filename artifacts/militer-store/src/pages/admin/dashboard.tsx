import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetProducts, useGetCategories } from "@workspace/api-client-react";
import { Package, Tags, AlertTriangle, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function AdminDashboard() {
  const { data: products } = useGetProducts();
  const { data: categories } = useGetCategories();

  const totalProducts = products?.length || 0;
  const outOfStock = products?.filter(p => p.stock <= 0).length || 0;
  const activeProducts = products?.filter(p => p.isActive).length || 0;
  const totalCategories = categories?.length || 0;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl mb-8">LAPORAN SITUASI</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card border-l-4 border-l-primary border-y border-r border-border p-6 shadow-lg shadow-black/50">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/20 text-primary">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground text-right">Total<br/>Produk</h3>
            </div>
            <div className="font-display text-5xl">{totalProducts}</div>
          </div>

          <div className="bg-card border-l-4 border-l-accent border-y border-r border-border p-6 shadow-lg shadow-black/50">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-accent/20 text-accent">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground text-right">Produk<br/>Aktif</h3>
            </div>
            <div className="font-display text-5xl">{activeProducts}</div>
          </div>

          <div className="bg-card border-l-4 border-l-destructive border-y border-r border-border p-6 shadow-lg shadow-black/50">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-destructive/20 text-destructive">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground text-right">Stok<br/>Habis</h3>
            </div>
            <div className="font-display text-5xl text-destructive">{outOfStock}</div>
          </div>

          <div className="bg-card border-l-4 border-l-secondary-foreground border-y border-r border-border p-6 shadow-lg shadow-black/50">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-secondary text-secondary-foreground">
                <Tags className="w-6 h-6" />
              </div>
              <h3 className="font-bold uppercase tracking-widest text-xs text-muted-foreground text-right">Total<br/>Kategori</h3>
            </div>
            <div className="font-display text-5xl">{totalCategories}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-card border border-border">
             <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-2xl">AKSES CEPAT</h2>
             </div>
             <div className="p-6 flex flex-col gap-4">
                <Link href="/admin/products/new" className="flex items-center justify-between p-4 bg-background border border-border hover:border-primary transition-colors group">
                  <span className="font-bold uppercase tracking-widest text-sm">Tambah Produk Baru</span>
                  <span className="text-primary font-display text-xl group-hover:translate-x-1 transition-transform">-&gt;</span>
                </Link>
                <Link href="/admin/categories" className="flex items-center justify-between p-4 bg-background border border-border hover:border-primary transition-colors group">
                  <span className="font-bold uppercase tracking-widest text-sm">Kelola Kategori</span>
                  <span className="text-primary font-display text-xl group-hover:translate-x-1 transition-transform">-&gt;</span>
                </Link>
                <Link href="/admin/settings" className="flex items-center justify-between p-4 bg-background border border-border hover:border-primary transition-colors group">
                  <span className="font-bold uppercase tracking-widest text-sm">Pengaturan Toko</span>
                  <span className="text-primary font-display text-xl group-hover:translate-x-1 transition-transform">-&gt;</span>
                </Link>
             </div>
           </div>
        </div>
      </div>
    </AdminLayout>
  )
}
