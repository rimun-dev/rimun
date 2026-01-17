import { Link } from "react-router-dom";
import "./index.scss";

export default function LandingFooter() {
  return (
    <div id="footer">
      <div id="footer-main">
        <div className="container">
          <div className="footer__section">
            <span className="footer__header"></span>
          </div>
        </div>
      </div>
      <div id="footer-gdpr">
        <div className="container">
          <nav className="footer__links">
            <ul>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/cookies">Cookies</Link>
              </li>
            </ul>
          </nav>

          <div id="social" className="flex gap-2 items-center">
            <a href="https://www.facebook.com/rimun.official" target="_blank" rel="noreferrer">
              <svg width="25" height="25" viewBox="0 0 408.788 408.788">
                <path
                  d="M353.701 0H55.087C24.665 0 .002 24.662.002 55.085v298.616c0 30.423 24.662 55.085 55.085 55.085h147.275l.251-146.078h-37.951c-4.932 0-8.935-3.988-8.954-8.92l-.182-47.087c-.019-4.959 3.996-8.989 8.955-8.989h37.882v-45.498c0-52.8 32.247-81.55 79.348-81.55h38.65c4.945 0 8.955 4.009 8.955 8.955v39.704c0 4.944-4.007 8.952-8.95 8.955l-23.719.011c-25.615 0-30.575 12.172-30.575 30.035v39.389h56.285c5.363 0 9.524 4.683 8.892 10.009l-5.581 47.087c-.534 4.506-4.355 7.901-8.892 7.901h-50.453l-.251 146.078h87.631c30.422 0 55.084-24.662 55.084-55.084V55.085C408.786 24.662 384.124 0 353.701 0z"
                  fill="#fff"
                />
              </svg>
            </a>

            <a href="https://www.instagram.com/_rimun/" target="_blank" rel="noreferrer">
              <svg width="25" height="25" viewBox="0 0 551.034 551.034">
                <path
                  d="M386.878 0H164.156C73.64 0 0 73.64 0 164.156v222.722c0 90.516 73.64 164.156 164.156 164.156h222.722c90.516 0 164.156-73.64 164.156-164.156V164.156C551.033 73.64 477.393 0 386.878 0zM495.6 386.878c0 60.045-48.677 108.722-108.722 108.722H164.156c-60.045 0-108.722-48.677-108.722-108.722V164.156c0-60.046 48.677-108.722 108.722-108.722h222.722c60.045 0 108.722 48.676 108.722 108.722v222.722z"
                  fill="#fff"
                />
                <path
                  d="M275.517 133C196.933 133 133 196.933 133 275.516s63.933 142.517 142.517 142.517S418.034 354.1 418.034 275.516 354.101 133 275.517 133zm0 229.6c-48.095 0-87.083-38.988-87.083-87.083s38.989-87.083 87.083-87.083c48.095 0 87.083 38.988 87.083 87.083 0 48.094-38.989 87.083-87.083 87.083z"
                  fill="#fff"
                />
                <circle cx="418.306" cy="134.072" r="34.149" fill="#fff" />
              </svg>
            </a>

            <a href="https://youtube.com/@_rimun" target="_blank" rel="noreferrer">
              <svg width="25" height="25" viewBox="0 0 576 512">
                <path
                  d="M549.655 124.083c-6.281-23.65-24.787-42.157-48.438-48.438C458.781 64 288 64 288 64S117.219 64 74.783 75.645c-23.65 6.281-42.157 24.787-48.438 48.438C16 166.519 16 256 16 256s0 89.481 10.345 131.917c6.281 23.65 24.787 42.157 48.438 48.438C117.219 448 288 448 288 448s170.781 0 213.217-11.645c23.65-6.281 42.157-24.787 48.438-48.438C560 345.481 560 256 560 256s0-89.481-10.345-131.917zM232 336V176l142 80-142 80z"
                  fill="#fff"
                />
              </svg>
            </a>
          </div>

          <div id="copyright">
            <p>&copy; RIMUN {new Date().getFullYear()}, All rights reserved</p>
            <p className="text-xs text-slate-400">
              Developed by{" "}
              <a
                aria-label="developer"
                href="https://github.com/marinoandrea"
                className="underline hover:text-slate-100 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                Andrea Marino
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
