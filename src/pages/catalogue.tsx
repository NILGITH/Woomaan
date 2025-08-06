import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function CataloguePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-20 mt-8">
                <Image
                  src="/images/logo_woomaan.svg"
                  alt="WOOMAAN by Yolanda Diva Logo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-black tracking-wider">WOOMAAN</h1>
                <p className="text-xs woomaan-text-gradient font-medium tracking-wide">BY YOLANDA DIVA</p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/#collections" className="text-gray-700 hover:text-black transition-colors">Collections</Link>
              <Link href="/catalogue" className="text-amber-800 font-semibold">Catalogue</Link>
              <Link href="/#about" className="text-gray-700 hover:text-black transition-colors">À Propos</Link>
              <Link href="/#contact" className="text-gray-700 hover:text-black transition-colors">Contact</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push("/boutique")}
                className="hidden sm:flex border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Boutique
              </Button>
              <Button 
                onClick={() => router.push("/dashboard")}
                className="woomaan-bg-gradient hover:opacity-90 text-white font-medium"
              >
                Espace Pro
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <section className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Notre Catalogue
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos créations exclusives et laissez-vous séduire par l'art de la haute couture africaine
            </p>
          </div>
        </div>
      </section>

      {/* PDF Viewer Stylisé */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Header du PDF */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-white font-semibold">Catalogue WOOMAAN 2024</h2>
                    <p className="text-white/80 text-sm">Collection exclusive</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Contenu du PDF */}
            <div className="relative">
              <div className="w-full h-[calc(100vh-200px)] min-h-[800px]">
                <object
                  data="/document/catalogue.pdf#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&view=FitH"
                  type="application/pdf"
                  className="w-full h-full"
                  onContextMenu={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.ctrlKey || e.metaKey) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Catalogue WOOMAAN</h3>
                      <p className="text-gray-600 mb-4">Votre navigateur ne peut pas afficher le PDF directement.</p>
                      <Button 
                        onClick={() => window.open('/document/catalogue.pdf', '_blank')}
                        className="woomaan-bg-gradient hover:opacity-90 text-white"
                      >
                        Ouvrir le Catalogue
                      </Button>
                    </div>
                  </div>
                </object>
              </div>
            </div>

            {/* Footer du PDF */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span>WOOMAAN by Yolanda Diva</span>
                  <span>•</span>
                  <span>Collection 2024</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12">
                <Image
                  src="/woomaan-logo.svg"
                  alt="WOOMAAN by Yolanda Diva Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold tracking-wider">WOOMAAN</h3>
                <p className="text-sm woomaan-text-gradient font-medium tracking-wide">BY YOLANDA DIVA</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Révélez votre élégance africaine avec nos créations haute couture
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <Link href="https://www.instagram.com/woomaanofficial?igsh=cDFsOHN0NXBzdGI2" target="__blank">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://www.facebook.com/share/1FMRXfJ4Wb/" target="__blank">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="https://m.youtube.com/watch?v=LHHXOujZT2I&fbclid=PAQ0xDSwL-qElleHRuA2FlbQIxMAABp_peGWCYAgHG6sinV9n5eRs_JwU1TYZsDSeQerHKXJb_Bz70eDISlUzgNvXJ_aem_Tzkkg2mc_ZQZ6QAPUeygyA" target="__blank">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="border-t border-gray-700 pt-8">
              <p className="text-gray-400 text-sm">
                © 2024 WOOMAAN by Yolanda Diva. Tous droits réservés.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 