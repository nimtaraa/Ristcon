/**
 * API Endpoints Configuration
 * Centralized API endpoint definitions
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api/v1';
const CONFERENCE_YEAR = import.meta.env.VITE_CONFERENCE_YEAR || '2026';

export const API_ENDPOINTS = {
  // Conference endpoints
  CONFERENCES: `${API_BASE_URL}/conferences`,
  CONFERENCE_BY_YEAR: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}`,
  
  // Conference-specific endpoints
  SPEAKERS: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/speakers`,
  IMPORTANT_DATES: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/important-dates`,
  COMMITTEES: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/committees`,
  CONTACTS: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/contacts`,
  DOCUMENTS: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/documents`,
  RESEARCH_AREAS: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/research-areas`,
  LOCATION: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/location`,
  AUTHOR_INSTRUCTIONS: (year: string | number = CONFERENCE_YEAR) => 
    `${API_BASE_URL}/conferences/${year}/author-instructions`,
  
  // Registration endpoints
  REGISTRATION: `${API_BASE_URL}/registration`,
  REGISTRATION_FEES: `${API_BASE_URL}/registration/fees`,
  REGISTRATION_POLICIES: `${API_BASE_URL}/registration/policies`,
  PAYMENT_INFORMATION: `${API_BASE_URL}/payment-information`,
} as const;

export { API_BASE_URL, CONFERENCE_YEAR };
