import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import logo from '../Logo.png';

export default function Footer() {
  const form = useRef();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // TODO: Replace with your EmailJS values
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const EMAILJS_USER_ID = 'YOUR_PUBLIC_KEY';

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_USER_ID)
      .then(() => {
        setSent(true);
        setLoading(false);
      }, (err) => {
        setError('Failed to send. Please try again.');
        setLoading(false);
      });
  };

  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 px-4 mt-12 rounded-t-3xl shadow-2xl border-t-4 border-gradient-to-r from-logo-blue via-logo-cyan to-logo-green">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-start">
        {/* About */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-2">
            <img src={logo} alt="Future Intern Logo" className="h-10 w-10 rounded-2xl shadow-lg border-2 border-logo-blue bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green p-1" style={{boxShadow: '0 0 12px #38bdf8, 0 0 24px #6366f1'}} />
            <span className="text-xl font-extrabold bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green bg-clip-text text-transparent tracking-tight drop-shadow">Future Intern</span>
          </div>
          <p className="text-sm text-gray-400">Future Intern is a leading provider of free internships, dedicated to student growth and professional development. Innovate, Learn, Intern, Grow.</p>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-logo-blue">Quick Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-logo-blue transition">Dashboard</Link></li>
            <li><Link to="/internships" className="hover:text-logo-cyan transition">Internships</Link></li>
            <li><Link to="/certificates" className="hover:text-logo-green transition">Certificates</Link></li>
            <li><Link to="/offer-letter" className="hover:text-logo-blue transition">Offer Letter</Link></li>
            <li><Link to="/register" className="hover:text-logo-cyan transition">Register</Link></li>
            <li><Link to="/login" className="hover:text-logo-green transition">Login</Link></li>
          </ul>
        </div>
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-logo-cyan">Contact</h3>
          <ul className="text-sm flex flex-col gap-2">
            <li><span className="font-semibold">Email:</span> <a href="mailto:futureintern.in@gmail.com" className="hover:text-logo-blue transition">futureintern.in@gmail.com</a></li>
            <li><span className="font-semibold">Location:</span> Delhi, India</li>
            <li><span className="font-semibold">Website:</span> <a href="https://futureintern.in" className="hover:text-logo-cyan transition">futureintern.in</a></li>
            <li><span className="font-semibold">LinkedIn:</span> <a href="https://linkedin.com/company/futureintern" className="hover:text-logo-green transition" target="_blank" rel="noopener noreferrer">futureintern</a></li>
          </ul>
        </div>
        {/* Connect Form & Socials */}
        <div>
          <h3 className="text-lg font-bold mb-3 text-logo-green">Connect</h3>
          <form ref={form} onSubmit={sendEmail} className="flex flex-col gap-2 bg-white/20 backdrop-blur border border-logo-blue/20 rounded-xl p-4 shadow-lg">
            <input name="user_name" type="text" placeholder="Your Name" required className="px-3 py-2 rounded-lg bg-gray-900 text-gray-100 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-logo-blue" />
            <input name="user_email" type="email" placeholder="Your Email" required className="px-3 py-2 rounded-lg bg-gray-900 text-gray-100 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-logo-cyan" />
            <textarea name="message" rows="2" placeholder="Message" required className="px-3 py-2 rounded-lg bg-gray-900 text-gray-100 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-logo-green" />
            <button type="submit" disabled={loading} className="mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-logo-blue to-logo-green text-white font-semibold shadow hover:from-logo-green hover:to-logo-blue transition disabled:opacity-60">{loading ? 'Sending...' : 'Send'}</button>
            {sent && <span className="text-green-400 text-xs mt-1">Message sent!</span>}
            {error && <span className="text-red-400 text-xs mt-1">{error}</span>}
          </form>
          <div className="flex gap-4 mt-6">
            {/* Email icon (modern, filled) */}
            <a href="mailto:futureintern.in@gmail.com" className="hover:text-logo-blue transition" aria-label="Email">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M2.25 6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25v10.5A2.25 2.25 0 0 1 19.5 19.5h-15A2.25 2.25 0 0 1 2.25 17.25V6.75zm1.5 0v.638l8.25 5.775 8.25-5.775V6.75a.75.75 0 0 0-.75-.75h-15a.75.75 0 0 0-.75.75zm18 1.862-7.59 5.316a2.25 2.25 0 0 1-2.12 0L3.75 8.612v8.638c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75V8.612z"/></svg>
            </a>
            {/* LinkedIn icon (modern, filled) */}
            <a href="https://linkedin.com/company/futureintern" className="hover:text-logo-green transition" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM7.12 19H3.56V9h3.56v10zM5.34 7.67c-1.14 0-2.06-.93-2.06-2.08 0-1.15.92-2.08 2.06-2.08s2.06.93 2.06 2.08c0 1.15-.92 2.08-2.06 2.08zM21 19h-3.56v-5.13c0-1.22-.02-2.79-1.7-2.79-1.7 0-1.96 1.33-1.96 2.7V19h-3.56V9h3.42v1.37h.05c.48-.91 1.65-1.87 3.4-1.87 3.63 0 4.3 2.39 4.3 5.5V19z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-xs text-gray-500">
        © 2024. All rights reserved by KANTHARIYA TECHNOLOGIES - Privacy Policy - Terms & Conditions
      </div>
    </footer>
  );
} 