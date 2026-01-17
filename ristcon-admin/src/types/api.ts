// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Conference Edition Types
export interface ConferenceEdition {
  id: number;
  year: number;
  edition_number: number;
  name: string;
  slug: string;
  status: 'draft' | 'published' | 'archived' | 'cancelled';
  is_active_edition: boolean;
  conference_date: string;
  venue_type: 'physical' | 'virtual' | 'hybrid';
  venue_location?: string;
  theme: string;
  description?: string;
  general_email: string;
  availability_hours?: string;
  copyright_year: number;
  site_version: string;
  last_updated?: string;
  created_at: string;
  updated_at: string;
  // Computed attributes
  is_upcoming?: boolean;
  is_past?: boolean;
  days_until_conference?: number;
  formatted_date?: string;
  full_name?: string;
}

export interface CreateEditionDto {
  year: number;
  edition_number: number;
  name: string;
  slug?: string;
  status?: 'draft' | 'published';
  conference_date: string;
  venue_type: 'physical' | 'virtual' | 'hybrid';
  venue_location?: string;
  theme: string;
  description?: string;
  general_email: string;
  copyright_year: number;
}

// Speaker Types
export interface Speaker {
  id: number;
  edition_id: number;
  conference_id: number;
  speaker_type: 'keynote' | 'plenary' | 'invited';
  display_order: number;
  full_name: string;
  title?: string;
  affiliation: string;
  additional_affiliation?: string;
  bio?: string;
  photo_filename?: string;
  photo_url?: string;
  website_url?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSpeakerDto {
  edition_id: number;
  speaker_type: 'keynote' | 'plenary' | 'invited';
  full_name: string;
  title?: string;
  affiliation: string;
  additional_affiliation?: string;
  bio?: string;
  email?: string;
  website_url?: string;
  display_order?: number;
  photo?: File;
}

// Important Date Types
export interface ImportantDate {
  id: number;
  edition_id: number;
  conference_id: number;
  date_type: 'submission_deadline' | 'notification' | 'camera_ready' | 'conference_date' | 'registration_deadline' | 'other';
  date_value: string;
  is_extended: boolean;
  original_date?: string;
  display_order: number;
  display_label: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateImportantDateDto {
  date_type: 'submission_deadline' | 'notification' | 'camera_ready' | 'conference_date' | 'registration_deadline' | 'other';
  date_value: string;
  is_extended?: boolean;
  original_date?: string;
  display_label: string;
  notes?: string;
  display_order?: number;
}

// Document Types
export interface ConferenceDocument {
  id: number;
  edition_id: number;
  conference_id: number;
  document_category: 'abstract_template' | 'author_form' | 'registration_form' | 'presentation_template' | 'camera_ready_template' | 'flyer' | 'other';
  file_name: string;
  file_path: string;
  display_name: string;
  is_active: boolean;
  button_width_percent?: number;
  mime_type?: string;
  file_size?: number;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateDocumentDto {
  document_category: 'abstract_template' | 'author_form' | 'registration_form' | 'presentation_template' | 'camera_ready_template' | 'flyer' | 'other';
  display_name: string;
  file: File;
  is_active?: boolean;
  button_width_percent?: number;
  display_order?: number;
}

// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Committee Types
export interface CommitteeType {
  id: number;
  committee_name: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CommitteeMember {
  id: number;
  edition_id: number;
  conference_id: number;
  committee_type_id: number;
  full_name: string;
  designation: string;
  department?: string;
  affiliation: string;
  role: string;
  role_category?: string;
  country?: string;
  is_international: boolean;
  display_order: number;
  photo_path?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
  committee_type?: CommitteeType;
}

export interface CreateCommitteeMemberDto {
  committee_type_id: number;
  full_name: string;
  designation: string;
  department?: string;
  affiliation: string;
  role: string;
  role_category?: string;
  country?: string;
  is_international?: boolean;
  display_order?: number;
  photo?: File;
}

// Research Types
export interface ResearchCategory {
  id: number;
  edition_id: number;
  conference_id: number;
  category_code: string;
  category_name: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  research_areas_count?: number;
}

export interface CreateResearchCategoryDto {
  category_code: string;
  category_name: string;
  description?: string;
  is_active?: boolean;
  display_order?: number;
}

export interface ResearchArea {
  id: number;
  category_id: number;
  area_name: string;
  alternate_names?: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateResearchAreaDto {
  area_name: string;
  alternate_names?: string[];
  is_active?: boolean;
  display_order?: number;
}

// Conference Asset Types
export interface ConferenceAsset {
  id: number;
  edition_id: number;
  conference_id: number;
  asset_type: 'logo' | 'poster' | 'banner' | 'brochure' | 'image' | 'other';
  file_name: string;
  file_path: string;
  alt_text?: string;
  usage_context?: string;
  mime_type: string;
  file_size: number;
  asset_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAssetDto {
  asset_type: 'logo' | 'poster' | 'banner' | 'brochure' | 'image' | 'other';
  file: File;
  alt_text?: string;
  usage_context?: string;
}

// Event Location Types
export interface EventLocation {
  id: number;
  edition_id: number;
  conference_id: number;
  venue_name: string;
  full_address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  google_maps_embed_url?: string;
  google_maps_link?: string;
  is_virtual: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationDto {
  venue_name: string;
  full_address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  google_maps_embed_url?: string;
  google_maps_link?: string;
  is_virtual?: boolean;
}

// Contact Person Types
export interface ContactPerson {
  id: number;
  edition_id: number;
  conference_id: number;
  full_name: string;
  role: string;
  department?: string;
  mobile: string;
  phone?: string;
  email: string;
  address?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateContactDto {
  full_name: string;
  role: string;
  department?: string;
  mobile: string;
  phone?: string;
  email: string;
  address?: string;
  display_order: number;
}

// Social Media Link Types
export interface SocialMediaLink {
  id: number;
  edition_id: number;
  conference_id: number;
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'email';
  url: string;
  label?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSocialMediaDto {
  platform: 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube' | 'email';
  url: string;
  label?: string;
  display_order: number;
  is_active?: boolean;
}

// Registration Fee Types
export interface RegistrationFee {
  id: number;
  fee_id: number;
  edition_id: number;
  conference_id: number;
  attendee_type: string;
  currency: string;
  amount: number;
  early_bird_amount?: number;
  early_bird_deadline?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateRegistrationFeeDto {
  attendee_type: string;
  currency: string;
  amount: number;
  early_bird_amount?: number;
  early_bird_deadline?: string;
  display_order: number;
  is_active?: boolean;
}

// Payment Information Types
export interface PaymentInformation {
  id: number;
  payment_id: number;
  edition_id: number;
  conference_id: number;
  payment_type: 'local' | 'foreign';
  beneficiary_name?: string;
  bank_name?: string;
  account_number?: string;
  swift_code?: string;
  branch_code?: string;
  branch_name?: string;
  bank_address?: string;
  currency?: string;
  additional_info?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentInfoDto {
  payment_type: 'local' | 'foreign';
  beneficiary_name?: string;
  bank_name?: string;
  account_number?: string;
  swift_code?: string;
  branch_code?: string;
  branch_name?: string;
  bank_address?: string;
  currency?: string;
  additional_info?: string;
  display_order: number;
  is_active?: boolean;
}

// Submission Method Types
export interface SubmissionMethod {
  id: number;
  edition_id: number;
  conference_id: number;
  document_type: 'author_info' | 'abstract' | 'extended_abstract' | 'camera_ready' | 'other';
  submission_method: 'email' | 'cmt_upload' | 'online_form' | 'postal';
  email_address?: string;
  notes?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSubmissionMethodDto {
  document_type: 'author_info' | 'abstract' | 'extended_abstract' | 'camera_ready' | 'other';
  submission_method: 'email' | 'cmt_upload' | 'online_form' | 'postal';
  email_address?: string;
  notes?: string;
  display_order: number;
}

// Presentation Guideline Types
export interface PresentationGuideline {
  id: number;
  edition_id: number;
  conference_id: number;
  presentation_type: 'oral' | 'poster' | 'workshop' | 'panel';
  duration_minutes?: number;
  presentation_minutes?: number;
  qa_minutes?: number;
  poster_width?: number;
  poster_height?: number;
  poster_unit?: 'inches' | 'cm' | 'mm';
  poster_orientation?: 'portrait' | 'landscape';
  physical_presence_required: boolean;
  detailed_requirements?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePresentationGuidelineDto {
  presentation_type: 'oral' | 'poster' | 'workshop' | 'panel';
  duration_minutes?: number;
  presentation_minutes?: number;
  qa_minutes?: number;
  poster_width?: number;
  poster_height?: number;
  poster_unit?: 'inches' | 'cm' | 'mm';
  poster_orientation?: 'portrait' | 'landscape';
  physical_presence_required?: boolean;
  detailed_requirements?: string;
}

// Author Page Config Types
export interface AuthorPageConfig {
  id: number;
  edition_id: number;
  conference_id: number;
  conference_format: 'in_person' | 'virtual' | 'hybrid';
  cmt_url?: string;
  submission_email?: string;
  blind_review_enabled: boolean;
  camera_ready_required: boolean;
  special_instructions?: string;
  acknowledgment_text?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAuthorConfigDto {
  conference_format: 'in_person' | 'virtual' | 'hybrid';
  cmt_url?: string;
  submission_email?: string;
  blind_review_enabled?: boolean;
  camera_ready_required?: boolean;
  special_instructions?: string;
  acknowledgment_text?: string;
}
