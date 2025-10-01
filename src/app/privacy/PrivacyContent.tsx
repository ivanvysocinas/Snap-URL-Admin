"use client";

import { useState, useEffect, FC } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  Globe,
  Download,
  Trash2,
  Settings,
  Mail,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { PrivacySection } from "../../components/privacy/PrivacySection";
import { PrivacyHighlights } from "../../components/privacy/PrivacyHighlights";
import { ContactInfo } from "../../components/privacy/ContactInfo";

/**
 * Privacy Policy content component
 * Comprehensive privacy documentation with section navigation and scroll tracking
 */
const PrivacyContent: FC = () => {
  const { theme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("overview");

  const sections = [
    { id: "overview", title: "Privacy Overview", icon: Shield },
    { id: "collection", title: "Data Collection", icon: Database },
    { id: "usage", title: "How We Use Data", icon: Settings },
    { id: "sharing", title: "Data Sharing", icon: Users },
    { id: "security", title: "Data Security", icon: Lock },
    { id: "rights", title: "Your Rights", icon: Eye },
    { id: "cookies", title: "Cookies & Tracking", icon: Globe },
    { id: "contact", title: "Contact Us", icon: Mail },
  ];

  // Intersection Observer for section tracking
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-10% 0px -60% 0px",
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the entry that is intersecting and closest to the top
      const intersectingEntries = entries.filter(
        (entry) => entry.isIntersecting
      );

      if (intersectingEntries.length > 0) {
        // Sort by intersection ratio and position, prioritize the one with highest visibility
        const mostVisible = intersectingEntries.reduce((prev, current) => {
          return current.intersectionRatio > prev.intersectionRatio
            ? current
            : prev;
        });

        setActiveSection(mostVisible.target.id);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Privacy Policy"
        description="Last updated: September 11, 2025"
      >
        {/* Privacy Highlights */}
        <div className="mb-8">
          <PrivacyHighlights theme={theme} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={`card p-4 sticky top-6 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3
                className={`font-semibold mb-4 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Table of Contents
              </h3>

              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(section.id)?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                      activeSection === section.id
                        ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600"
                        : theme === "dark"
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview */}
            <PrivacySection
              id="overview"
              title="Privacy Overview"
              icon={Shield}
              theme={theme}
            >
              <p className="mb-4">
                At SnapURL, we take your privacy seriously. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your
                information when you use our URL shortening service.
              </p>
              <p className="mb-4">
                We are committed to protecting your personal information and
                being transparent about our data practices. This policy applies
                to all users of SnapURL, whether you use our web interface,
                mobile applications, or API.
              </p>
              <div
                className={`p-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-blue-900/20 border border-blue-800"
                    : "bg-blue-50 border border-blue-200"
                }`}
              >
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  <strong>Key Principle:</strong> We only collect data necessary
                  to provide and improve our service, and we never sell your
                  personal information to third parties.
                </p>
              </div>
            </PrivacySection>

            {/* Data Collection */}
            <PrivacySection
              id="collection"
              title="Data Collection"
              icon={Database}
              theme={theme}
            >
              <h4 className="font-semibold mb-3">Information You Provide</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Account information (name, email address, password)</li>
                <li>URLs you submit for shortening</li>
                <li>Custom aliases and titles you create</li>
                <li>Profile preferences and settings</li>
              </ul>

              <h4 className="font-semibold mb-3">
                Information We Collect Automatically
              </h4>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>
                  Click analytics (timestamps, IP addresses, geographic
                  location)
                </li>
                <li>
                  Device information (browser type, operating system, device
                  type)
                </li>
                <li>
                  Referrer information (websites that link to your short URLs)
                </li>
                <li>Usage patterns and feature interactions</li>
              </ul>

              <h4 className="font-semibold mb-3">Third-Party Data</h4>
              <p>
                We may collect additional information from third-party services
                when you choose to integrate them with SnapURL, such as social
                media platforms or analytics tools.
              </p>
            </PrivacySection>

            {/* Data Usage */}
            <PrivacySection
              id="usage"
              title="How We Use Your Data"
              icon={Settings}
              theme={theme}
            >
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Provide and maintain our URL shortening service</li>
                <li>Generate analytics and insights for your URLs</li>
                <li>Improve our service features and performance</li>
                <li>
                  Communicate with you about your account and service updates
                </li>
                <li>Provide customer support and technical assistance</li>
                <li>Detect and prevent fraud, abuse, and security threats</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>

              <div
                className={`p-4 rounded-lg ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                }`}
              >
                <p className="text-sm">
                  <strong>Legal Basis:</strong> We process your data based on
                  legitimate interests, contractual necessity, consent, and
                  legal compliance under GDPR and other applicable privacy laws.
                </p>
              </div>
            </PrivacySection>

            {/* Data Sharing */}
            <PrivacySection
              id="sharing"
              title="Data Sharing"
              icon={Users}
              theme={theme}
            >
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following limited circumstances:
              </p>

              <h4 className="font-semibold mb-3">Service Providers</h4>
              <p className="mb-4">
                We work with trusted third-party service providers who help us
                operate our platform, such as hosting providers, analytics
                services, and customer support tools. These providers are
                contractually bound to protect your data.
              </p>

              <h4 className="font-semibold mb-3">Legal Requirements</h4>
              <p className="mb-4">
                We may disclose your information when required by law, court
                order, or government request, or to protect our rights, safety,
                and the rights of our users.
              </p>

              <h4 className="font-semibold mb-3">Business Transfers</h4>
              <p className="mb-4">
                In the event of a merger, acquisition, or sale of assets, your
                information may be transferred as part of the transaction, with
                the same privacy protections.
              </p>
            </PrivacySection>

            {/* Data Security */}
            <PrivacySection
              id="security"
              title="Data Security"
              icon={Lock}
              theme={theme}
            >
              <p className="mb-4">
                We implement industry-standard security measures to protect your
                information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h5 className="font-semibold mb-2">Technical Safeguards</h5>
                  <ul className="text-sm space-y-1">
                    <li>• SSL/TLS encryption in transit</li>
                    <li>• AES-256 encryption at rest</li>
                    <li>• Secure database access controls</li>
                    <li>• Regular security audits</li>
                  </ul>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    theme === "dark" ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <h5 className="font-semibold mb-2">
                    Administrative Safeguards
                  </h5>
                  <ul className="text-sm space-y-1">
                    <li>• Limited employee access</li>
                    <li>• Background checks</li>
                    <li>• Privacy training programs</li>
                    <li>• Incident response procedures</li>
                  </ul>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-yellow-900/20 border border-yellow-800"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                  <strong>Important:</strong> While we implement strong security
                  measures, no system is 100% secure. Please use strong
                  passwords and enable two-factor authentication when available.
                </p>
              </div>
            </PrivacySection>

            {/* Your Rights */}
            <PrivacySection
              id="rights"
              title="Your Privacy Rights"
              icon={Eye}
              theme={theme}
            >
              <p className="mb-4">
                You have the following rights regarding your personal
                information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Download className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h5 className="font-semibold">Access & Export</h5>
                      <p className="text-sm">
                        Request a copy of all data we have about you
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Settings className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h5 className="font-semibold">Rectification</h5>
                      <p className="text-sm">
                        Correct inaccurate or incomplete information
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Trash2 className="w-5 h-5 text-red-500 mt-1" />
                    <div>
                      <h5 className="font-semibold">Deletion</h5>
                      <p className="text-sm">
                        Request deletion of your personal data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-purple-500 mt-1" />
                    <div>
                      <h5 className="font-semibold">Portability</h5>
                      <p className="text-sm">
                        Transfer your data to another service
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm">
                To exercise these rights, contact us at{" "}
                <strong>privacy@snapurl.dev</strong> or use the privacy controls
                in your account settings.
              </p>
            </PrivacySection>

            {/* Cookies */}
            <PrivacySection
              id="cookies"
              title="Cookies & Tracking"
              icon={Globe}
              theme={theme}
            >
              <p className="mb-4">
                We use cookies and similar technologies to enhance your
                experience and collect analytics data:
              </p>

              <div className="space-y-4 mb-4">
                <div>
                  <h5 className="font-semibold">Essential Cookies</h5>
                  <p className="text-sm">
                    Required for basic functionality, authentication, and
                    security
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold">Analytics Cookies</h5>
                  <p className="text-sm">
                    Help us understand how users interact with our service to
                    improve performance
                  </p>
                </div>

                <div>
                  <h5 className="font-semibold">Preference Cookies</h5>
                  <p className="text-sm">
                    Remember your settings and preferences for a better
                    experience
                  </p>
                </div>
              </div>

              <p className="text-sm">
                You can control cookie preferences through your browser settings
                or our cookie consent banner. Note that disabling certain
                cookies may limit functionality.
              </p>
            </PrivacySection>

            {/* Contact Information */}
            <ContactInfo theme={theme} />
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default PrivacyContent;
