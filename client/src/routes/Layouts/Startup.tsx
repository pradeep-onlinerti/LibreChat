import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import type { TStartupConfig } from 'librechat-data-provider';
import { useGetStartupConfig } from '~/data-provider';
import AuthLayout from '~/components/Auth/AuthLayout';
import { TranslationKeys, useLocalize } from '~/hooks';

const headerMap: Record<string, TranslationKeys> = {
  '/login': 'com_auth_welcome_back',
  '/register': 'com_auth_create_account',
  '/forgot-password': 'com_auth_reset_password',
  '/reset-password': 'com_auth_reset_password',
  '/login/2fa': 'com_auth_verify_your_identity',
};

/**
 * RTI Mitra brand colors (matches screenshot):
 *  Primary teal:  #1a7f7a  (buttons, accents)
 *  Dark navy:     #1a2b4a  (footer, headings)
 *  Light bg:      #f0f8ff  (page background)
 */

export default function StartupLayout({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [error, setError] = useState<TranslationKeys | null>(null);
  const [headerText, setHeaderText] = useState<TranslationKeys | null>(null);
  const [startupConfig, setStartupConfig] = useState<TStartupConfig | null>(null);

  // ── Responsive image: track viewport width via matchMedia ──
  // Using matchMedia instead of CSS <picture> or injected CSS because:
  // - CSS background-image in injected <style> tags isn't re-evaluated on resize in DevTools
  // - <picture><source media="..."> only evaluates at page load, not on resize
  // - matchMedia fires a live 'change' event whenever the breakpoint is crossed,
  //   causing React to re-render with the correct inline backgroundImage src,
  //   which triggers a real network request for the new image.
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  );

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    setIsMobile(mql.matches); // sync immediately on mount
    return () => mql.removeEventListener('change', handler);
  }, []);

  const {
    data,
    isFetching,
    error: startupConfigError,
  } = useGetStartupConfig({
    enabled: isAuthenticated ? startupConfig === null : true,
  });

  const localize = useLocalize();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/c/new', { replace: true });
    }
    if (data) {
      setStartupConfig(data);
    }
  }, [isAuthenticated, navigate, data]);

  // Set page title to RTI Mitra branding
  useEffect(() => {
    document.title =
      startupConfig?.appTitle || 'RTI Mitra – Draft RTI Applications Instantly Using AI';
  }, [startupConfig?.appTitle]);

  // Inject RTI Mitra CSS variables and base styles into the document root
  useEffect(() => {
    const styleId = 'rti-mitra-theme';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        :root {
          --rti-primary:       #1a7f7a;
          --rti-primary-dark:  #145f5b;
          --rti-primary-light: #e6f5f4;
          --rti-navy:          #1a2b4a;
          --rti-text:          #2d3748;
          --rti-muted:         #718096;
          --rti-bg:            #f7fbff;
          --rti-card:          #ffffff;
          --rti-border:        #d1e8e6;
          --rti-warning-bg:    #fffbeb;
          --rti-warning-border:#f6c90e;
        }

        /* ── Page shell ── */
        body {
          background-color: var(--rti-bg);
          font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
          color: var(--rti-text);
        }

        /* ── RTI Mitra Navbar ── */
        .rti-navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          height: 64px;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .rti-navbar__brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--rti-navy);
          text-decoration: none;
        }
        .rti-navbar__brand span {
          color: var(--rti-primary);
        }
        .rti-navbar__logo {
          width: 36px;
          height: 36px;
          background: var(--rti-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 0.9rem;
        }
        .rti-navbar__links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .rti-navbar__links a {
          color: var(--rti-text);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s;
        }
        .rti-navbar__links a:hover { color: var(--rti-primary); }
        .rti-navbar__login-btn {
          background: var(--rti-primary);
          color: #fff !important;
          padding: 0.45rem 1.2rem;
          border-radius: 6px;
          font-weight: 600;
          transition: background 0.2s !important;
        }
        .rti-navbar__login-btn:hover {
          background: var(--rti-primary-dark) !important;
          color: #fff !important;
        }

        /* ── Hero section ── */
        .rti-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
          padding: 3rem 1.5rem 2rem;
        }
        .rti-hero__content {
          width: 100%;
        }

        /* ── Hero image (dimensions only — src set via React inline style) ── */
        .rti-hero__img {
          width: 100%;
          aspect-ratio: 16 / 7;
          background-size: cover;
          background-position: center;
          border-radius: 12px;
          display: block;
        }
        @media (max-width: 768px) {
          .rti-hero__img {
            aspect-ratio: 4 / 3;
          }
        }

        .rti-hero__title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--rti-navy);
          line-height: 1.2;
          margin: 0 0 0.75rem;
        }
        .rti-hero__subtitle {
          font-size: 1.05rem;
          color: var(--rti-muted);
          margin: 0 0 1.5rem;
        }
        .rti-hero__cta {
          display: inline-block;
          background: var(--rti-primary);
          color: #fff;
          padding: 0.75rem 1.6rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .rti-hero__cta:hover {
          background: var(--rti-primary-dark);
          transform: translateY(-1px);
        }
        .rti-hero__google-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          background: #fff;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          width: fit-content;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .rti-hero__google-btn:hover {
          border-color: var(--rti-primary);
          box-shadow: 0 2px 8px rgba(26,127,122,0.15);
        }
        .rti-trust-badge {
          text-align: center;
          font-size: 0.8rem;
          color: var(--rti-muted);
          padding: 0 1.5rem 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .rti-hero__content {
            min-height: unset;
          }
        }

        /* ── Login section (full-width, directly below hero) ── */
        .rti-login-section {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem 1.5rem;
        }

        /* ── Two-column body (features + notes, below login) ── */
        .rti-body {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1.5rem 1.5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 640px) {
          .rti-body { grid-template-columns: 1fr; }
          .rti-hero { flex-direction: column; padding: 2rem 1rem 1rem; }
          .rti-hero__title { font-size: 1.7rem; }
        }

        /* ── Feature card ── */
        .rti-features-card {
          background: var(--rti-card);
          border: 1px solid var(--rti-border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .rti-features-card__title {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--rti-primary);
          margin: 0 0 1rem;
        }
        .rti-feature-item {
          display: flex;
          gap: 0.6rem;
          margin-bottom: 0.85rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        .rti-feature-item__icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .rti-feature-item strong { color: var(--rti-navy); }

        /* ── How it works ── */
        .rti-how-works {
          background: linear-gradient(135deg, #e6f5f4 0%, #d0eeec 100%);
          border-radius: 12px;
          padding: 1.25rem;
          margin-top: 1rem;
        }
        .rti-how-works__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--rti-navy);
          margin: 0 0 0.75rem;
        }
        .rti-step {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 0.6rem;
          font-size: 0.88rem;
        }
        .rti-step__num {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--rti-primary);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ── Login card ── */
        .rti-login-card {
          background: var(--rti-card);
          border: 1px solid var(--rti-border);
          border-radius: 12px;
          padding: 1.5rem;
        }
        .rti-login-card__title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--rti-navy);
          margin: 0 0 1.1rem;
        }

        /* ── Important note ── */
        .rti-note-card {
          background: var(--rti-warning-bg);
          border: 1px solid var(--rti-warning-border);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }
        .rti-note-card__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--rti-navy);
          margin: 0 0 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .rti-note-card ul {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--rti-text);
        }

        /* ── Coming soon ── */
        .rti-coming-soon {
          background: var(--rti-card);
          border: 1px solid var(--rti-border);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
        }
        .rti-coming-soon__title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--rti-navy);
          margin: 0 0 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .rti-coming-soon ul {
          margin: 0;
          padding-left: 1.2rem;
          font-size: 0.88rem;
          line-height: 1.7;
          color: var(--rti-muted);
        }

        /* ── Footer ── */
        .rti-footer {
          background: var(--rti-navy);
          color: #cbd5e0;
          margin-top: 3rem;
          padding: 1.5rem 2rem 1rem;
          font-size: 0.85rem;
          text-align: center;
        }
        .rti-footer__links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }
        .rti-footer__links a {
          color: #cbd5e0;
          text-decoration: none;
          font-weight: 500;
        }
        .rti-footer__links a:hover { color: #fff; }
        .rti-footer__copy {
          color: #718096;
          font-size: 0.78rem;
          margin-top: 0.5rem;
        }

        /* ── Auth form elements inside Outlet ── */
        .rti-input {
          width: 100%;
          padding: 0.65rem 0.9rem;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .rti-input:focus {
          outline: none;
          border-color: var(--rti-primary);
          box-shadow: 0 0 0 3px rgba(26,127,122,0.12);
        }
        .rti-submit-btn {
          width: 100%;
          background: var(--rti-primary);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.75rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          margin-bottom: 0.75rem;
        }
        .rti-submit-btn:hover { background: var(--rti-primary-dark); }
      `;
      document.head.appendChild(style);
    }
    return () => {
      // Clean up on unmount if needed
    };
  }, []);

  useEffect(() => {
    setError(null);
    setHeaderText(null);
  }, [location.pathname]);

  const contextValue = {
    error,
    setError,
    headerText,
    setHeaderText,
    startupConfigError,
    startupConfig,
    isFetching,
  };

  // Derived from isMobile state — changes trigger a re-render and a new network request
  const heroImageSrc = isMobile
    ? '/assets/rti-mitra-illu-mobile.png'
    : '/assets/rti-mitra-illu-mr.png';

  return (
    <div className="rti-page-root">

      {/* ── Hero ── */}
      <div className="rti-hero">
        <div className="rti-hero__content">
          {/*
            backgroundImage is set via React inline style so the browser
            makes a real network request whenever isMobile flips.
            This is guaranteed to work in DevTools device simulation
            and on real mobile devices — unlike <picture> or injected CSS.
          */}
          <div
            className="rti-hero__img"
            role="img"
            aria-label="RTI Mitra – Your AI friend for all your RTI needs"
            style={{ backgroundImage: `url('${heroImageSrc}')` }}
          />
        </div>
      </div>

      <p className="rti-trust-badge">
        🏢 Built by the team behind OnlineRTI.com &nbsp;|&nbsp; ⚡ 10+ years of RTI experience
      </p>

      {/* ── Login card — directly below hero ── */}
      <div className="rti-login-section">
        <div className="rti-login-card">
          <h2 className="rti-login-card__title">Login to Draft RTIs</h2>
          <AuthLayout
            header={headerText ? localize(headerText) : localize(headerMap[location.pathname])}
            isFetching={isFetching}
            startupConfig={startupConfig}
            startupConfigError={startupConfigError}
            pathname={location.pathname}
            error={error}
          >
            <Outlet context={contextValue} />
          </AuthLayout>
        </div>
      </div>

      {/* ── Two-column body (features, notes) — below login ── */}
      <div className="rti-body">
        {/* Left column — features + how it works */}
        <div>
          <div className="rti-features-card">
            <h2 className="rti-features-card__title">Why Try RTI Mitra<sup>Beta</sup>?</h2>

            <div className="rti-feature-item">
              <span className="rti-feature-item__icon">⚡</span>
              <span><strong>Instant Drafting:</strong> Generate a complete RTI application.</span>
            </div>
            <div className="rti-feature-item">
              <span className="rti-feature-item__icon">✅</span>
              <span><strong>Completely Free:</strong> No charges for AI drafting.</span>
            </div>
            <div className="rti-feature-item">
              <span className="rti-feature-item__icon">🌐</span>
              <span>
                <strong>Supports English &amp; Regional</strong> Inputs:<br />
                Write in English, Hinglish, or your local language.
              </span>
            </div>
            <div className="rti-feature-item">
              <span className="rti-feature-item__icon">📋</span>
              <span>
                <strong>Works for Most RTI Use Cases:</strong> Income tax refunds, EPF issues,
                passport delays, local government matters, and more.
              </span>
            </div>
          </div>

          <div className="rti-how-works" id="how-it-works" style={{ marginTop: '1rem' }}>
            <p className="rti-how-works__title">How RTI Mitra Works</p>
            <div className="rti-step">
              <span className="rti-step__num">1</span>
              <span>Ask your <strong>question</strong> in simple language</span>
            </div>
            <div className="rti-step">
              <span className="rti-step__num">2</span>
              <span>AI drafts a <strong>complete RTI</strong> for you.</span>
            </div>
            <div className="rti-step">
              <span className="rti-step__num">3</span>
              <span>You <strong>file the RTI</strong> on the government portal</span>
            </div>
          </div>
        </div>

        {/* Right column — important note + coming soon */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="rti-note-card">
            <p className="rti-note-card__title">⚠️ Important Note</p>
            <ul>
              <li>RTI Mitra currently only <strong>drafts RTI applications</strong>.</li>
              <li>Filing must be done by <strong>you</strong> on official government portals or offline.</li>
              <li>Most portals require only a simple <strong>OTP</strong> to submit.</li>
              <li>Our guides and support team will help if you face difficulty.</li>
            </ul>
          </div>

          <div className="rti-coming-soon">
            <p className="rti-coming-soon__title">🔜 Coming Soon</p>
            <ul>
              <li>Search government information automatically</li>
              <li>Find answers from previous RTIs</li>
              <li>Guided filing support</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}