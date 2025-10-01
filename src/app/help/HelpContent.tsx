"use client";

import { useState, FC } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Book, Mail, Clock, ExternalLink } from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";
import { SearchBar } from "../../components/help/SearchBar";
import { FAQSection } from "../../components/help/FAQSection";
import { ContactCard } from "../../components/help/ContactCard";
import { QuickGuides } from "../../components/help/QuickGuides";
import { useComingSoon } from "@/hooks/useComingSoonModal";
import Link from "next/link";

/**
 * Help Center Content Component
 * Comprehensive support center with search, FAQ, guides, and contact options
 */
const HelpContent: FC = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { showComingSoon } = useComingSoon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <DashboardLayout
        title="Help Center"
        description="Find answers to your questions and get the most out of SnapURL"
      >
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            theme={theme}
          />
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div onClick={() => showComingSoon("Live Chat", "This feature is under development and will be available soon. Stay tuned for updates!")}>
            <ContactCard
              icon={MessageCircle}
              title="Live Chat"
              description="Get instant help from our support team"
              action="Start Chat"
              available={false}
              theme={theme}
            />
          </div>
          <div onClick={() => showComingSoon("Email Support", "This feature is under development and will be available soon. Stay tuned for updates!")}>
            <ContactCard
              icon={Mail}
              title="Email Support"
              description="Send us a detailed message"
              action="Send Email"
              available={false}
              theme={theme}
            />
          </div>
          <Link href={"https://snap-url-api-production.up.railway.app/api-docs/"} >
            <ContactCard
              icon={Book}
              title="Documentation"
              description="Browse our comprehensive guides"
              action="View Docs"
              available={true}
              theme={theme}
            />
          </Link>
        </div>

        {/* Quick Guides */}
        <div className="mb-8">
          <QuickGuides theme={theme} />
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <FAQSection
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            theme={theme}
          />
        </div>

        {/* Contact Information */}
        <div
          className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Still need help?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <p
                    className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Email
                  </p>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    support@snapurl.dev
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-500" />
                <div>
                  <p
                    className={`font-medium ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    Response Time
                  </p>
                  <p
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Usually within 24 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href="https://snap-url-api-production.up.railway.app/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="font-medium">API Documentation</span>
              </a>

              <a
                href="/status"
                className="flex items-center space-x-3 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                <span className="font-medium">Service Status</span>
              </a>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </motion.div>
  );
};

export default HelpContent;