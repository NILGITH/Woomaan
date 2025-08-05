import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Star, 
  Sparkles, 
  Crown, 
  Heart,
  ArrowRight,
  ShoppingBag,
  Users,
  Award,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Youtube
} from "lucide-react";
import { useRouter } from "next/router";
import Image from "next/image";

const testimonials = [
  {
    name: "Julienne agbali",
    role: "",
    content: "C'est extraordinaire comme gamme madame. J'ai plus qu'adoré .",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Josia Carole AG",
    role: "",
    content: "Fantastique merveilleux comment dire... C'est fabuleux",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    name: "Ariss Zinsou",
    role: "",
    content: "Au top tout simplement...",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616c64c8c93?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

const collections = [
  {
    name: "Collection Élégance",
    description: "Sophistication et raffinement pour la femme moderne",
    image: "/images/complet1.jpg",
    pieces: 12
  },
  {
    name: "Collection Business",
    description: "Tenues professionnelles alliant style et confiance",
    image: "/images/complet2.jpg",
    pieces: 8
  },
  {
    name: "Collection Soirée",
    description: "Créations exclusives pour vos moments d'exception",
    image: "/images/complet3.jpg",
    pieces: 6
  }
];

export default function HomePage() {
  const router = useRouter();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
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
              <Link href="#collections" className="text-gray-700 hover:text-black transition-colors">Collections</Link>
              <Link href="#about" className="text-gray-700 hover:text-black transition-colors">À Propos</Link>
              <Link href="#contact" className="text-gray-700 hover:text-black transition-colors">Contact</Link>
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/acceuil.jpg"
            alt="Atelier de couture WOOMAAN - Tissus et création"
            fill
            className="object-cover "
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Badge className="woomaan-bg-gradient text-white font-semibold px-4 py-2 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Nouvelle Collection 2024
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Révélez Votre
            <span className="block woomaan-text-gradient">
              Élégance Africaine
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Créations haute couture alliant tradition africaine et sophistication moderne pour la femme d'exception
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push("/boutique")}
              className="woomaan-bg-gradient hover:opacity-90 text-white font-semibold px-8 py-4 text-lg"
            >
              Découvrir la Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-orange-800 text-black   px-8 py-4 text-lg"
            >
              <Phone className="mr-2 w-5 h-5" />
              Prendre Rendez-vous
            </Button>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="woomaan-bg-gradient text-white font-semibold px-4 py-2 mb-4">
              <Crown className="w-4 h-4 mr-2" />
              Nos Collections
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              L'Art de la Haute Couture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque collection WOOMAAN raconte une histoire unique, célébrant la beauté et l'élégance de la femme africaine contemporaine
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <Badge className="bg-white/20 text-white mb-2">
                      {collection.pieces} pièces
                    </Badge>
                    <h3 className="text-xl font-bold">{collection.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 mb-4">{collection.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-black group-hover:text-white transition-colors"
                    onClick={() => router.push("/boutique")}
                  >
                    Découvrir
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="woomaan-bg-gradient text-white font-semibold px-4 py-2 mb-6">
                <Heart className="w-4 h-4 mr-2" />
                Notre Histoire
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                WOOMAAN by Yolanda Diva
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Née de la passion de Yolanda Diva pour l'élégance africaine, WOOMAAN transcende les frontières entre tradition et modernité. Chaque création est pensée pour révéler la beauté unique de chaque femme, en célébrant notre héritage culturel avec sophistication.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                De notre atelier en Côte d'Ivoire, nous créons des pièces d'exception qui racontent votre histoire, subliment votre personnalité et vous accompagnent dans vos moments les plus précieux.
              </p>
              
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 woomaan-bg-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-black">8+</div>
                  <div className="text-sm text-gray-600">Années d'Excellence</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 woomaan-bg-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-black">500+</div>
                  <div className="text-sm text-gray-600">Clientes Satisfaites</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 woomaan-bg-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-black">100+</div>
                  <div className="text-sm text-gray-600">Créations Uniques</div>
                </div>
              </div>
              
              <Button 
                size="lg"
                onClick={() => router.push("/boutique")}
                className="woomaan-bg-gradient hover:opacity-90 text-white font-semibold"
              >
                Découvrir Nos Créations
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Image
                    src="/images/complet4.jpg"
                    alt="Création WOOMAAN Élégance - Robe sophistiquée"
                    width={300}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="/images/polo1.jpg"
                    alt="Produits de soin WOOMAAN - Huiles et crèmes de beauté"
                    width={300}
                    height={250}
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <Image
                    src="/images/complet8.jpg"
                    alt="Accessoires WOOMAAN - Sacs et bijoux"
                    width={300}
                    height={250}
                    className="rounded-lg shadow-lg"
                  />
                  <Image
                    src="/images/complet7.jpg"
                    alt="Collection Business WOOMAAN - Tailleur professionnel"
                    width={300}
                    height={400}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="woomaan-bg-gradient text-white font-semibold px-4 py-2 mb-6">
            <Heart className="w-4 h-4 mr-2" />
            Témoignages
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-16">
            Ce Que Disent Nos Clientes
          </h2>
          
          <div className="relative">
            <Card className="p-8 shadow-xl">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-xl text-gray-700 mb-8 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              
              <div className="flex items-center justify-center">
                <Image
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-black">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </Card>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black to-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prête à Révéler Votre Élégance ?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Découvrez nos créations exclusives et laissez-vous séduire par l'art de la haute couture africaine
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => router.push("/boutique")}
              className="woomaan-bg-gradient hover:opacity-90 text-white font-semibold px-8 py-4"
            >
              Explorer la Boutique
              <ShoppingBag className="ml-2 w-5 h-5" />
            </Button>
            {/* <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-black px-8 py-4"
            >
              Rendez-vous Sur Mesure
              <Phone className="ml-2 w-5 h-5" />
            </Button> */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <Badge className="woomaan-bg-gradient text-white font-semibold px-4 py-2 mb-6">
                <MapPin className="w-4 h-4 mr-2" />
                Nous Contacter
              </Badge>
              <h2 className="text-4xl font-bold text-black mb-6">
                Visitez Notre Atelier
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Venez découvrir l'univers WOOMAAN dans notre magnifique boutique-atelier située au cœur d'Abidjan. Notre équipe vous accueille pour une expérience personnalisée.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 woomaan-bg-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Adresse</h3>
                    <p className="text-gray-600">Cocody, Riviera Palmeraie<br />Abidjan, Côte d'Ivoire</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 woomaan-bg-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Téléphone</h3>
                    <p className="text-gray-600">
                    +229 01 94 94 80 80</p>
                    <p className="text-gray-600">+225 07 47 06 15</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 woomaan-bg-gradient rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-black mb-1">Email</h3>
                    <p className="text-gray-600">
                    woomaan.diva@gmail.com</p>
                
                  </div>
               
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-black mb-4">Suivez-nous</h3>
                <div className="flex space-x-4">
                  <Link href="https://www.instagram.com/woomaanofficial?igsh=cDFsOHN0NXBzdGI2" target="__blank">
                  <Button variant="outline" size="icon" className="hover:woomaan-bg-gradient hover:text-white border-amber-800 text-amber-800">
                    <Instagram className="w-5 h-5" />
                  </Button>
                  </Link>
                  <Link href="https://www.facebook.com/share/1FMRXfJ4Wb/" target="__blank">
                  <Button variant="outline" size="icon" className="hover:woomaan-bg-gradient hover:text-white border-amber-800 text-amber-800">
                    <Facebook className="w-5 h-5" />
                  </Button>
                  </Link>
                 <Link href="https://m.youtube.com/watch?v=LHHXOujZT2I&fbclid=PAQ0xDSwL-qElleHRuA2FlbQIxMAABp_peGWCYAgHG6sinV9n5eRs_JwU1TYZsDSeQerHKXJb_Bz70eDISlUzgNvXJ_aem_Tzkkg2mc_ZQZ6QAPUeygyA" target="__blank">
                 <Button variant="outline" size="icon" className="hover:woomaan-bg-gradient hover:text-white border-amber-800 text-amber-800">
                    <Youtube className="w-5 h-5" />
                  </Button>
                 </Link>
                
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg border-l-4 border-amber-600">
              <h3 className="text-2xl font-bold text-black mb-6">Horaires d'Ouverture</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Lundi - Vendredi</span>
                  <span className="text-gray-600">9h00 - 18h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Samedi</span>
                  <span className="text-gray-600">9h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Dimanche</span>
                  <span className="text-gray-600">Sur rendez-vous</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-black mb-2">Conseil Personnalisé</h4>
                <p className="text-gray-600 text-sm">
                  Prenez rendez-vous pour une consultation privée et découvrez les créations qui vous correspondent parfaitement.
                </p>
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
            {/* <div className="flex justify-center space-x-6 mb-8">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Youtube className="w-5 h-5" />
              </Button>
            </div> */}
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
