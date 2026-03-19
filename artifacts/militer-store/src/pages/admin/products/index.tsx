import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetProducts, useDeleteProduct, getGetProductsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const { data: products, isLoading } = useGetProducts();
  const deleteMutation = useDeleteProduct();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const formatIDR = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  const filtered = products?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName?.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => {
    if (confirm("KONFIRMASI: Apakah Anda yakin ingin menghapus produk ini secara permanen?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          toast({ title: "OPERASI SUKSES", description: "Produk berhasil dihancurkan dari database." });
        }
      });
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="font-display text-4xl">ARSENAL PRODUK</h1>
          <Link href="/admin/products/new" className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-bold uppercase tracking-widest text-sm hover:bg-primary/90 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] transition-all">
            <Plus className="w-4 h-4" /> TAMBAH PRODUK
          </Link>
        </div>

        <div className="bg-card border border-border shadow-lg">
          <div className="p-4 border-b border-border flex items-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Cari berdasarkan nama atau kategori..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-background border border-border pl-10 pr-4 py-2 text-sm font-bold tracking-wider placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="p-4 font-bold">Produk</th>
                  <th className="p-4 font-bold">Kategori</th>
                  <th className="p-4 font-bold">Harga</th>
                  <th className="p-4 font-bold">Stok</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-bold uppercase tracking-widest">MEMUAT DATA...</td></tr>
                ) : filtered?.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-muted-foreground font-bold uppercase tracking-widest">TIDAK ADA DATA DITEMUKAN</td></tr>
                ) : filtered?.map(product => (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-background border border-border shrink-0">
                          {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">IMG</div>}
                        </div>
                        <div className="font-bold">{product.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">{product.categoryName || '-'}</td>
                    <td className="p-4 font-bold text-primary">{formatIDR(product.price)}</td>
                    <td className="p-4 font-bold text-sm">{product.stock}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${product.isActive ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                        {product.isActive ? 'AKTIF' : 'NONAKTIF'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/products/${product.id}/edit`} className="inline-flex p-2 bg-background border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        disabled={deleteMutation.isPending}
                        className="inline-flex p-2 bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
