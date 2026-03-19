import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetCategories, useCreateCategory, useUpdateCategory, useDeleteCategory, getGetCategoriesQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable()
});

type FormValues = z.infer<typeof schema>;

export default function AdminCategories() {
  const { data: categories, isLoading } = useGetCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", slug: "", description: "", imageUrl: "" }
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    form.reset({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      imageUrl: cat.imageUrl || ""
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset({ name: "", slug: "", description: "", imageUrl: "" });
  };

  const onSubmit = (data: FormValues) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
          toast({ title: "SUKSES", description: "Kategori diperbarui." });
          handleCancelEdit();
        }
      });
    } else {
      createMutation.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
          toast({ title: "SUKSES", description: "Kategori ditambahkan." });
          handleCancelEdit();
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("KONFIRMASI: Hapus kategori ini? Data yang terkait mungkin terpengaruh.")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
          toast({ title: "SUKSES", description: "Kategori dihapus." });
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-4xl mb-8">MANAJEMEN KATEGORI</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border shadow-lg sticky top-8">
              <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
                <h2 className="font-display text-2xl">{editingId ? "EDIT KATEGORI" : "TAMBAH BARU"}</h2>
                {editingId && <button onClick={handleCancelEdit}><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>}
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Nama Kategori</label>
                  <input 
                    type="text" 
                    {...form.register("name", {
                      onChange: (e) => {
                        if(!editingId) form.setValue("slug", generateSlug(e.target.value))
                      }
                    })} 
                    className="w-full bg-background border border-border px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                  />
                  {form.formState.errors.name && <p className="text-destructive text-[10px] mt-1 font-bold">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Slug URL</label>
                  <input 
                    type="text" 
                    {...form.register("slug")} 
                    className="w-full bg-background border border-border px-3 py-2 text-muted-foreground focus:outline-none focus:border-accent"
                  />
                  {form.formState.errors.slug && <p className="text-destructive text-[10px] mt-1 font-bold">{form.formState.errors.slug.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Deskripsi</label>
                  <textarea 
                    {...form.register("description")} 
                    rows={3}
                    className="w-full bg-background border border-border px-3 py-2 text-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">URL Gambar Khusus</label>
                  <input 
                    type="text" 
                    {...form.register("imageUrl")} 
                    className="w-full bg-background border border-border px-3 py-2 text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground p-3 font-bold uppercase tracking-widest mt-4 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.1)] transition-all"
                >
                  {editingId ? <><Save className="w-4 h-4"/> SIMPAN PERUBAHAN</> : <><Plus className="w-4 h-4"/> TAMBAH</>}
                </button>
              </form>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                    <th className="p-4 font-bold">Kategori</th>
                    <th className="p-4 font-bold">Total Item</th>
                    <th className="p-4 font-bold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    <tr><td colSpan={3} className="p-8 text-center font-bold uppercase tracking-widest text-muted-foreground">MEMUAT DATA...</td></tr>
                  ) : categories?.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center font-bold uppercase tracking-widest text-muted-foreground">BELUM ADA KATEGORI</td></tr>
                  ) : categories?.map(cat => (
                    <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-lg mb-1">{cat.name}</div>
                        <div className="text-xs text-muted-foreground">/{cat.slug}</div>
                      </td>
                      <td className="p-4 font-bold font-display text-2xl">{cat.productCount}</td>
                      <td className="p-4 text-right space-x-2">
                        <button 
                          onClick={() => handleEdit(cat)}
                          className="inline-flex p-2 bg-background border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          disabled={deleteMutation.isPending || cat.productCount > 0}
                          title={cat.productCount > 0 ? "Kosongkan produk dulu" : "Hapus"}
                          className="inline-flex p-2 bg-background border border-border text-muted-foreground hover:text-destructive hover:border-destructive transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
      </div>
    </AdminLayout>
  )
}
