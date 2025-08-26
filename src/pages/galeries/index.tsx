"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  ChevronRight,
  ChevronLeft, 
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
  Youtube,
  Play,
  X,
  Clock,
  Menu
} from "lucide-react";

// ----- Types et données -----
interface Photo {
  id: string
  title: string
  date: string
  description: string
  src: string
}

// Polos
const poloPhotos: Photo[] = [
  { id: "polo1", title: "", date: "", description: "", src: "/galeries/polo1.jpeg" },
  { id: "polo2", title: "", date: "", description: "", src: "/galeries/polo2.jpeg" },
  { id: "polo3", title: "", date: "", description: "", src: "/galeries/polo3.jpeg" },
  { id: "polo4", title: "", date: "", description: "", src: "/galeries/polo4.jpeg" },
  { id: "polo5", title: "", date: "", description: "", src: "/galeries/polo5.jpeg" },
  { id: "polo6", title: "", date: "", description: "", src: "/galeries/polo6.jpeg" },
]

// Majestes
const majestePhotos: Photo[] = [
  { id: "majeste1", title: "", date: "", description: "", src: "/galeries/majeste1.jpeg" },
  { id: "majeste2", title: "", date: "", description: "", src: "/galeries/majeste2.jpeg" },
  { id: "majeste3", title: "", date: "", description: "", src: "/galeries/majeste3.jpeg" },
  { id: "majeste4", title: "", date: "", description: "", src: "/galeries/majeste4.jpeg" },
  { id: "majeste5", title: "", date: "", description: "", src: "/galeries/majeste5.jpeg" },
  { id: "majeste6", title: "", date: "", description: "", src: "/galeries/majeste6.jpeg" },
]

// Entrepides
const entrepidePhotos: Photo[] = [
  { id: "entrepide1", title: "", date: "", description: "", src: "/galeries/entrepide1.jpeg" },
  { id: "entrepide2", title: "", date: "", description: "", src: "/galeries/entrepide2.jpeg" },
  { id: "entrepide3", title: "", date: "", description: "", src: "/galeries/entrepide3.jpeg" },
  { id: "entrepide4", title: "", date: "", description: "", src: "/galeries/entrepide4.jpeg" },
  { id: "entrepide5", title: "", date: "", description: "", src: "/galeries/entrepide5.jpeg" },
]

// Flames
const flamePhotos: Photo[] = [
  { id: "flame1", title: "", date: "", description: "", src: "/galeries/flame1.jpeg" },
  { id: "flame2", title: "", date: "", description: "", src: "/galeries/flame2.jpeg" },
  { id: "flame3", title: "", date: "", description: "", src: "/galeries/flame3.jpeg" },
  { id: "flame4", title: "", date: "", description: "", src: "/galeries/flame4.jpeg" },
  { id: "flame5", title: "", date: "", description: "", src: "/galeries/flame5.jpeg" },
]

// Classique
const classiquePhotos: Photo[] = [
  { id: "classique1", title: "", date: "", description: "", src: "/galeries/classique1.jpeg" },
  { id: "classique2", title: "", date: "", description: "", src: "/galeries/classique2.jpeg" },
  { id: "classique3", title: "", date: "", description: "", src: "/galeries/classique3.jpeg" },
]

// Assurance
const assurancePhotos: Photo[] = [
  { id: "ass1", title: "", date: "", description: "", src: "/galeries/assurance1.jpeg" },
  { id: "ass2", title: "", date: "", description: "", src: "/galeries/assurance2.jpeg" },
  { id: "ass3", title: "", date: "", description: "", src: "/galeries/assurance3.jpeg" },
]

const allPhotos: Photo[] = [
  ...poloPhotos,
  ...majestePhotos,
  ...entrepidePhotos,
  ...flamePhotos,
  ...classiquePhotos,
  ...assurancePhotos,
]

// ----- Composant GalleryGrid -----
function GalleryGrid({ photos, openLightbox }: { photos: Photo[]; openLightbox: (image: Photo, index: number) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
      {photos.map((photo, index) => (
        <div
          key={photo.id}
          className="overflow-hidden rounded-xl shadow-md cursor-pointer group"
          onClick={() => openLightbox(photo, index)}
        >
          <div className="relative aspect-square">
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.title || "Image galerie"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <div className="p-3 text-white">
                <h3 className="font-medium text-sm">{photo.title}</h3>
                <p className="text-xs text-white/80">{photo.date}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ----- Composant de contenu de la galerie -----
function GaleriesContent() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = (image: Photo, index: number) => {
    setSelectedImage(image)
    setCurrentIndex(index)
  }

  const closeLightbox = () => setSelectedImage(null)

  const goToPrevious = () => {
    const newIndex = (currentIndex - 1 + allPhotos.length) % allPhotos.length
    setSelectedImage(allPhotos[newIndex])
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % allPhotos.length
    setSelectedImage(allPhotos[newIndex])
    setCurrentIndex(newIndex)
  }

  return (
    <>
     <div className="container px-4 py-12 md:px-6 md:py-20 flex-grow">
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <div className="w-40 h-40 mt-2">
                  <Image
                    src="/images/woomaanlogo.png"
                    alt="WOOMAAN by Yolanda Diva Logo"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/#collections" className="text-gray-700 hover:text-black transition-colors">Collections</Link>
              <Link href="/catalogue" className="text-amber-800 font-semibold">Catalogue</Link>
              <Link href="/#about" className="text-gray-700 hover:text-black transition-colors">À Propos</Link>
              <Link href="/galeries" className="text-gray-700 hover:text-black transition-colors">Galeries</Link>
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

      {/* Header */}
      <header className="text-center space-y-4 mt-16">
        <h1 className="text-4xl md:text-5xl ml-40 font-bold">Galeries Photos</h1>
        <p className="text-muted-foreground mr-48 md:text-lg max-w-2xl mx-auto">
          Découvrez les tenues de nos créations à travers notre galerie de photos.
        </p>
      </header>

      {/* Tabs */}
      <Tabs defaultValue="all" className="mt-12 ml-44 ">
        <TabsList className="grid grid-cols-2 md:grid-cols-7 gap-2">
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="majeste">Majestes</TabsTrigger>
          <TabsTrigger value="entrepide">Entrepides</TabsTrigger>
          <TabsTrigger value="flame">Flames</TabsTrigger>
          <TabsTrigger value="classique">Classique</TabsTrigger>
          <TabsTrigger value="assurance">Assurance</TabsTrigger>
          <TabsTrigger value="polo">Polos</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-8">
          <GalleryGrid photos={allPhotos} openLightbox={openLightbox} />
        </TabsContent>
        <TabsContent value="polo" className="mt-8">
          <GalleryGrid photos={poloPhotos} openLightbox={openLightbox} />
        </TabsContent>
        <TabsContent value="majeste" className="mt-8">
          <GalleryGrid photos={majestePhotos} openLightbox={openLightbox} />
        </TabsContent>
        <TabsContent value="entrepide" className="mt-8">
          <GalleryGrid photos={entrepidePhotos} openLightbox={openLightbox} />
        </TabsContent>
        <TabsContent value="flame" className="mt-8">
          <GalleryGrid photos={flamePhotos} openLightbox={openLightbox} />
        </TabsContent>
        <TabsContent value="classique" className="mt-8">
          <GalleryGrid photos={classiquePhotos} openLightbox={openLightbox} />
        </TabsContent>
        <TabsContent value="assurance" className="mt-8">
          <GalleryGrid photos={assurancePhotos} openLightbox={openLightbox} />
        </TabsContent>
      </Tabs>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>
          <button
            className="absolute left-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.title || "Image galerie"}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
              <h3 className="font-bold">{selectedImage.title}</h3>
              <p className="text-sm text-white/80">{selectedImage.date}</p>
              <p className="mt-2">{selectedImage.description}</p>
            </div>
          </div>
          <button
            className="absolute right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
    <footer className="bg-gradient-to-br from-gray-900 to-black text-white py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Grille principale */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
      
      {/* Logo + description */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <div className="w-48 h-40 mb-6">
          <Image
            src="/images/woomaanlogo.png"
            alt="WOOMAAN by Yolanda Diva Logo"
            width={400}
            height={400}
            className="object-contain"
          />
        </div>
        <p className="text-gray-300 leading-relaxed max-w-sm">
          Révélez votre élégance africaine avec nos créations haute couture. 
          Chaque pièce raconte une histoire unique, célébrant la beauté et la sophistication 
          de la femme africaine moderne.
        </p>
      </div>
      
      {/* Navigation */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h4 className="text-lg font-semibold mb-4 mt-16">Navigation</h4>
        <ul className="space-y-3">
          <li>
            <Link href="#collections" className="text-gray-300 hover:text-white transition-colors">
              Collections
            </Link>
          </li>
          <li>
            <Link href="/catalogue" className="text-gray-300 hover:text-white transition-colors">
              Catalogue
            </Link>
          </li>
          <li>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
              À Propos
            </Link>
          </li>
          <li>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Contact */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
        <h4 className="text-lg font-semibold mb-4 mt-16">Contact</h4>
        <ul className="space-y-3">
          <li className="flex items-center justify-center md:justify-start space-x-2">
            <Phone className="w-4 h-4 text-amber-500" />
            <span className="text-gray-300">+225 07 47 06 15</span>
          </li>
          <li className="flex items-center justify-center md:justify-start space-x-2">
            <Mail className="w-4 h-4 text-amber-500" />
            <span className="text-gray-300">woomaan.diva@gmail.com</span>
          </li>
          <li className="flex items-center justify-center md:justify-start space-x-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span className="text-gray-300">Cocody, Abidjan</span>
          </li>
        </ul>
      </div>
    </div>
    
    {/* Bas du footer */}
    <div className="border-t border-gray-700 pt-8">
      <div className="flex flex-col items-center space-y-4">
        {/* Réseaux sociaux */}
        <div className="flex space-x-4">
          <Link href="https://www.instagram.com/woomaanofficial?igsh=cDFsOHN0NXBzdGI2" target="__blank">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
              <Instagram className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="https://www.facebook.com/share/1FMRXfJ4Wb/" target="__blank">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
              <Facebook className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="https://m.youtube.com/watch?v=LHHXOujZT2I" target="__blank">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
              <Youtube className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        
        {/* Copyright */}
        <p className="text-gray-400 text-sm text-center">
          © 2024 WOOMAAN by Yolanda Diva. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</footer>
    </>
  
    
  )
}

// Export par défaut du composant principal
export default GaleriesContent
