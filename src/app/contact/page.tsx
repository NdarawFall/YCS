import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8 glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 text-red-500" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold mb-4">
            <Mail className="h-3.5 w-3.5" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Contactez l'équipe Marvid</h1>
          <p className="text-white/50 text-sm mt-1">Une question, une suggestion ou besoin d'aide ? Écrivez-nous.</p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Votre nom</label>
            <input
              type="text"
              placeholder="Ex: Alexandre"
              required
              className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/25 font-medium bg-white/5 border border-white/10 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Adresse Email</label>
            <input
              type="email"
              placeholder="Ex: alexandre@gmail.com"
              required
              className="w-full h-11 px-4 rounded-xl text-white placeholder:text-white/25 font-medium bg-white/5 border border-white/10 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Message</label>
            <textarea
              rows={4}
              placeholder="Décrivez votre demande..."
              required
              className="w-full p-4 rounded-xl text-white placeholder:text-white/25 font-medium bg-white/5 border border-white/10 focus:outline-none focus:border-red-500 resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl font-bold text-white border-0 transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 8px 30px rgba(255,0,0,0.3)' }}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Envoyer le message
          </Button>
        </form>
      </div>
    </div>
  );
}
