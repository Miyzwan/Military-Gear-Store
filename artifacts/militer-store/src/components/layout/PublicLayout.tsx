import { Link, useLocation } from "wouter";
import { ShieldCheck, Menu, X, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useGetSettings } from "@workspace/api-client-react";
import { clsx } from "clsx";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { data: settings } = useGetSettings();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/produk", label: "Katalog Produk" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent text-accent-foreground flex items-center justify-center rounded-sm transform group-hover:rotate-12 transition-transform shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="font-display text-3xl font-bold tracking-widest text-foreground group-hover:text-accent transition-colors">
              {settings?.storeName || 'WARZONE'}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={clsx(
                  "font-bold uppercase tracking-widest text-sm hover:text-accent transition-colors",
                  location === link.href ? "text-accent" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-px h-6 bg-border mx-2"></div>
            <Link href="/admin/login" className="font-bold uppercase tracking-widest text-sm text-primary hover:text-primary-foreground transition-colors">
              Login Admin
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={clsx(
                  "block font-bold uppercase tracking-widest text-lg",
                  location === link.href ? "text-accent" : "text-muted-foreground"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Link 
                href="/admin/login" 
                className="block font-bold uppercase tracking-widest text-lg text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login Admin
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {children}
      </main>

      <footer className="border-t border-border bg-card pt-16 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img src={`${import.meta.env.BASE_URL}images/tactical-pattern.png`} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-8 h-8 text-accent" />
                <span className="font-display text-2xl font-bold tracking-widest">{settings?.storeName || 'WARZONE'}</span>
              </div>
              <p className="text-muted-foreground max-w-sm">
                {settings?.storeDescription || 'Menyediakan seragam dan perlengkapan militer/taktikal kualitas premium untuk kebutuhan operasional dan hobi Anda.'}
              </p>
            </div>
            <div>
              <h3 className="text-xl text-foreground mb-6">Navigasi</h3>
              <ul className="space-y-3 font-semibold uppercase tracking-wider text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-accent transition-colors">Beranda</Link></li>
                <li><Link href="/produk" className="hover:text-accent transition-colors">Katalog Produk</Link></li>
                <li><Link href="/admin/login" className="hover:text-accent transition-colors">Admin Panel</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl text-foreground mb-6">Kontak & Lokasi</h3>
              <ul className="space-y-3 text-muted-foreground">
                {settings?.address && <li><strong>Lokasi:</strong> {settings.address}</li>}
                {settings?.email && <li><strong>Email:</strong> {settings.email}</li>}
                {settings?.whatsappNumber && <li><strong>WA:</strong> {settings.whatsappNumber}</li>}
                {settings?.operatingHours && <li><strong>Jam Buka:</strong> {settings.operatingHours}</li>}
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border text-sm text-muted-foreground font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} {settings?.storeName || 'WARZONE TACTICAL'}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
