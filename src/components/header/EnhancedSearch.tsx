"use client";

import { FC, ChangeEvent, KeyboardEvent, RefObject } from "react";
import {
  Search,
  Loader2,
  ArrowUpRight,
  MousePointer,
  Hash,
  AlertCircle,
  Sparkles,
} from "lucide-react";

import type { SearchResult } from "../../types/header.types";

interface EnhancedSearchProps {
  theme: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  showSearchResults: boolean;
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onFocus: () => void;
  searchRef: RefObject<HTMLDivElement>;
  inputRef: RefObject<HTMLInputElement>;
  error?: string | null;
}

/**
 * Enhanced search component with URL search functionality
 * Features real-time search, keyboard navigation, and mobile optimization
 */
const EnhancedSearch: FC<EnhancedSearchProps> = ({
  theme,
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  showSearchResults,
  selectedIndex,
  onResultClick,
  onKeyDown,
  onFocus,
  searchRef,
  inputRef,
  error,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex-1 max-w-2xl mx-2 sm:mx-4" ref={searchRef}>
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          {/* Search Icon / Loading Spinner */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2
                className={`w-4 h-4 animate-spin ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            ) : (
              <Search
                className={`w-4 h-4 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-400"
                }`}
              />
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            className={`w-full pl-10 pr-3 sm:pr-16 py-2.5 rounded-xl border transition-all duration-200 ${
              showSearchResults
                ? theme === "dark"
                  ? "bg-gray-800 border-blue-600 shadow-lg shadow-blue-500/10"
                  : "bg-white border-blue-500 shadow-lg shadow-blue-500/10"
                : theme === "dark"
                  ? "bg-gray-800 border-gray-600 hover:border-gray-500"
                  : "bg-gray-50 border-gray-300 hover:border-gray-400"
            } ${
              theme === "dark"
                ? "text-white placeholder-gray-400 focus:border-blue-500"
                : "text-gray-900 placeholder-gray-500 focus:border-blue-500"
            } focus:ring-4 focus:ring-blue-500/20 focus:outline-none text-sm sm:text-base`}
            placeholder="Search URLs..."
          />

          {/* Keyboard Shortcut Badge - Hidden on mobile */}
          <div className="absolute inset-y-0 right-0 pr-3 hidden sm:flex items-center pointer-events-none">
            <kbd
              className={`inline-flex items-center px-2 py-1 text-xs rounded ${
                theme === "dark"
                  ? "bg-gray-700 text-gray-400 border border-gray-600"
                  : "bg-gray-200 text-gray-500 border border-gray-300"
              }`}
            >
              <Sparkles className="w-6 h-6" />
            </kbd>
          </div>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && (
          <SearchDropdown
            theme={theme}
            isSearching={isSearching}
            error={error}
            searchResults={searchResults}
            searchQuery={searchQuery}
            selectedIndex={selectedIndex}
            onResultClick={onResultClick}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Search results dropdown container
 */
interface SearchDropdownProps {
  theme: string;
  isSearching: boolean;
  error?: string | null | undefined;
  searchResults: SearchResult[];
  searchQuery: string;
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
}

const SearchDropdown: FC<SearchDropdownProps> = ({
  theme,
  isSearching,
  error,
  searchResults,
  searchQuery,
  selectedIndex,
  onResultClick,
}) => (
  <div
    className={`absolute top-full mt-2 w-full rounded-xl border shadow-2xl z-50 overflow-hidden ${
      theme === "dark"
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200"
    }`}
    style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
  >
    {isSearching ? (
      <SearchLoadingState theme={theme} />
    ) : error ? (
      <SearchErrorState theme={theme} error={error} />
    ) : searchResults.length === 0 ? (
      <SearchEmptyState theme={theme} searchQuery={searchQuery} />
    ) : (
      <SearchResultsList
        results={searchResults}
        selectedIndex={selectedIndex}
        onResultClick={onResultClick}
        theme={theme}
      />
    )}
  </div>
);

/**
 * Loading state for search results
 */
interface SearchLoadingStateProps {
  theme: string;
}

const SearchLoadingState: FC<SearchLoadingStateProps> = ({ theme }) => (
  <div className="p-4 flex items-center justify-center space-x-2">
    <Loader2
      className={`w-4 h-4 animate-spin ${
        theme === "dark" ? "text-blue-400" : "text-blue-500"
      }`}
    />
    <span
      className={`text-sm ${
        theme === "dark" ? "text-gray-300" : "text-gray-600"
      }`}
    >
      Searching URLs...
    </span>
  </div>
);

/**
 * Error state for search results
 */
interface SearchErrorStateProps {
  theme: string;
  error: string;
}

const SearchErrorState: FC<SearchErrorStateProps> = ({ theme, error }) => (
  <div className="p-4 sm:p-6 text-center">
    <AlertCircle
      className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
        theme === "dark" ? "text-red-400" : "text-red-500"
      }`}
    />
    <p
      className={`text-sm ${
        theme === "dark" ? "text-red-400" : "text-red-600"
      }`}
    >
      {error}
    </p>
  </div>
);

/**
 * Empty state when no results found
 */
interface SearchEmptyStateProps {
  theme: string;
  searchQuery: string;
}

const SearchEmptyState: FC<SearchEmptyStateProps> = ({
  theme,
  searchQuery,
}) => (
  <div className="p-4 sm:p-6 text-center">
    <Search
      className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 ${
        theme === "dark" ? "text-gray-600" : "text-gray-400"
      }`}
    />
    <p
      className={`text-sm ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      No URLs found for "{searchQuery}"
    </p>
    <p
      className={`text-xs mt-1 ${
        theme === "dark" ? "text-gray-500" : "text-gray-500"
      }`}
    >
      Try searching with different keywords
    </p>
  </div>
);

/**
 * Search results list container
 */
interface SearchResultsListProps {
  results: SearchResult[];
  selectedIndex: number;
  onResultClick: (result: SearchResult) => void;
  theme: string;
}

const SearchResultsList: FC<SearchResultsListProps> = ({
  results,
  selectedIndex,
  onResultClick,
  theme,
}) => (
  <div className="max-h-80 sm:max-h-96 overflow-y-auto">
    {results.map((result, index) => (
      <SearchResultItem
        key={result.id}
        result={result}
        isSelected={selectedIndex === index}
        onClick={() => onResultClick(result)}
        theme={theme}
      />
    ))}
  </div>
);

/**
 * Individual search result item with metadata
 */
interface SearchResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onClick: () => void;
  theme: string;
}

const SearchResultItem: FC<SearchResultItemProps> = ({
  result,
  isSelected,
  onClick,
  theme,
}) => (
  <div
    onClick={onClick}
    className={`group flex items-center px-3 sm:px-4 py-3 cursor-pointer transition-all duration-150 ${
      isSelected
        ? theme === "dark"
          ? "bg-blue-900/50 border-l-2 border-blue-400"
          : "bg-blue-50 border-l-2 border-blue-500"
        : theme === "dark"
          ? "hover:bg-gray-750 border-l-2 border-transparent"
          : "hover:bg-gray-50 border-l-2 border-transparent"
    }`}
  >
    {/* Result Icon */}
    <div
      className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-2 sm:mr-3 transition-colors ${
        theme === "dark"
          ? "bg-green-900/30 text-green-400"
          : "bg-green-100 text-green-600"
      }`}
    >
      <result.icon className="w-3 h-3 sm:w-4 sm:h-4" />
    </div>

    {/* Result Content */}
    <div className="flex-1 min-w-0">
      {/* Title and Type Badge */}
      <div className="flex items-center space-x-2">
        <p
          className={`text-sm font-medium truncate ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {result.title}
        </p>
        <span
          className={`hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
            theme === "dark"
              ? "bg-green-900/30 text-green-400"
              : "bg-green-100 text-green-700"
          }`}
        >
          URL
        </span>
      </div>

      {/* Subtitle */}
      {result.subtitle && (
        <p
          className={`text-xs truncate mt-0.5 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {result.subtitle}
        </p>
      )}

      {/* Metadata */}
      {result.metadata && (
        <div className="flex items-center space-x-2 sm:space-x-3 mt-1">
          {result.metadata.clickCount !== undefined && (
            <div className="flex items-center space-x-1">
              <MousePointer
                className={`w-3 h-3 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {result.metadata.clickCount.toLocaleString()}
              </span>
            </div>
          )}
          {result.metadata.shortCode && (
            <div className="hidden sm:flex items-center space-x-1">
              <Hash
                className={`w-3 h-3 ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs font-mono ${
                  theme === "dark" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {result.metadata.shortCode}
              </span>
            </div>
          )}
        </div>
      )}
    </div>

    {/* Arrow Icon - Hidden on mobile */}
    <ArrowUpRight
      className={`hidden sm:block w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
        theme === "dark" ? "text-gray-400" : "text-gray-500"
      }`}
    />
  </div>
);

export default EnhancedSearch;
