import React from 'react';
import logo from '../Logo.png';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AcademicCapIcon, UserGroupIcon, BadgeCheckIcon, LightningBoltIcon, UsersIcon, CollectionIcon, DeviceMobileIcon, CodeIcon, ChartBarIcon, CubeTransparentIcon, ChipIcon, StarIcon, SparklesIcon, BriefcaseIcon, GlobeAltIcon, ShieldCheckIcon, FireIcon, EmojiHappyIcon, LightBulbIcon, AnnotationIcon } from '@heroicons/react/outline';
// import logo from '../Logo.png';
import { 
  Mail,
} from 'lucide-react';

// Example 3D SVGs (replace or add more as needed)
const Hero3D = () => (
  <svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-8 top-8 w-32 md:w-44 opacity-70 z-0 pointer-events-none">
    <ellipse cx="90" cy="90" rx="80" ry="40" fill="url(#paint0_linear)" />
    <defs>
      <linearGradient id="paint0_linear" x1="10" y1="90" x2="170" y2="90" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2196f3" />
        <stop offset="0.5" stopColor="#06b6d4" />
        <stop offset="1" stopColor="#22c55e" />
      </linearGradient>
    </defs>
  </svg>
);
const Section3D = () => (
  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-0 bottom-0 w-20 md:w-32 opacity-40 z-0 pointer-events-none">
    <rect x="10" y="10" width="100" height="100" rx="30" fill="url(#paint1_linear)" />
    <defs>
      <linearGradient id="paint1_linear" x1="10" y1="60" x2="110" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor="#22c55e" />
        <stop offset="1" stopColor="#2196f3" />
      </linearGradient>
    </defs>
  </svg>
);

// Icon map for features/domains
const featureIcons = [
  AcademicCapIcon, // Training
  UserGroupIcon,   // Mentorship
  BadgeCheckIcon,  // Certification
  LightningBoltIcon, // Rewards
  UsersIcon,       // Networking
  CollectionIcon   // Domains
];
const featureBadges = [
  { icon: ShieldCheckIcon, color: 'bg-blue-200', text: 'Secure' },
  { icon: FireIcon, color: 'bg-pink-200', text: 'Hot' },
  { icon: EmojiHappyIcon, color: 'bg-green-200', text: 'Trusted' },
  { icon: LightBulbIcon, color: 'bg-yellow-200', text: 'Smart' },
  { icon: AnnotationIcon, color: 'bg-cyan-200', text: 'Social' },
  { icon: StarIcon, color: 'bg-purple-200', text: 'Top' },
];
const domainIcons = [
  DeviceMobileIcon, // Apps
  CodeIcon,         // Web
  ChipIcon,         // Java
  ChartBarIcon,     // Marketing
  CubeTransparentIcon, // Blockchain
  SparklesIcon      // AI
];
const whyIcons = [
  StarIcon,         // Lead
  BriefcaseIcon,    // Events
  GlobeAltIcon,     // Partnerships
  UserGroupIcon     // Opportunities
];

// Testimonial avatars (initials or emoji)
const testimonialAvatars = [
  { bg: 'bg-logo-blue', text: 'RS' },
  { bg: 'bg-logo-cyan', text: 'PY' },
  { bg: 'bg-logo-green', text: 'JL' },
  { bg: 'bg-logo-blue', text: 'RS' },
  { bg: 'bg-logo-cyan', text: 'VB' },
  { bg: 'bg-logo-green', text: 'SY' },
];

// SVG Blobs and Mesh Gradients
const MeshBlob = ({ className, color1, color2, opacity = '0.5', style }) => (
  <svg className={className} style={style} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="mesh" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor={color1} stopOpacity={opacity} />
        <stop offset="100%" stopColor={color2} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="200" cy="200" rx="200" ry="160" fill="url(#mesh)" />
  </svg>
);

export default function LandingPage() {
  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
    ],
    arrows: false,
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-br from-logo-blue via-logo-cyan to-logo-green text-white text-center pb-12 overflow-hidden pt-12">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-cyan-900/80 to-green-900/90 z-0 animate-gradient-x" />
        <MeshBlob className="absolute -top-32 -left-32 w-[500px] h-[400px] z-0" color1="#22c55e" color2="#2196f3" opacity="0.25" />
        <MeshBlob className="absolute top-20 right-0 w-[350px] h-[300px] z-0" color1="#06b6d4" color2="#22c55e" opacity="0.18" />
        <Hero3D />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto px-8 py-16 rounded-[2.5rem] shadow-2xl bg-white/10 backdrop-blur-2xl  bg-clip-padding"
          style={{ borderImage: 'linear-gradient(90deg, #2196f3, #06b6d4, #22c55e) 1' }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div className="flex items-center justify-center mx-auto mb-6">
            <span className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-gradient-to-br from-logo-blue via-logo-cyan to-logo-green shadow-2xl animate-pulse">
              <img src={logo} alt="Future Intern Logo" className="h-20 w-20 rounded-xl bg-white/10 p-1" style={{boxShadow: '0 0 32px #38bdf8, 0 0 64px #22c55e'}} />
            </span>
          </motion.div>
          <motion.h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green bg-clip-text text-transparent tracking-tight animate-gradient-x" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>Future Intern</motion.h1>
          <motion.p className="text-xl md:text-2xl font-medium mb-10 text-white/90" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
            <span className="block text-2xl md:text-3xl font-semibold mb-2 text-logo-cyan animate-fade-in">Innovate, Learn, Intern, Grow</span>
            <span className="block max-w-2xl mx-auto text-lg md:text-2xl font-medium text-white/80">Our platform offers a variety of <span className="text-logo-green font-bold">free internship opportunities</span> tailored to help students gain real-world experience, develop essential skills, and kickstart their careers.</span>
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
            <Link to="/register" className="px-10 py-4 rounded-full font-bold shadow-xl bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green text-white text-lg tracking-wide hover:scale-105 hover:shadow-2xl transition-all duration-300 border-2 border-white/30 animate-pulse">
              Apply Now
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-2xl bg-black/10" />
        </div>
      </section>

      {/* About Section */}
      <motion.section className="py-16 relative overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <MeshBlob className="absolute -top-24 right-0 w-[350px] h-[300px] z-0" color1="#2196f3" color2="#06b6d4" opacity="0.10" />
        <Section3D />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text flex items-center justify-center gap-2"><ShieldCheckIcon className="w-8 h-8 text-logo-blue" />Who We Are?</h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-6">
            FutureIntern is a leading provider of free internships, dedicated to student growth and professional development. We aim to create a platform where students can gain practical skills, network with professionals, and enhance their employability.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-300">
            At <span className="font-bold text-logo-blue">FutureIntern</span>, we set the standard for internship programs. Our innovative approach and commitment to excellence ensure that our interns are always ahead of the curve. We lead by example, constantly evolving and adapting to industry trends.
          </p>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-xl bg-white/20 dark:bg-gray-900/20" />
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="py-16 relative overflow-hidden bg-gradient-to-br from-logo-blue/90 via-logo-cyan/80 to-logo-green/90 text-white" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <MeshBlob className="absolute -bottom-32 left-0 w-[400px] h-[350px] z-0" color1="#22c55e" color2="#06b6d4" opacity="0.10" />
        <Section3D />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 gradient-text flex items-center justify-center gap-2"><FireIcon className="w-8 h-8 text-logo-cyan" />Our Great Features!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Comprehensive Training', color: 'from-logo-blue to-logo-cyan', desc: 'Hands-on experience in Digital Marketing, Web Development, App Development, Java Development, and more. Work on real projects and gain practical skills.' },
              { title: 'Mentorship', color: 'from-logo-cyan to-logo-green', desc: 'Guidance from industry professionals who provide support, insights, and help you navigate your career path.' },
              { title: 'Certification', color: 'from-logo-green to-logo-blue', desc: 'Receive an internship certificate upon completion, validating your experience and skills for your resume.' },
              { title: 'Performance Rewards', color: 'from-logo-blue to-logo-green', desc: 'Top performers receive offer letters, exclusive goodies, and stipends as recognition for their achievements.' },
              { title: 'Networking Opportunities', color: 'from-logo-cyan to-logo-blue', desc: 'Connect with industry professionals and peers for future career opportunities and valuable relationships.' },
              { title: 'Diverse Internship Domains', color: 'from-logo-green to-logo-cyan', desc: 'Find opportunities in technology, marketing, and more—tailored to your interests and career aspirations.' },
            ].map((feature, i) => {
              const Icon = featureIcons[i];
              const Badge = featureBadges[i];
              return (
                <motion.div key={i} className={
                  `relative group rounded-2xl p-8 bg-white/60 dark:bg-gray-900/60 shadow-xl border border-logo-blue/20 glass overflow-hidden flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.7 }}
                >
                  <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} shadow-lg mb-4`}>
                    <Icon className="w-8 h-8 text-white drop-shadow" />
                  </span>
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${Badge.color} text-gray-800 shadow-md animate-pulse`}>{<Badge.icon className="w-4 h-4 inline mr-1" />}{Badge.text}</span>
                  <h3 className="text-xl font-semibold mb-2 gradient-text text-center">{feature.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200 text-center">{feature.desc}</p>
                  <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-logo-blue/30 to-logo-green/30 blur-2xl opacity-40 group-hover:opacity-60 transition" />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-xl bg-black/10" />
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="py-16 relative overflow-hidden bg-gray-900 text-white" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <MeshBlob className="absolute -top-24 left-0 w-[350px] h-[300px] z-0" color1="#06b6d4" color2="#22c55e" opacity="0.10" />
        <Section3D />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 gradient-text flex items-center justify-center gap-2"><LightBulbIcon className="w-8 h-8 text-logo-green" />Some of our Real Facts!</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '1150+', label: 'Total students enrolled', color: 'from-logo-blue to-logo-cyan', icon: UsersIcon },
              { value: '600+', label: 'Student projects submitted', color: 'from-logo-cyan to-logo-green', icon: CollectionIcon },
              { value: '300+', label: 'Total lectures taken by experts', color: 'from-logo-green to-logo-blue', icon: AcademicCapIcon },
            ].map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div key={i} className="relative rounded-2xl p-8 bg-white/60 dark:bg-gray-900/60 shadow-xl border border-logo-blue/20 glass flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.7 }}>
                  <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} shadow-lg mb-4`}>
                    <StatIcon className="w-8 h-8 text-white drop-shadow" />
                  </span>
                  <div className="text-4xl font-extrabold gradient-text mb-2">{stat.value}</div>
                  <div className="text-lg font-medium text-gray-700 dark:text-gray-200">{stat.label}</div>
                  <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-logo-blue/30 to-logo-green/30 blur-2xl opacity-40 group-hover:opacity-60 transition" />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-lg bg-black/10" />
        </div>
      </motion.section>

      {/* Internship Domains Section */}
      <motion.section className="py-16 relative overflow-hidden bg-gradient-to-br from-logo-green/90 via-logo-cyan/80 to-logo-blue/90 text-white" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <MeshBlob className="absolute -bottom-32 right-0 w-[400px] h-[350px] z-0" color1="#2196f3" color2="#22c55e" opacity="0.10" />
        <Section3D />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 gradient-text flex items-center justify-center gap-2"><CubeTransparentIcon className="w-8 h-8 text-logo-blue" />Internships We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Apps Development', color: 'from-logo-blue to-logo-cyan', desc: 'Specialize in Android and iOS app development. Design user-friendly interfaces, implement functionality, and deploy apps to stores.' },
              { title: 'Web Development', color: 'from-logo-cyan to-logo-green', desc: 'Master front-end and back-end, build responsive websites, and learn core technologies like HTML, CSS, JS, Node.js, Django, and more.' },
              { title: 'Java Development', color: 'from-logo-green to-logo-blue', desc: 'From Java basics to advanced frameworks like Spring and Hibernate. Build robust, scalable applications.' },
              { title: 'Digital Marketing', color: 'from-logo-blue to-logo-green', desc: 'SEO, SMM, Content Marketing—learn strategies to enhance online visibility, engage audiences, and drive growth.' },
              { title: 'Blockchain Technology / Web3', color: 'from-logo-cyan to-logo-blue', desc: 'Learn about decentralized ledgers, smart contracts, and cryptocurrencies. Gain hands-on blockchain experience.' },
              { title: 'Artificial Intelligence (AI)', color: 'from-logo-green to-logo-cyan', desc: 'Explore AI and machine learning, NLP, computer vision, and predictive analytics to solve real-world problems.' },
            ].map((domain, i) => {
              const Icon = domainIcons[i];
              return (
                <motion.div key={i} className={
                  `relative group rounded-2xl p-8 bg-white/60 dark:bg-gray-900/60 shadow-xl border border-logo-blue/20 glass overflow-hidden flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.7 }}
                >
                  <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${domain.color} shadow-lg mb-4`}>
                    <Icon className="w-8 h-8 text-white drop-shadow" />
                  </span>
                  <h3 className="text-xl font-semibold mb-2 gradient-text text-center">{domain.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200 text-center">{domain.desc}</p>
                  <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-logo-blue/30 to-logo-green/30 blur-2xl opacity-40 group-hover:opacity-60 transition" />
                </motion.div>
              );
            })}
            </div>
            </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-xl bg-black/10" />
            </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section className="py-16 relative overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <MeshBlob className="absolute -top-24 left-0 w-[350px] h-[300px] z-0" color1="#06b6d4" color2="#2196f3" opacity="0.10" />
        <Section3D />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 gradient-text flex items-center justify-center gap-2"><StarIcon className="w-8 h-8 text-logo-cyan" />Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'We Lead from the Front', color: 'from-logo-blue to-logo-cyan', icon: StarIcon, content: <ul className="text-left list-disc list-inside text-gray-700 dark:text-gray-200"><li>Expert guidance to build your start-up</li><li>Save time, resources, and money</li><li>Create endless business possibilities</li><li>Best advice to grow your career</li></ul> },
              { title: 'Events and Workshops', color: 'from-logo-cyan to-logo-green', icon: BriefcaseIcon, content: <p>Engaging events and workshops to enhance your skills and expand your network. Stay updated and reserve your spot!</p> },
              { title: 'Partnerships', color: 'from-logo-green to-logo-blue', icon: GlobeAltIcon, content: <p>We collaborate with leading companies, universities, and organizations to enrich our programs and provide valuable resources.</p> },
              { title: 'Diverse Opportunities', color: 'from-logo-blue to-logo-green', icon: UserGroupIcon, content: <p>Launch your career with us and be job-ready with hands-on experience, expert mentorship, and tailored opportunities.</p> },
            ].map((item, i) => {
              const Icon = whyIcons[i];
              return (
                <motion.div key={i} className={
                  `relative group rounded-2xl p-8 bg-white/60 dark:bg-gray-900/60 shadow-xl border border-logo-blue/20 glass overflow-hidden flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.03] hover:shadow-2xl`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.7 }}
                >
                  <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${item.color} shadow-lg mb-4`}>
                    <Icon className="w-8 h-8 text-white drop-shadow" />
                  </span>
                  <h3 className="text-xl font-semibold mb-2 gradient-text text-center">{item.title}</h3>
                  <div className="text-gray-700 dark:text-gray-200 text-center">{item.content}</div>
                  <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-logo-blue/30 to-logo-green/30 blur-2xl opacity-40 group-hover:opacity-60 transition" />
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-xl bg-white/20 dark:bg-gray-900/20" />
        </div>
      </motion.section>

      {/* Testimonials Section - Carousel */}
      <motion.section className="py-16 relative overflow-hidden bg-gradient-to-br from-logo-blue/90 via-logo-cyan/80 to-logo-green/90 text-white" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
        <MeshBlob className="absolute -bottom-32 left-0 w-[400px] h-[350px] z-0" color1="#22c55e" color2="#2196f3" opacity="0.10" />
        <Section3D />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 gradient-text flex items-center justify-center gap-2"><AnnotationIcon className="w-8 h-8 text-logo-green" />What People Say</h2>
          <Slider {...sliderSettings} className="testimonial-carousel">
            {[
              { quote: 'FutureIntern provided me with invaluable experience and mentorship that helped me kickstart my career in web development. I\'m grateful for the opportunity and highly recommend it to aspiring professionals.', name: 'RAJ SHARMA', color: 'from-logo-blue to-logo-cyan', role: 'Web Developer' },
              { quote: 'The partnerships formed by FutureIntern have opened doors to exciting opportunities for me. Through their network, I secured an internship at a top-tier company, which has been a transformative experience for my career.', name: 'PRIYA YADAV', color: 'from-logo-cyan to-logo-green', role: 'Java Developer' },
              { quote: 'The events and workshops organized by FutureIntern are incredibly insightful and relevant to today\'s industry trends. I\'ve gained valuable knowledge and made meaningful connections that have helped me advance in my career.', name: 'John Lal', color: 'from-logo-green to-logo-blue', role: 'Web Designer' },
              { quote: 'As a university student, I was unsure about my career path until I joined FutureIntern\'s app development program. The mentorship and support I received not only helped me hone my skills but also gave me the confidence to pursue my passion.', name: 'Raja Srivastava', color: 'from-logo-blue to-logo-green', role: 'Digital Marketing' },
              { quote: 'The partnerships cultivated by FutureIntern have been instrumental in my career journey. Thanks to their connections, I was able to secure an internship at a prestigious company, which has paved the way for exciting career prospects.', name: 'Vijay Bundela', color: 'from-logo-cyan to-logo-blue', role: 'Blockchain Developer' },
              { quote: 'FutureIntern\'s commitment to student success is evident in everything they do. From the quality of their internship programs to the support and resources they provide, it\'s clear that they prioritize the growth and development of their interns.', name: 'Suraj Yadav', color: 'from-logo-green to-logo-cyan', role: 'AI / ML Developer' },
            ].map((t, i) => (
              <div key={i} className="px-4">
                <motion.div className={
                  `relative group rounded-2xl p-8 bg-white/80 dark:bg-gray-900/80 shadow-2xl border border-logo-blue/20 glass overflow-hidden flex flex-col items-center justify-center transition-transform duration-300 hover:scale-[1.04] hover:shadow-2xl min-h-[320px]`
                } initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i, duration: 0.7 }}>
                  <span className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${t.color} shadow-lg mb-4 text-2xl font-bold text-white`}>{testimonialAvatars[i].text}</span>
                  <p className="italic mb-4 text-center text-lg">"{t.quote}"</p>
                  <div className={`font-bold gradient-text`}>{t.name}</div>
                  <div className="text-sm text-gray-500 mb-2">{t.role}</div>
                  <span className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-logo-blue/30 to-logo-green/30 blur-2xl opacity-40 group-hover:opacity-60 transition" />
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full backdrop-blur-xl bg-black/10" />
        </div>
      </motion.section>
    </div>
  );
} 