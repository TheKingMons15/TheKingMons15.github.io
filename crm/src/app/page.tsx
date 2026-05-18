import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "rTMS - Estimulación Magnética Transcraneal Repetitiva | Neurotec Ecuador",
  description:
    "Adquiere el equipo de Estimulación Magnética Transcraneal Repetitiva (rTMS) más avanzado para el tratamiento no invasivo de trastornos neurológicos. Tecnología FDA aprobada.",
};

export default function LandingPage() {
  return (
    <>
      <link rel="stylesheet" href="/css/styles.css" precedence="default" />
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
        precedence="default"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
        precedence="default"
      />

      {/* Header */}
      <header className="navbar">
        <div className="container navbar-content">
          <div className="logo-wrapper">
            <img src="/img/logo.png" alt="Logo Neurotec" className="logo" />
          </div>
          <nav className="nav-menu">
            <a href="#inicio" className="nav-link">Inicio</a>
            <a href="#tecnologia" className="nav-link">Tecnología</a>
            <a href="#beneficios" className="nav-link">Beneficios</a>
            <a href="#contacto" className="nav-link">Contacto</a>
            <a href="/brochure.html" className="nav-link btn-brochure">📄 Brochure</a>
          </nav>
          <button className="mobile-menu-btn" id="mobileMenuBtn">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero" id="inicio">
        <div className="hero-bg-gradient"></div>
        <div className="container hero-content">
          <div className="hero-text">
            <div className="badge">
              <span className="badge-dot"></span>
              Tecnología médica avanzada
            </div>
            <h1 className="hero-title">
              Equipo de Estimulación Magnética{" "}
              <span className="text-gradient">Transcraneal Repetitiva</span> (rTMS)
            </h1>
            <p className="hero-description">
              Adquiere el equipo tecnológico más avanzado para el tratamiento no invasivo
              de trastornos neurológicos y psiquiátricos. Tecnología de vanguardia ideal
              para tu clínica o consultorio.
            </p>
            <div className="hero-buttons">
              <a href="#contacto" className="btn btn-primary">
                <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                WhatsApp: 098 401 7341
              </a>
              <a href="/brochure.html" className="btn btn-secondary">
                Ver Brochure Digital
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">FDA</span>
                <span className="stat-label">Aprobado</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">No Invasivo</span>
                <span className="stat-label">Tecnología segura</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">+95%</span>
                <span className="stat-label">Satisfacción</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-card">
              <div className="image-glow"></div>
              <img
                src="/img/rtms-machine.png"
                alt="Equipo rTMS - Estimulación Magnética Transcraneal"
                className="machine-img"
              />
              <div className="image-badge">
                <span className="pulse-dot"></span>
                Equipo Certificado
              </div>
            </div>
            <div className="floating-card card-1">
              <div className="floating-icon">🧠</div>
              <span>Neuromodulación</span>
            </div>
            <div className="floating-card card-2">
              <div className="floating-icon">✓</div>
              <span>Sin dolor</span>
            </div>
            <div className="floating-card card-3">
              <div className="floating-icon">⚡</div>
              <span>Resultados rápidos</span>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Tecnología */}
      <section className="section-technology" id="tecnologia">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Tecnología</span>
            <h2 className="section-title">¿Qué es la rTMS?</h2>
            <p className="section-subtitle">
              La Estimulación Magnética Transcraneal Repetitiva es una técnica
              neurofisiológica que permite modular la actividad cerebral de forma segura.
            </p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a9 9 0 0 1 9 9c0 3.1-1.6 5.8-4 7.4V21a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-2.6C4.6 16.8 3 14.1 3 11a9 9 0 0 1 9-9z" />
                  </svg>
                ),
                cls: "icon-brain",
                title: "Neuromodulación",
                text: "Estimulación precisa de áreas cerebrales específicas para regular la actividad neuronal.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                cls: "icon-shield",
                title: "100% Seguro",
                text: "Procedimiento no invasivo, sin anestesia, sin efectos secundarios significativos.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                ),
                cls: "icon-clock",
                title: "Optimización de Tiempo",
                text: "Equipos eficientes para sesiones de 20-40 minutos, optimizando el flujo de pacientes.",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                ),
                cls: "icon-check",
                title: "Evidencia Científica",
                text: "Respaldado por estudios clínicos y aprobado por organismos regulatorios internacionales.",
              },
            ].map((f) => (
              <div className="feature-card" key={f.title}>
                <div className={`feature-icon ${f.cls}`}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="section-benefits" id="beneficios">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-text">
              <span className="section-badge badge-light">Aplicaciones</span>
              <h2 className="section-title text-white">Aplicaciones Clínicas del Equipo</h2>
              <ul className="benefits-list">
                {[
                  { title: "Depresión resistente", desc: "Cuando los medicamentos no son suficientes" },
                  { title: "Trastornos de ansiedad", desc: "Ansiedad generalizada y pánico" },
                  { title: "TOC", desc: "Trastorno obsesivo-compulsivo" },
                  { title: "Dolor crónico", desc: "Fibromialgia y migrañas" },
                  { title: "Rehabilitación neurológica", desc: "Post-ACV y lesiones cerebrales" },
                ].map((b) => (
                  <li className="benefit-item" key={b.title}>
                    <span className="benefit-check">✓</span>
                    <div>
                      <strong>{b.title}</strong>
                      <p>{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="benefits-image">
              <div className="benefits-card">
                <img src="/img/rtms-machine.png" alt="Equipo rTMS" className="benefits-machine" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cta" id="contacto">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">¿Quieres conocer más sobre nuestro equipo?</h2>
              <p className="cta-text">
                Solicita información sobre nuestro equipo de rTMS y descubre cómo esta
                tecnología puede ser implementada en centros médicos y de rehabilitación.
              </p>
              <div className="cta-buttons">
                <a
                  href="https://wa.me/5930984017341"
                  className="btn btn-whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="btn-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  WhatsApp: 098 401 7341
                </a>
                <a href="/brochure.html" className="btn btn-outline-white">
                  Abrir Brochure
                </a>
              </div>
            </div>
            <div className="cta-decoration">
              <div className="decoration-circle circle-1"></div>
              <div className="decoration-circle circle-2"></div>
              <div className="decoration-circle circle-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/img/logo.png" alt="Logo" className="footer-logo" />
              <p className="footer-text">
                Comercialización de equipos médicos de tecnología avanzada para terapias
                neurológicas y psiquiátricas.
              </p>
            </div>
            <div className="footer-links">
              <h4>Enlaces</h4>
              <a href="#inicio">Inicio</a>
              <a href="#tecnologia">Tecnología</a>
              <a href="#beneficios">Beneficios</a>
              <a href="/brochure.html">Brochure</a>
            </div>
            <div className="footer-contact">
              <h4>Contacto</h4>
              <p>📱 WhatsApp: 098 401 7341</p>
              <p>📧 neurotececuador@gmail.com</p>
              <p>📍 Quito, Ecuador</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 Neurotec Ecuador. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      <Script src="/js/main.js" strategy="afterInteractive" />
    </>
  );
}
