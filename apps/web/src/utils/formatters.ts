/**
 * Format price as currency
 * @param price Price in cents/minimal units
 * @param currency Currency code (default: USD)
 * @returns Formatted price string
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: currency === 'USD' ? 'USD' : 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Assuming price is in cents, convert to dollars
  return formatter.format(price / 100);
};

/**
 * Format date to readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format time to readable format (HH:MM)
 * @param timeString Time string in HH:MM format
 * @returns Formatted time string
 */
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

/**
 * Format datetime to readable format
 * @param dateString ISO datetime string
 * @returns Formatted datetime string
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  const dateFormatted = date.toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const timeFormatted = date.toLocaleTimeString('es-EC', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${dateFormatted} - ${timeFormatted}`;
};

/**
 * Format distance in kilometers
 * @param distanceKm Distance in kilometers
 * @returns Formatted distance string
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Format phone number
 * @param phone Phone number
 * @returns Formatted phone number
 */
export const formatPhone = (phone: string): string => {
  // Assuming Ecuador format: +593 XX XXXX XXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Format name (capitalize first letter)
 * @param name Name string
 * @returns Formatted name
 */
export const formatName = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Generate short ID for display (e.g., pickup code)
 * @param id Full ID
 * @returns Short ID (last 6 characters uppercase)
 */
export const formatShortId = (id: string): string => {
  return id.slice(-6).toUpperCase();
};

/**
 * Format preparation time
 * @param minutes Preparation time in minutes
 * @returns Formatted time string
 */
export const formatPrepTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}min`;
};
