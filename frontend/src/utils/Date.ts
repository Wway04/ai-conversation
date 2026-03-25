import { format } from 'date-fns';

export const formatDate = (date: any) => {
  if (!date) return null;

  const d = new Date(date);
  const originalFormat = d.toLocaleString();

  return originalFormat;
};

export const formatDateLocal = (date: any) => {
  const d = new Date(date);
  const originalFormat = d.toLocaleString();

  return originalFormat;
};

export const renderDate = (date: any) => {
  if (!date) return null;

  const d = new Date(date instanceof Date ? date.getTime() : date);

  if (isNaN(d.getTime())) {
    return null;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${day}-${month}-${year}`;
};

export const formatISODate = (date: any) => {
  if (!date) return null;

  const d = new Date(date instanceof Date ? date.getTime() : date);

  if (isNaN(d.getTime())) {
    return null;
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}/${month}/${day}`;
};

export const renderDateFilter = (date: any) => {
  if (!date) return null;

  const d = new Date(date instanceof Date ? date.getTime() : date);

  if (isNaN(d.getTime())) {
    return null;
  }

  const dateString = d.toLocaleString();
  const parts = dateString.split(', ');
  const datePart = parts[0];
  const timePart = parts[1];

  const [month, day, year] = datePart.split('/');

  const newDatePart = `${day}/${month}/${year}`;

  return `${newDatePart}, ${timePart}`;
};

export const formatMessageTime = (dateString: string | Date): string => {
  if (!dateString) return '';

  let normalized = dateString;
  if (typeof normalized === 'string') {
    // If it's a date string without timezone info, assume UTC (backend default)
    if (normalized.includes('-') &&
        !normalized.endsWith('Z') &&
        !normalized.includes('+') &&
        !/-\d{2}:\d{2}$/.test(normalized)) {
      normalized = `${normalized.replace(' ', 'T')}Z`;
    }
  }

  let date = new Date(normalized);
  if (isNaN(date.getTime())) return '';

  // Use Intl.DateTimeFormat for maximum control.
  // FORCE Asia/Ho_Chi_Minh (GMT+7) for Vietnamese audience.
  try {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(date);
  } catch (e) {
    return format(date, 'hh:mm a');
  }
};

export const getDateGroupLabel = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return 'This week';
  if (diffInDays < 30) return 'This month';
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

export const formatRelativeTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const diffInMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  const diffInHours   = Math.floor(diffInMinutes / 60);
  const diffInDays    = Math.floor(diffInHours / 24);
  if (diffInMinutes < 1)  return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
  if (diffInHours < 24)   return `${diffInHours} hr ago`;
  if (diffInDays < 7)     return `${diffInDays} d ago`;
  return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit' });
};
