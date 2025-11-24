import { Mail, Phone, MapPin, Pin } from "lucide-react";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <Image
                            src="/TrainX.svg"
                            alt="Logo TrainX"
                            width={50}
                            height={50}
                            className="w-10 h-10"
                          />
              <div>
                <h2 className="text-[20px] font-bold text-primary">TrainX</h2>
                <p className="text-[12px] text-muted-foreground">Entrená sin límites</p>
              </div>
            </div>
            <p className="text-[14px] text-muted-foreground">
              Tu gimnasio de confianza. Entrenamientos personalizados, clases grupales y tecnología de punta para alcanzar tus objetivos.
            </p>
          </div>

          
          <div>
            <h3 className="text-[16px] font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[14px] text-muted-foreground hover:text-[#FF6B00] transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-muted-foreground hover:text-[#FF6B00] transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-muted-foreground hover:text-[#FF6B00] transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-muted-foreground hover:text-[#FF6B00] transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-[16px] font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Pin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span className="text-[14px] text-muted-foreground">
                  Av. Principal 123, Buenos Aires, Argentina
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span className="text-[14px] text-muted-foreground">+549 11 1234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary)" }} />
                <span className="text-[14px] text-muted-foreground">trainxproject@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "var(--primary)" }} />
                 <a href="#" className="text-[14px] text-muted-foreground hover:text-[#FF6B00] transition-colors">
                Mapa del Sitio
              </a>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="border-t border-border mt-8 pt-8">
           <div className="flex justify-center items-center">
            <p className="text-[14px] text-muted-foreground text-center">
              © {currentYear} TrainX. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
