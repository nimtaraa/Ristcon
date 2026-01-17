/**
 * API Response Types
 * TypeScript interfaces for all API responses
 */

// Generic API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total?: number;
    page?: number;
    per_page?: number;
  };
}

// Conference
export interface Conference {
  id: number;
  year: number;
  edition_number: number;
  conference_date: string;
  venue_type: 'physical' | 'virtual' | 'hybrid';
  venue_location: string;
  theme: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  general_email: string;
  availability_hours?: string | null;
  last_updated: string;
  copyright_year: number;
  site_version: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Relations
  social_media_links?: SocialMediaLink[];
  event_location?: EventLocation;
  contacts?: ContactPerson[];
  important_dates?: ImportantDate[];
  abstract_formats?: AbstractFormat[];
  // Computed attributes
  countdown?: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    target_date: string;
  };
}

// Speaker
export interface Speaker {
  id: number;
  conference_id: number;
  speaker_type: 'keynote' | 'plenary' | 'invited';
  display_order: number;
  full_name: string;
  title: string;
  affiliation: string;
  additional_affiliation?: string | null;
  bio: string;
  photo_filename: string;
  photo_url: string; // Computed attribute
  website_url?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Important Date
export interface ImportantDate {
  id: number;
  conference_id: number;
  date_type: 'submission_deadline' | 'notification' | 'camera_ready' | 'conference_date' | 'registration_deadline';
  date_value: string;
  is_extended: boolean;
  original_date?: string | null;
  display_order: number;
  display_label: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Computed attributes
  is_passed?: boolean;
  days_remaining?: number;
}

// Committee Type
export interface CommitteeType {
  id: number;
  committee_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Committee Member
export interface CommitteeMember {
  id: number;
  conference_id: number;
  committee_type_id: number;
  full_name: string;
  designation: string;
  department: string;
  affiliation: string;
  role: string;
  role_category?: string | null;
  country: string;
  is_international: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  committee_type?: CommitteeType;
}

// Grouped committees response
export interface GroupedCommittees {
  [committeeTypeName: string]: CommitteeMember[];
}

// Contact Person
export interface ContactPerson {
  id: number;
  conference_id: number;
  full_name: string;
  role: string;
  department: string;
  mobile?: string | null;
  phone?: string | null;
  email: string;
  address?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Document
export interface Document {
  id: number;
  conference_id: number;
  document_category: 'author_form' | 'abstract_template' | 'registration_form' | 'declaration_form' | 
                     'programme' | 'proceedings' | 'instructions' | 'presentation_guide' | 
                     'camera_ready_template' | 'poster' | 'flyer';
  file_name: string;
  file_path: string;
  display_name: string;
  is_available: boolean;
  button_width_percent: number;
  display_order: number;
  mime_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Computed attributes
  download_url: string | null;
  file_size_formatted: string | null;
}

// Research Area
export interface ResearchArea {
  id: number;
  category_id: number;
  area_name: string;
  alternate_names: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Research Category
export interface ResearchCategory {
  id: number;
  conference_id: number;
  category_code: string;
  category_name: string;
  description?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  research_areas: ResearchArea[];
}

// Event Location
export interface EventLocation {
  id: number;
  conference_id: number;
  venue_name: string;
  full_address: string;
  city: string;
  country: string;
  latitude: string;
  longitude: string;
  google_maps_embed_url: string;
  google_maps_link: string;
  is_virtual: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Computed attributes
  google_maps_direction_link?: string;
}

// Author Page Config
export interface AuthorPageConfig {
  id: number;
  conference_id: number;
  conference_format: 'virtual' | 'in_person' | 'hybrid';
  cmt_url: string;
  submission_email: string;
  blind_review_enabled: boolean;
  camera_ready_required: boolean;
  special_instructions?: string | null;
  acknowledgment_text?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// Submission Method
export interface SubmissionMethod {
  id: number;
  conference_id: number;
  document_type: string;
  submission_method: 'cmt_upload' | 'email' | 'both';
  email_address?: string | null;
  notes?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Presentation Guideline
export interface PresentationGuideline {
  id: number;
  conference_id: number;
  presentation_type: 'oral' | 'poster';
  duration_minutes?: number | null;
  presentation_minutes?: number | null;
  qa_minutes?: number | null;
  poster_width?: string | null;
  poster_height?: string | null;
  poster_unit?: string | null;
  poster_orientation?: string | null;
  physical_presence_required: boolean;
  detailed_requirements?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  // Computed attributes
  poster_dimensions?: string;
}

// Abstract Format
export interface AbstractFormat {
  id: number;
  conference_id: number;
  format_type: 'abstract' | 'extended_abstract';
  max_title_characters?: number | null;
  title_font_name?: string | null;
  title_font_size?: number | null;
  title_style?: string | null;
  max_body_words?: number | null;
  body_font_name?: string | null;
  body_font_size?: number | null;
  body_line_spacing?: number | null;
  max_keywords?: number | null;
  keywords_font_name?: string | null;
  keywords_font_size?: number | null;
  keywords_style?: string | null;
  max_references?: number | null;
  sections?: string[] | null;
  additional_notes?: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Author Instructions (composite response)
export interface AuthorInstructions {
  config: AuthorPageConfig;
  submission_methods: SubmissionMethod[];
  presentation_guidelines: PresentationGuideline[];
}

// Query parameters
export interface ConferenceQueryParams {
  status?: 'upcoming' | 'ongoing' | 'completed';
  year?: number;
  include?: string; // e.g., 'speakers,importantDates'
}

export interface SpeakerQueryParams {
  type?: 'keynote' | 'plenary' | 'invited';
}

export interface DocumentQueryParams {
  category?: string;
  available?: boolean;
}

export interface ResearchAreaQueryParams {
  category?: string;
}

// Registration Fee
export interface RegistrationFee {
  fee_id: number;
  conference_id: number;
  attendee_type: string; // e.g., "Foreign Participants", "Local Participants", "Students (Local)"
  currency: string; // e.g., "USD", "LKR"
  amount: string; // Decimal as string
  early_bird_amount?: string | null; // Decimal as string
  early_bird_deadline?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Payment Policy
export interface PaymentPolicy {
  policy_id: number;
  conference_id: number;
  policy_text: string;
  policy_type: 'requirement' | 'restriction' | 'note';
  is_highlighted: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Payment Information (Bank Account Details)
export interface PaymentInformation {
  payment_id: number;
  conference_id: number;
  payment_type: 'local' | 'foreign';
  beneficiary_name: string;
  bank_name: string;
  account_number: string;
  swift_code?: string | null;
  branch_code?: string | null;
  branch_name?: string | null;
  bank_address?: string | null;
  currency: string;
  additional_info?: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Registration Information (composite response)
export interface RegistrationInformation {
  fees: RegistrationFee[];
  policies: PaymentPolicy[];
}

// Social Media Link
export interface SocialMediaLink {
  id: number;
  conference_id: number;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'email';
  url: string;
  label: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Past Event
export interface PastEvent {
  id: number;
  year: number;
  edition_number: number;
  name: string;
  theme: string;
  conference_date: string;
  venue_type: 'physical' | 'virtual' | 'hybrid';
  venue_location: string | null;
  website_type: 'legacy' | 'unified';
  url: string;
  is_legacy: boolean;
}
