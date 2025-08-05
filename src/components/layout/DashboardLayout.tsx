import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
    Home, 
    ShoppingCart, 
    Settings, 
    LogOut, 
    Users, 
    FileText, 
    Warehouse, 
    Calendar,
    BarChart,
    Palette,
    Ruler,
    Shirt,
    BookUser,
    Menu
} from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Utilisateur mock par défaut
  const user = {
    id: "admin-001",
    email: "admin@woomaan.com",
    nom: "Admin",
    prenom: "WOOMAAN",
    role: "admin",
    actif: true,
    mot_de_passe: "********",
    magasin_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  useEffect(() => {
    if (!isMobile) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  const adminNavItems = [
    { href: "/dashboard", label: "Vue d'ensemble", icon: BarChart },
    { href: "/dashboard/clients", label: "Clients", icon: BookUser },
    { href: "/dashboard/mesures", label: "Mesures", icon: Ruler },
    { href: "/dashboard/stock", label: "Stock", icon: Warehouse },
    { href: "/dashboard/produits", label: "Produits", icon: Shirt },
    { href: "/dashboard/collections", label: "Collections", icon: Palette },
    { href: "/dashboard/rapports", label: "Rapports", icon: FileText },
    { href: "/dashboard/admin", label: "Administration", icon: Settings },
  ];

  const userNavItems = [
    { href: '/dashboard', label: 'Tableau de bord', icon: Home, roles: ['manager', 'vendeur', 'employe'] },
    { href: '/dashboard/sales', label: 'Ventes', icon: ShoppingCart, roles: ['manager', 'vendeur'] },
    { href: '/dashboard/stock', label: 'Gestion Stock', icon: Warehouse, roles: ['manager', 'vendeur'] },
    { href: '/dashboard/clients', label: 'Clients', icon: Users, roles: ['manager', 'vendeur'] },
    { href: '/dashboard/collections', label: 'Collections', icon: Calendar, roles: ['manager'] },
    { href: '/dashboard/reports', label: 'Rapports', icon: FileText, roles: ['manager'] },
  ];

  const handleLogout = () => {
    router.push('/');
  }

  const currentNavItems = user.role === 'admin' 
    ? adminNavItems 
    : userNavItems.filter(item => user.role && item.roles.includes(user.role));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className={cn(
        "w-64 bg-gradient-to-b from-black to-gray-900 text-white p-4 flex-col fixed h-full shadow-xl z-20 transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0"
      )}>
        <div className="flex items-center space-x-3 p-4 border-b border-gray-700/50">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src="/woomaan-logo.svg"
              alt="WOOMAAN by Yolanda Diva Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">WOOMAAN</h2>
            <p className="text-sm woomaan-text-gradient">BY YOLANDA DIVA</p>
          </div>
        </div>
        
        <nav className="flex-grow mt-4 overflow-y-auto">
          <ul className="space-y-1">
            {currentNavItems.map(item => (
              <li key={item.href}>
                <Link href={item.href} className={cn(
                    "flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-gray-700 hover:shadow-md",
                    router.pathname === item.href ? 'bg-gray-700 shadow-md border-l-4 border-yellow-500' : 'text-gray-100'
                )}>
                  <item.icon className="mr-3 h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span className="">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="border-t border-gray-700 pt-4">
            <div className="p-3 bg-gray-800/50 rounded-lg mb-3">
                <p className="font-semibold text-gray-100 truncate">{user.prenom} {user.nom}</p>
                <p className="text-sm woomaan-text-gradient capitalize">{user.role}</p>
            </div>
          <Button 
            onClick={handleLogout} 
            variant="ghost" 
            className="w-full justify-start text-left p-3 hover:bg-red-500/20 hover:text-red-300 text-gray-200 transition-all duration-200"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Retour à l'accueil
          </Button>
        </div>
      </aside>
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", "lg:ml-64")}>
        <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md">
                <Menu className="h-6 w-6" />
            </button>
            <div className="text-lg font-semibold text-black">WOOMAAN</div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-sm min-h-full p-6">
                {children}
            </div>
        </main>
      </div>
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
