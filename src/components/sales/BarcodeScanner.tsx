
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Scan, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BarcodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export default function BarcodeScanner({ isOpen, onClose, onScan }: BarcodeScannerProps) {
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Erreur d'accès à la caméra:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  }, [toast]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
      setManualCode("");
      onClose();
    }
  };

  const simulateScan = () => {
    // Simulation d'un scan pour démonstration
    const mockCodes = ["1234567890123", "9876543210987", "5555555555555"];
    const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
    onScan(randomCode);
    onClose();
  };

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera();
    }
    return () => {
      if (isScanning) {
        stopCamera();
      }
    };
  }, [isOpen, isScanning, startCamera, stopCamera]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Scan className="mr-2 h-5 w-5" />
            Scanner Code-barres / QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Zone de scan caméra */}
          <div className="space-y-3">
            <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden">
              {isScanning ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              {/* Overlay de scan */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {!isScanning ? (
                <Button onClick={startCamera} className="flex-1 bg-green-600 hover:bg-green-700">
                  <Camera className="mr-2 h-4 w-4" />
                  Démarrer la caméra
                </Button>
              ) : (
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  <X className="mr-2 h-4 w-4" />
                  Arrêter
                </Button>
              )}
              
              {/* Bouton de simulation pour démonstration */}
              <Button onClick={simulateScan} variant="outline">
                Simuler Scan
              </Button>
            </div>
          </div>

          {/* Saisie manuelle */}
          <div className="border-t pt-4">
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Ou saisir manuellement :
                </label>
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Code-barres ou QR code"
                  className="mt-1"
                />
              </div>
              <Button type="submit" className="w-full" disabled={!manualCode.trim()}>
                Valider le code
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
