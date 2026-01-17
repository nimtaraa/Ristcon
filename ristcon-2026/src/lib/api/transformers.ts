/**
 * Data Transformers
 * Utilities to transform API responses to frontend-compatible formats
 */

import type {
  Speaker,
  ImportantDate,
  ResearchCategory,
  CommitteeMember,
  ContactPerson,
  Document,
} from './types';

import {
  User,
  Award,
  Presentation,
  Clock,
  CheckCircle,
  Users,
  Calendar,
  FileText,
  Download,
  File,
} from 'lucide-react';

/**
 * Transform speaker data for frontend components
 */
export function transformSpeaker(speaker: Speaker) {
  const speakerTypeLabel =
    speaker.speaker_type.charAt(0).toUpperCase() + speaker.speaker_type.slice(1);

  return {
    id: speaker.id,
    name: speaker.full_name,
    title: `${speakerTypeLabel} Speaker`,
    affiliation: speaker.affiliation,
    expertise: speaker.bio,
    type: speaker.speaker_type,
    image: speaker.photo_url,
    academicTitle: speaker.title,
    additionalAffiliation: speaker.additional_affiliation,
    websiteUrl: speaker.website_url,
    email: speaker.email,
    displayOrder: speaker.display_order,
  };
}

/**
 * Transform important date for timeline components
 */
export function transformImportantDate(date: ImportantDate) {
  // Icon mapping based on date type
  const iconMap: Record<string, typeof Clock> = {
    submission_deadline: Clock,
    notification: CheckCircle,
    camera_ready: Users,
    conference_date: Calendar,
    registration_deadline: Calendar,
  };

  // Color mapping
  const colorMap: Record<string, string> = {
    submission_deadline: 'text-blue-500',
    notification: 'text-green-500',
    camera_ready: 'text-purple-500',
    conference_date: 'text-red-500',
    registration_deadline: 'text-orange-500',
  };

  // Format date
  const dateObj = new Date(date.date_value);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    id: date.id,
    title: date.display_label,
    date: formattedDate,
    rawDate: date.date_value,
    description: date.notes || '',
    icon: iconMap[date.date_type] || Calendar,
    status: date.is_passed ? 'completed' : 'upcoming',
    color: colorMap[date.date_type],
    daysRemaining: date.days_remaining,
    isExtended: date.is_extended,
    originalDate: date.original_date,
    displayOrder: date.display_order,
  };
}

/**
 * Transform research areas for frontend
 */
export function transformResearchAreas(categories: ResearchCategory[]) {
  return categories
    .filter((cat) => cat.is_active)
    .sort((a, b) => a.display_order - b.display_order)
    .map((category) => ({
      id: category.category_code,
      code: category.category_code,
      title: category.category_name,
      description: category.description,
      fields: category.research_areas
        .filter((area) => area.is_active)
        .sort((a, b) => a.display_order - b.display_order)
        .map((area) => area.area_name),
      areasWithAlternates: category.research_areas
        .filter((area) => area.is_active)
        .sort((a, b) => a.display_order - b.display_order)
        .map((area) => ({
          name: area.area_name,
          alternates: area.alternate_names,
        })),
    }));
}

/**
 * Transform committee members for team section
 */
export function transformCommitteeMember(member: CommitteeMember) {
  return {
    id: member.id,
    name: member.full_name,
    designation: member.designation,
    department: member.department,
    affiliation: member.affiliation,
    role: member.role,
    roleCategory: member.role_category,
    country: member.country,
    isInternational: member.is_international,
    displayOrder: member.display_order,
    committeeType: member.committee_type?.committee_name,
  };
}

/**
 * Transform grouped committees
 */
export function transformGroupedCommittees(grouped: Record<string, CommitteeMember[]>) {
  const result: Record<string, ReturnType<typeof transformCommitteeMember>[]> = {};

  for (const [committeeName, members] of Object.entries(grouped)) {
    result[committeeName] = members
      .sort((a, b) => a.display_order - b.display_order)
      .map(transformCommitteeMember);
  }

  return result;
}

/**
 * Transform contact person
 */
export function transformContactPerson(contact: ContactPerson) {
  return {
    id: contact.id,
    position: contact.role,
    name: contact.full_name,
    department: contact.department,
    mobile: contact.mobile,
    phone: contact.phone,
    email: contact.email,
    address: contact.address,
    displayOrder: contact.display_order,
  };
}

/**
 * Transform document for downloads section
 */
export function transformDocument(doc: Document) {
  // Icon mapping
  const iconMap: Record<string, typeof FileText> = {
    author_form: FileText,
    abstract_template: File,
    registration_form: Download,
    declaration_form: FileText,
    programme: Calendar,
    proceedings: FileText,
    instructions: FileText,
    presentation_guide: Presentation,
    camera_ready_template: File,
    poster: Award,
    flyer: FileText,
  };

  // Description mapping based on category
  const descriptionMap: Record<string, string> = {
    author_form: 'Complete required form',
    abstract_template: 'Template for your abstract',
    registration_form: 'Register for the conference',
    declaration_form: 'Declaration and agreement',
    programme: 'Full conference schedule',
    proceedings: 'Conference proceedings',
    instructions: 'Guidelines and instructions',
    presentation_guide: 'Presentation requirements',
    camera_ready_template: 'Format your final paper',
    poster: 'Conference poster',
    flyer: 'Share and promote',
  };

  return {
    id: doc.id,
    title: doc.display_name,
    category: doc.document_category,
    filename: doc.file_name,
    icon: iconMap[doc.document_category] || FileText,
    description: descriptionMap[doc.document_category] || 'Download this document',
    downloadUrl: doc.download_url,
    fileSize: doc.file_size_formatted,
    mimeType: doc.mime_type,
    isAvailable: doc.is_available,
    buttonWidth: doc.button_width_percent,
    displayOrder: doc.display_order,
  };
}

/**
 * Calculate countdown from conference date
 */
export function calculateCountdown(conferenceDate: string) {
  const target = new Date(conferenceDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
  };
}

/**
 * Sort items by display order
 */
export function sortByDisplayOrder<T extends { display_order?: number; displayOrder?: number }>(
  items: T[]
): T[] {
  return items.sort((a, b) => {
    const orderA = a.display_order ?? a.displayOrder ?? 0;
    const orderB = b.display_order ?? b.displayOrder ?? 0;
    return orderA - orderB;
  });
}
