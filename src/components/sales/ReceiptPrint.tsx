
import { forwardRef } from "react";
import Image from "next/image";

interface ReceiptData {
  numero_vente: string;
  date_vente: string;
  client_nom: string;
  client_telephone?: string;
  articles: Array<{
    produit_nom: string;
    quantite: number;
    prix_unitaire: number;
    prix_total: number;
  }>;
  sous_total: number;
  remise_montant: number;
  total: number;
  mode_paiement: string;
  vendeur_nom: string;
}

interface ReceiptPrintProps {
  data: ReceiptData;
}

const ReceiptPrint = forwardRef<HTMLDivElement, ReceiptPrintProps>(
  ({ data }, ref) => {
    return (
      <div ref={ref} className="max-w-sm mx-auto bg-white p-4 text-sm font-mono">
        {/* En-tête */}
        <div className="text-center mb-4 border-b-2 border-dashed border-gray-400 pb-4">
          <div className="flex justify-center mb-2">
            <Image 
              src="/logo-ciss-mcvtqbgx.jpeg" 
              alt="CISS ST MOISE"
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <h1 className="text-lg font-bold">CISS ST MOISE</h1>
          <p className="text-xs">Couture et Mode Traditionnelle</p>
          <p className="text-xs">Saint-Moise, Côte d'Ivoire</p>
          <p className="text-xs">Tél: +225 XXX XXX XXX</p>
        </div>

        {/* Informations de vente */}
        <div className="mb-4 space-y-1">
          <div className="flex justify-between">
            <span>N° Vente:</span>
            <span className="font-bold">{data.numero_vente}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(data.date_vente).toLocaleString("fr-FR")}</span>
          </div>
          <div className="flex justify-between">
            <span>Client:</span>
            <span>{data.client_nom}</span>
          </div>
          {data.client_telephone && (
            <div className="flex justify-between">
              <span>Tél:</span>
              <span>{data.client_telephone}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Vendeur:</span>
            <span>{data.vendeur_nom}</span>
          </div>
        </div>

        {/* Articles */}
        <div className="border-t-2 border-dashed border-gray-400 pt-2 mb-4">
          <div className="grid grid-cols-12 gap-1 text-xs font-bold mb-2">
            <div className="col-span-6">ARTICLE</div>
            <div className="col-span-2 text-center">QTÉ</div>
            <div className="col-span-2 text-right">P.U.</div>
            <div className="col-span-2 text-right">TOTAL</div>
          </div>
          
          {data.articles.map((article, index) => (
            <div key={index} className="grid grid-cols-12 gap-1 text-xs mb-1">
              <div className="col-span-6 truncate">{article.produit_nom}</div>
              <div className="col-span-2 text-center">{article.quantite}</div>
              <div className="col-span-2 text-right">{article.prix_unitaire.toLocaleString()}</div>
              <div className="col-span-2 text-right">{article.prix_total.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Totaux */}
        <div className="border-t-2 border-dashed border-gray-400 pt-2 mb-4 space-y-1">
          <div className="flex justify-between">
            <span>Sous-total:</span>
            <span>{data.sous_total.toLocaleString()} FCFA</span>
          </div>
          {data.remise_montant > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Remise:</span>
              <span>-{data.remise_montant.toLocaleString()} FCFA</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-400 pt-1">
            <span>TOTAL:</span>
            <span>{data.total.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between">
            <span>Mode paiement:</span>
            <span className="uppercase">{data.mode_paiement}</span>
          </div>
        </div>

        {/* Pied de page */}
        <div className="text-center text-xs border-t-2 border-dashed border-gray-400 pt-4">
          <p className="mb-2">Merci pour votre confiance !</p>
          <p>Suivez-nous sur:</p>
          <p>Facebook: cissstmoise1</p>
          <p>Instagram: ciss_st_moise</p>
          <p className="mt-2">www.ciss-stmoise.ci</p>
        </div>

        {/* Code-barres simulé */}
        <div className="text-center mt-4">
          <div className="inline-block bg-black text-white px-2 py-1 text-xs font-mono">
            ||||| |||| | |||| |||||
          </div>
          <p className="text-xs mt-1">{data.numero_vente}</p>
        </div>
      </div>
    );
  }
);

ReceiptPrint.displayName = "ReceiptPrint";

export default ReceiptPrint;
