import React from "react";
import { MapPin, Calendar, Mail, Facebook, Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import ristconLogo from "@/assets/ristcon-logo.png";
import ScrollTop from "./ScrollTop";
import { useConference } from "@/hooks/useConference";
import { Skeleton } from "@/components/ui/skeleton";
import type { SocialMediaLink } from "@/lib/api/types";
import { useYear } from "@/contexts/YearContext";

const Footer: React.FC = () => {
  const { data: conference, isLoading } = useConference(undefined, 'location,contacts,important_dates,social_media');
  const { selectedYear } = useYear();
  
  const currentYear = new Date().getFullYear();
  const now = new Date();
  const formattedDate = now.toLocaleString();

  // Map social media platform to icon component
  const getSocialIcon = (platform: SocialMediaLink['platform']) => {
    const iconMap = {
      facebook: Facebook,
      twitter: Twitter,
      linkedin: Linkedin,
      instagram: Instagram,
      youtube: Youtube,
      email: Mail,
    };
    return iconMap[platform] || Mail;
  };

  // Build year-aware paths
  const yearPrefix = selectedYear ? `/ristcon/${selectedYear}` : '';
  
  const quickLinks = [
    { label: "About", href: `${yearPrefix}/about` },
    { label: "Instructions", href: `${yearPrefix}/author-instructions` },
    { label: "Registration", href: `${yearPrefix}/registration` },
    { label: "Past Events", href: `${yearPrefix}/past-events` },
  ];

  // Loading state
  if (isLoading) {
    return (
      <footer className="relative bg-gradient-to-b from-primary via-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </footer>
    );
  }

  const socialLinks = conference?.social_media_links || [];
  const location = conference?.event_location;
  const importantDates = (conference?.important_dates || []).slice(0, 3); // Top 3 dates
  const copyrightYear = conference?.copyright_year || currentYear;
  const theme = conference?.theme || "Research & Innovation";
  const conferenceYear = conference?.year || currentYear;
  const conferenceName = conference?.name || `RISTCON ${conferenceYear}`;

  return (
    <footer className="relative bg-gradient-to-b from-primary via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Background shapes */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-700 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-600 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Brand & Social */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={ristconLogo} alt="RISTCON Logo" className="h-12 w-12 drop-shadow-lg" />
              <div>
                <h3 className="font-bold text-2xl text-white">RISTCON {conferenceYear}</h3>
                <p className="text-sm text-gray-300">Research & Innovation</p>
              </div>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm">
              {theme}
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 bg-white/10 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  >
                    <Icon className="h-5 w-5 text-white hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <ScrollTop to={link.href}>{link.label}</ScrollTop>
                </li>
              ))}
            </ul>
          </div>


          {/* Important Dates */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-white">Important Dates</h4>
            <ul className="space-y-2 text-sm">
              {importantDates.map((item) => (
                <li key={item.id} className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="font-medium">{item.display_label}</span>
                  <span className="text-gray-400">{new Date(item.date_value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          {location?.google_maps_embed_url && (
            <div className="rounded-lg overflow-hidden shadow-lg border border-white/20">
              <iframe
                title="Conference Location"
                src={location.google_maps_embed_url}
                width="100%"
                height="220"
                style={{ border: 0 }}
                loading="lazy"
                className="hover:scale-105 transition-transform duration-300"
              ></iframe>
            </div>
          )}
        </div>

        {/* Contact & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
          {location && (
            <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors duration-300">
              <MapPin className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-white">Conference Venue</h5>
                <p className="text-sm text-gray-300">{location.venue_name}</p>
                <p className="text-sm text-gray-400">{location.city}, {location.country}</p>
              </div>
            </div>
          )}

          {conference && (
            <div className="flex items-start space-x-3 bg-white/5 backdrop-blur-sm rounded-lg p-4 hover:bg-white/10 transition-colors duration-300">
              <Mail className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="font-semibold text-white">Get in Touch</h5>
                <a
                  href={`mailto:${conference.general_email}`}
                  className="text-sm text-gray-300 hover:text-blue-600 transition-colors duration-300"
                >
                  {conference.general_email}
                </a>
                {conference.availability_hours && (
                  <p className="text-sm text-gray-400 mt-1">{conference.availability_hours}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 border-t border-white/10 pt-2 text-sm text-gray-400 space-y-1">
          <p>© {copyrightYear} RISTCON. Faculty of Science, University of Ruhuna. All rights reserved.</p>
          <p className="italic text-xs">Last site updated: {conference?.last_updated ? new Date(conference.last_updated).toLocaleString() : formattedDate}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
