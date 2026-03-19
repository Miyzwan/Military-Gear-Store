import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, Tags, Settings, ArrowLeft, LogOut, Menu, X } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produk", icon: Package },
    { href: "/admin/categories", label: "Kategori", icon: Tags },
    { href: "/admin/settings", label: "Pengaturan", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        "fixed md:static inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col transition-transform duration-300 transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <span className="font-display text-3xl font-bold tracking-widest text-accent">COMMAND CENTER</span>
          <button className="md:hidden text-muted-foreground" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {links.map(link => {
            const Icon = link.icon;
            const isActive = location === link.href || (link.href !== "/admin" && location.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsSidebarOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-none border-l-4 font-bold uppercase tracking-wider text-sm transition-all duration-200",
                  isActive 
                    ? "border-accent bg-primary/20 text-accent shadow-[inset_4px_0px_0px_0px_rgba(255,191,0,1)]" 
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground hover:border-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-3 bg-muted text-foreground font-bold uppercase tracking-wider text-sm hover:bg-primary hover:text-primary-foreground transition-colors border border-border">
            <LogOut className="w-4 h-4" /> Keluar
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-8 justify-between shrink-0">
          <button className="md:hidden p-2 text-muted-foreground" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm font-bold uppercase tracking-widest">
            <span>Sistem Manajemen Warzone</span>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Buka Toko
          </Link>
        </header>
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-background relative">
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
             <img src={`${import.meta.env.BASE_URL}images/tactical-pattern.png`} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
