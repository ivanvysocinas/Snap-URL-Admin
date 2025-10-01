"use client";

import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

interface FAQSectionProps {
  searchQuery: string;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  theme: string;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface Category {
  id: string;
  label: string;
}

/**
 * FAQ section component with category filtering and expandable answers
 * Features search filtering, smooth animations, and responsive design
 */
export const FAQSection: FC<FAQSectionProps> = ({
  searchQuery,
  selectedCategory,
  onCategoryChange,
  theme,
}) => {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories: Category[] = [
    { id: "all", label: "All Topics" },
    { id: "getting-started", label: "Getting Started" },
    { id: "features", label: "Features" },
    { id: "billing", label: "Billing" },
    { id: "api", label: "API" },
    { id: "troubleshooting", label: "Troubleshooting" },
  ];

  const faqs: FAQ[] = [
    {
      id: "1",
      category: "getting-started",
      question: "How do I create my first short URL?",
      answer:
        "To create your first short URL, log into your dashboard and click the 'Create New URL' button. Enter your long URL, optionally customize the short code, and click 'Create'. Your shortened URL will be ready to use immediately.",
    },
    {
      id: "2",
      category: "features",
      question: "Can I customize my short URLs?",
      answer:
        "Yes! You can create custom aliases for your short URLs. When creating a new URL, simply enter your preferred custom alias in the 'Custom Alias' field. Custom aliases must be 3-30 characters long and can contain letters, numbers, hyphens, and underscores.",
    },
    {
      id: "3",
      category: "features",
      question: "How do QR codes work?",
      answer:
        "QR codes are automatically generated for all your short URLs. You can customize the size and colors of your QR codes in the URL editor. When someone scans the QR code, they'll be redirected to your original URL, and the scan will be tracked in your analytics.",
    },
    {
      id: "4",
      category: "billing",
      question: "Is SnapURL free to use?",
      answer:
        "SnapURL offers a generous free tier that includes unlimited URL shortening, basic analytics, and QR code generation. Premium features like advanced analytics, custom domains, and API access are available with paid plans.",
    },
    {
      id: "5",
      category: "api",
      question: "How do I get an API key?",
      answer:
        "To get an API key, go to your account settings and click on 'API Keys'. Generate a new key and give it a name for easy identification. Keep your API key secure and don't share it publicly.",
    },
    {
      id: "6",
      category: "troubleshooting",
      question: "Why isn't my short URL working?",
      answer:
        "If your short URL isn't working, check if it's still active in your dashboard. URLs can be deactivated or may have expired if you set an expiration date. Also ensure the original URL is still valid and accessible.",
    },
    {
      id: "7",
      category: "features",
      question: "Can I track analytics for my URLs?",
      answer:
        "Yes! SnapURL provides detailed analytics including click counts, geographic data, referrer information, device types, and more. Analytics are available in real-time and can be exported for further analysis.",
    },
    {
      id: "8",
      category: "api",
      question: "What are the API rate limits?",
      answer:
        "Free accounts have a rate limit of 100 requests per hour. Premium accounts have higher limits based on their plan. Rate limits reset every hour and unused requests don't roll over.",
    },
  ];

  // Filter FAQs by category and search query
  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className={`card p-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        Frequently Asked Questions
      </h3>

      {/* Category Filter */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        theme={theme}
      />

      {/* FAQ List */}
      <FAQList
        faqs={filteredFAQs}
        expandedFAQ={expandedFAQ}
        onToggleFAQ={setExpandedFAQ}
        theme={theme}
      />
    </div>
  );
};

/**
 * Category filter buttons component
 */
interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  theme: string;
}

const CategoryFilter: FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  theme,
}) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {categories.map((category) => (
      <button
        key={category.id}
        onClick={() => onCategoryChange(category.id)}
        className={`px-3 py-1 text-sm rounded-full transition-colors ${
          selectedCategory === category.id
            ? "bg-blue-600 text-white"
            : theme === "dark"
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {category.label}
      </button>
    ))}
  </div>
);

/**
 * FAQ list container with empty state
 */
interface FAQListProps {
  faqs: FAQ[];
  expandedFAQ: string | null;
  onToggleFAQ: (id: string | null) => void;
  theme: string;
}

const FAQList: FC<FAQListProps> = ({
  faqs,
  expandedFAQ,
  onToggleFAQ,
  theme,
}) => (
  <div className="space-y-4">
    {faqs.map((faq) => (
      <FAQItem
        key={faq.id}
        faq={faq}
        isExpanded={expandedFAQ === faq.id}
        onToggle={() => onToggleFAQ(expandedFAQ === faq.id ? null : faq.id)}
        theme={theme}
      />
    ))}

    {/* Empty state */}
    {faqs.length === 0 && (
      <div className="text-center py-8">
        <p
          className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          No FAQs found matching your search criteria.
        </p>
      </div>
    )}
  </div>
);

/**
 * Individual FAQ item with expandable answer
 */
interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
  theme: string;
}

const FAQItem: FC<FAQItemProps> = ({ faq, isExpanded, onToggle, theme }) => (
  <div
    className={`border rounded-lg ${
      theme === "dark" ? "border-gray-700" : "border-gray-200"
    }`}
  >
    {/* Question button */}
    <button
      onClick={onToggle}
      className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
        isExpanded ? "rounded-t-lg" : "rounded-lg"
      }`}
    >
      <span
        className={`font-medium ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
      >
        {faq.question}
      </span>
      {isExpanded ? (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </button>

    {/* Expandable answer */}
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div
            className={`px-4 py-3 ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
