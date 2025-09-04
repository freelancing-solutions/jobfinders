import React from 'react';
import Link from 'next/link';

const GlobalFooter: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wave">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#1a1a2e" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,133.3C384,139,480,181,576,186.7C672,192,768,160,864,133.3C960,107,1056,85,1152,96C1248,107,1344,149,1392,170.7L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12 footer-col">
            <div className="footer-brand">
              <div className="footer-logo">
                <i className="fas fa-briefcase fa-3x"></i>
              </div>
              <h5 className="footer-title">JobFinders</h5>
            </div>
            <p className="footer-mission">Connecting talent with opportunity. Our mission is to bridge the gap between skilled professionals and innovative companies, fostering growth and success for both.</p>
            <a href="mailto:contact@jobfinders.com" className="footer-email">
              <i className="fas fa-envelope"></i> contact@jobfinders.com
            </a>
            <div className="footer-socials">
              <a href="https://twitter.com/jobfinders" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com/company/jobfinders" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12 footer-col">
            <h5 className="footer-col-title">Job Seekers</h5>
            <ul className="footer-links">
              <li><Link href="/jobs"><i className="fas fa-search"></i> Find a Job</Link></li>
              <li><Link href="/profile"><i className="fas fa-user-circle"></i> Create Profile</Link></li>
              <li><Link href="/resources"><i className="fas fa-file-alt"></i> Resume Builder</Link></li>
              <li><Link href="/alerts"><i className="fas fa-bell"></i> Job Alerts</Link></li>
              <li><Link href="/saved-jobs"><i className="fas fa-bookmark"></i> Saved Jobs</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12 footer-col">
            <h5 className="footer-col-title">Employers</h5>
            <ul className="footer-links">
              <li><Link href="/employer/post"><i className="fas fa-plus-square"></i> Post a Job</Link></li>
              <li><Link href="/employer/dashboard"><i className="fas fa-tachometer-alt"></i> Employer Dashboard</Link></li>
              <li><Link href="/pricing"><i className="fas fa-tags"></i> Pricing Plans</Link></li>
              <li><Link href="/candidates"><i className="fas fa-users"></i> Browse Candidates</Link></li>
              <li><Link href="/employer/resources"><i className="fas fa-book"></i> Employer Resources</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-sm-12 footer-col">
            <h5 className="footer-col-title">Resources</h5>
            <ul className="footer-links">
              <li><Link href="/blog"><i className="fas fa-blog"></i> Blog</Link></li>
              <li><Link href="/faq"><i className="fas fa-question-circle"></i> FAQ</Link></li>
              <li><Link href="/contact-us"><i className="fas fa-headset"></i> Contact Us</Link></li>
              <li><Link href="/about-us"><i className="fas fa-info-circle"></i> About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <p className="copyright-text">&copy; {new Date().getFullYear()} JobFinders. All Rights Reserved.</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <Link href="/privacy-policy" className="legal-link">Privacy Policy</Link>
              <span className="legal-separator">|</span>
              <Link href="/terms-of-service" className="legal-link">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
