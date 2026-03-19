import { AdminLayout } from "@/components/layout/AdminLayout";
import { useParams, useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateProduct, useUpdateProduct, useGetProduct, useGetCategories, getGetProductsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.coerce.number().min(0, "Harga tidak valid"),
  stock: z.coerce.number().min(0, "Stok tidak valid"),
  categoryId: z.coerce.number().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export default function AdminProductForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const [_, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories } = useGetCategories();
  const { data: product, isLoading } = useGetProduct(Number(id), { query: { enabled: isEdit } });

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      categoryId: undefined,
      imageUrl: "",
      featured: false,
      isActive: true,
    }
  });

  useEffect(() => {
    if (product && isEdit) {
      form.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId || undefined,
        imageUrl: product.imageUrl || "",
        featured: product.featured,
        isActive: product.isActive,
      });
    }
  }, [product, isEdit, form]);

  const onSubmit = (data: FormValues) => {
    const payload = {
      ...data,
      categoryId: data.categoryId || null,
      imageUrl: data.imageUrl || null,
    };

    if (isEdit) {
      updateMutation.mutate({ id: Number(id), data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          toast({ title: "BERHASIL", description: "Data produk diperbarui." });
          setLocation("/admin/products");
        },
        onError: (err: any) => toast({ title: "GAGAL", description: err.message, variant: "destructive" })
      });
    } else {
      createMutation.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
          toast({ title: "BERHASIL", description: "Produk baru ditambahkan." });
          setLocation("/admin/products");
        },
        onError: (err: any) => toast({ title: "GAGAL", description: err.message, variant: "destructive" })
      });
    }
  };

  if (isEdit && isLoading) return <AdminLayout><div className="p-8 text-center font-bold">MEMUAT DATA...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="p-2 border border-border bg-card hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-4xl">{isEdit ? "EDIT PRODUK" : "TAMBAH PRODUK BARU"}</h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-card border border-border p-6 shadow-md">
                <h2 className="font-display text-2xl mb-6 border-b border-border pb-2">INFORMASI DASAR</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Nama Produk</label>
                    <input 
                      type="text" 
                      {...form.register("name")} 
                      className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                    />
                    {form.formState.errors.name && <p className="text-destructive text-xs mt-1 font-bold">{form.formState.errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Deskripsi</label>
                    <textarea 
                      {...form.register("description")} 
                      rows={6}
                      className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent resize-none"
                    />
                    {form.formState.errors.description && <p className="text-destructive text-xs mt-1 font-bold">{form.formState.errors.description.message}</p>}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border p-6 shadow-md">
                <h2 className="font-display text-2xl mb-6 border-b border-border pb-2">MEDIA</h2>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">URL Gambar</label>
                  <input 
                    type="text" 
                    {...form.register("imageUrl")} 
                    placeholder="https://..."
                    className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent mb-4"
                  />
                  {form.watch("imageUrl") && (
                    <div className="w-32 h-32 border border-border bg-background p-1">
                      <img src={form.watch("imageUrl") as string} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border p-6 shadow-md">
                <h2 className="font-display text-2xl mb-6 border-b border-border pb-2">INVENTARIS</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Harga (Rp)</label>
                    <input 
                      type="number" 
                      {...form.register("price")} 
                      className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                    />
                    {form.formState.errors.price && <p className="text-destructive text-xs mt-1 font-bold">{form.formState.errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Stok Tersedia</label>
                    <input 
                      type="number" 
                      {...form.register("stock")} 
                      className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent"
                    />
                    {form.formState.errors.stock && <p className="text-destructive text-xs mt-1 font-bold">{form.formState.errors.stock.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Kategori</label>
                    <select 
                      {...form.register("categoryId")}
                      className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent uppercase text-sm font-bold tracking-wider appearance-none"
                    >
                      <option value="">-- Pilih Kategori --</option>
                      {categories?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border p-6 shadow-md">
                <h2 className="font-display text-2xl mb-6 border-b border-border pb-2">STATUS</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-border bg-background hover:border-accent transition-colors">
                    <input type="checkbox" {...form.register("isActive")} className="w-5 h-5 accent-accent" />
                    <span className="font-bold uppercase tracking-widest text-sm">Aktifkan Produk</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 border border-border bg-background hover:border-accent transition-colors">
                    <input type="checkbox" {...form.register("featured")} className="w-5 h-5 accent-accent" />
                    <span className="font-bold uppercase tracking-widest text-sm">Tandai Unggulan</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-border">
            <button 
              type="submit" 
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5" /> SIMPAN DATA
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
