"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ExternalLink } from "lucide-react";

interface ContactInfoProps {
  theme: string;
}

/**
 * Contact information component for privacy-related inquiries
 * Displays contact methods, response times, and regulatory information
 * with interactive elements and responsive design
 */
export const ContactInfo: FC<ContactInfoProps> = ({ theme }) => {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className={`card p-6 scroll-mt-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <Mail className="w-5 h-5 text-blue-600" />
        </div>
        <h2
          className={`text-xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Contact Us About Privacy
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3
            className={`font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Privacy Questions & Requests
          </h3>

          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <p
                  className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Privacy Officer
                </p>
                <a
                  href="mailto:privacy@snapurl.dev"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  privacy@snapurl.dev
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <p
                  className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Data Protection
                </p>
                <a
                  href="mailto:dpo@snapurl.dev"
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  dpo@snapurl.dev
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-purple-500 mt-1" />
              <div>
                <p
                  className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                >
                  Privacy Hotline
                </p>
                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                >
                  +1 (555) 123-PRIV
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3
            className={`font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Response Times & Process
          </h3>

          <div
            className={`p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Data access requests: 30 days</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Privacy questions: 5 business days</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Urgent issues: 24 hours</span>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <a
              href="/help"
              className="inline-flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm"
            >
              <span>Visit Help Center</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div
        className={`mt-6 p-4 rounded-lg border ${
          theme === "dark"
            ? "border-gray-700 bg-gray-700/50"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <h4
          className={`font-semibold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          Regulatory Information
        </h4>
        <p
          className={`text-sm ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          SnapURL complies with GDPR, CCPA, and other applicable privacy
          regulations. If you have concerns about our privacy practices that we
          cannot resolve, you may contact your local data protection authority.
        </p>
      </div>

      <div className="mt-6 text-center">
        <p
          className={`text-xs ${
            theme === "dark" ? "text-gray-500" : "text-gray-400"
          }`}
        >
          This privacy policy was last updated on September 11, 2025. We will
          notify you of any material changes via email or through our service.
        </p>
      </div>
    </motion.section>
  );
};
