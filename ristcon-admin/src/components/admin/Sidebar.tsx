import { Link, useLocation } from 'react-router-dom';
import {
  Calendar,
  Users,
  FileText,
  Image,
  LayoutDashboard,
  Megaphone,
  MapPin,
  DollarSign,
  BookOpen,
  Phone,
  Share2,
  CreditCard,
  Send,
  Presentation,
  FileEdit
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Editions', href: '/admin/editions', icon: LayoutDashboard },
  { name: 'Speakers', href: '/admin/speakers', icon: Megaphone },
  { name: 'Important Dates', href: '/admin/dates', icon: Calendar },
  { name: 'Documents', href: '/admin/documents', icon: FileText },
  { name: 'Committee Members', href: '/admin/committee', icon: Users },
  { name: 'Research Areas', href: '/admin/research', icon: BookOpen },
  { name: 'Assets', href: '/admin/assets', icon: Image },
  { name: 'Event Locations', href: '/admin/locations', icon: MapPin },
  { name: 'Contact Persons', href: '/admin/contacts', icon: Phone },
  { name: 'Social Media', href: '/admin/social-media', icon: Share2 },
  { name: 'Registration Fees', href: '/admin/registration-fees', icon: DollarSign },
  { name: 'Payment Info', href: '/admin/payment-info', icon: CreditCard },
  { name: 'Submission Methods', href: '/admin/submission-methods', icon: Send },
  { name: 'Presentation Guidelines', href: '/admin/presentation-guidelines', icon: Presentation },
  { name: 'Author Config', href: '/admin/author-config', icon: FileEdit },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-primary">RISTCON Admin</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          isActive
                            ? 'bg-gray-50 text-primary'
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
