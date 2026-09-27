import React from 'react';
import { Phone, MessageCircle, Heart, ShieldCheck, Smile } from 'lucide-react';

interface BusinessCardBadgeProps {
  compact?: boolean;
  onOpenContact?: () => void;
}

export const BusinessCardBadge: React.FC<BusinessCardBadgeProps> = ({ compact = false }) => {
  const phone1 = '(27) 9 9581-6987';
  const phone2 = '(27) 9 9956-3226';
  const phoneClean1 = '5527995816987';
  const phoneClean2 = '5527999563226';

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 px-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-stone-950 font-bold shadow-sm shrink-0">
          🚐
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider">Transporte Escolar</p>
          <p className="text-sm font-bold text-stone-900 truncate">Tia Drika</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-stone-600">
          <a
            href={`https://wa.me/${phoneClean1}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition shadow-xs text-xs"
            title="Falar no WhatsApp com Tia Drika"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-6 text-stone-950 shadow-md border-2 border-amber-300">
      {/* Background Graphic Elements */}
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-amber-300/40 pointer-events-none blur-xl" />
      <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-amber-600/30 pointer-events-none blur-lg" />
      
      {/* Decorative top stripe */}
      <div className="h-1.5 w-full bg-stone-950 rounded-full mb-4 opacity-80" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
        {/* Left Side: Brand & Phone Contacts */}
        <div className="md:col-span-7 space-y-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-stone-900 font-extrabold text-xs sm:text-sm uppercase tracking-widest bg-amber-300/60 px-2.5 py-0.5 rounded-md border border-amber-600/20">
              <ShieldCheck className="w-4 h-4 text-stone-900" />
              Transporte Escolar Regulamentado
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-display mt-1">
              TIA DRIKA
            </h1>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${phoneClean1}`}
                className="inline-flex items-center gap-2 bg-stone-950 text-white hover:bg-stone-800 transition px-3.5 py-2 rounded-xl font-bold text-sm shadow-sm"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{phone1}</span>
              </a>

              <a
                href={`https://wa.me/${phoneClean1}?text=Ol%C3%A1%20Tia%20Drika,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20transporte%20escolar!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white transition px-3 py-2 rounded-xl font-semibold text-sm shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 1</span>
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`tel:${phoneClean2}`}
                className="inline-flex items-center gap-2 bg-stone-950 text-white hover:bg-stone-800 transition px-3.5 py-2 rounded-xl font-bold text-sm shadow-sm"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>{phone2}</span>
              </a>

              <a
                href={`https://wa.me/${phoneClean2}?text=Ol%C3%A1%20Tia%20Drika,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20transporte%20escolar!`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white transition px-3 py-2 rounded-xl font-semibold text-sm shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 2</span>
              </a>
            </div>

            <p className="text-stone-950 font-bold text-xs flex items-center gap-1 pt-1">
              <Smile className="w-4 h-4 text-amber-900" />
              <span>Faça já o seu orçamento! Atendimento humanizado e carinhoso</span>
            </p>
          </div>
        </div>

        {/* Right Side: Vehicle Visual & Slogan */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="bg-stone-950/90 text-white border-2 border-stone-800 rounded-2xl p-4 w-full shadow-lg relative">
            {/* Van Illustration with Happy Kids */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="w-full max-w-[220px] bg-stone-900 border-2 border-amber-400 rounded-xl p-3 shadow-inner text-center">
                <div className="text-3xl mb-1">🚐 👧🏽 👦🏻 👧🏼</div>
                <div className="inline-block bg-amber-400 text-stone-950 font-extrabold text-xs px-3 py-0.5 rounded tracking-widest shadow-xs">
                  ESCOLAR
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-stone-800">
              <p className="text-amber-300 font-bold text-sm italic tracking-wide">
                &ldquo;Tradição, confiança, conforto e profissionalismo&rdquo;
              </p>
              <p className="text-stone-400 text-xs mt-1">
                Transportando com amor o futuro da sua família
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
