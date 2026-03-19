import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Save, Shield } from "lucide-react";

const schema = z.object({
  storeName: z.string().min(1, "Wajib diisi"),
  whatsappNumber: z.string().min(1, "Wajib diisi"),
  heroTitle: z.string().min(1, "Wajib diisi"),
  storeDescription: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  operatingHours: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminSettings() {
  const { data: settings, isLoading } = useGetSettings();
  const updateMutation = useUpdateSettings();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      storeName: "", whatsappNumber: "", heroTitle: "", 
      storeDescription: "", heroSubtitle: "", address: "", 
      email: "", operatingHours: ""
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        storeName: settings.storeName,
        whatsappNumber: settings.whatsappNumber,
        heroTitle: settings.heroTitle,
        storeDescription: settings.storeDescription || "",
        heroSubtitle: settings.heroSubtitle || "",
        address: settings.address || "",
        email: settings.email || "",
        operatingHours: settings.operatingHours || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({ data }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "SUKSES", description: "Pengaturan berhasil disimpan." });
      },
      onError: (err: any) => toast({ title: "GAGAL", description: err.message, variant: "destructive" })
    });
  };

  if (isLoading) return <AdminLayout><div className="p-8 font-bold text-center">MEMUAT...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
           <Shield className="w-10 h-10 text-accent" />
           <h1 className="font-display text-4xl">PENGATURAN SISTEM</h1>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-card border border-border shadow-lg">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-2xl">INFORMASI TOKO</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Nama Entitas Toko</label>
                <input type="text" {...form.register("storeName")} className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent" />
                {form.formState.errors.storeName && <p className="text-destructive text-[10px] mt-1 font-bold">{form.formState.errors.storeName.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Nomor WhatsApp Operasional</label>
                <input type="text" {...form.register("whatsappNumber")} placeholder="Misal: 62812345678" className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent" />
                {form.formState.errors.whatsappNumber && <p className="text-destructive text-[10px] mt-1 font-bold">{form.formState.errors.whatsappNumber.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Deskripsi Global</label>
                <textarea {...form.register("storeDescription")} rows={3} className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border shadow-lg">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-2xl">PENGATURAN BERANDA (HERO)</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Judul Utama</label>
                <input type="text" {...form.register("heroTitle")} className="w-full bg-background border border-border px-4 py-3 font-display text-2xl text-foreground focus:outline-none focus:border-accent uppercase" />
                {form.formState.errors.heroTitle && <p className="text-destructive text-[10px] mt-1 font-bold">{form.formState.errors.heroTitle.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Sub Judul</label>
                <textarea {...form.register("heroSubtitle")} rows={2} className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent resize-none" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border shadow-lg">
            <div className="p-6 border-b border-border">
              <h2 className="font-display text-2xl">KONTAK & LOKASI FISIK</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Alamat Lengkap</label>
                <textarea {...form.register("address")} rows={2} className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Email Intelijen</label>
                <input type="email" {...form.register("email")} className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Jam Operasional</label>
                <input type="text" {...form.register("operatingHours")} className="w-full bg-background border border-border px-4 py-3 text-foreground focus:outline-none focus:border-accent" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-10 py-5 font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50 text-lg"
            >
              <Save className="w-6 h-6" /> SIMPAN PENGATURAN
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
