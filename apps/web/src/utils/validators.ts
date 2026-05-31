/**
 * Validate email format
 * @param email Email address
 * @returns true if valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param password Password
 * @returns Error message or empty string if valid
 */
export const validatePassword = (password: string): string => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  return '';
};

/**
 * Validate Ecuador phone number
 * @param phone Phone number
 * @returns true if valid Ecuador phone
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+593|0)?[1-9]\d{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate Ecuador RUC
 * @param ruc RUC number
 * @returns true if valid RUC
 */
export const isValidRUC = (ruc: string): boolean => {
  const cleanRuc = ruc.replace(/\D/g, '');
  if (cleanRuc.length !== 13) {
    return false;
  }
  // Basic validation - could be expanded with checksum validation
  return /^\d{13}$/.test(cleanRuc);
};

/**
 * Validate Ecuador ID (Cedula)
 * @param cedula Cedula number
 * @returns true if valid cedula
 */
export const isValidCedula = (cedula: string): boolean => {
  const cleanCedula = cedula.replace(/\D/g, '');
  if (cleanCedula.length !== 10) {
    return false;
  }
  return /^\d{10}$/.test(cleanCedula);
};

/**
 * Validate file size
 * @param file File to validate
 * @param maxSizeMB Maximum size in MB
 * @returns true if file is valid size
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Validate file type
 * @param file File to validate
 * @param allowedTypes Allowed MIME types
 * @returns true if file type is allowed
 */
export const isValidFileType = (
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']
): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate image file
 * @param file File to validate
 * @returns Error message or empty string if valid
 */
export const validateImageFile = (file: File): string => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!isValidFileType(file, validTypes)) {
    return 'Please upload a valid image file (JPEG, PNG, or WebP)';
  }
  if (!isValidFileSize(file, 5)) {
    return 'Image size must be less than 5MB';
  }
  return '';
};

/**
 * Validate required field
 * @param value Value to validate
 * @returns true if value is not empty
 */
export const isRequired = (value: any): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

/**
 * Validate date is in the future
 * @param date Date string
 * @returns true if date is in the future
 */
export const isFutureDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today;
};

/**
 * Validate time format HH:MM
 * @param time Time string
 * @returns true if valid time format
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validate name
 * @param name Name string
 * @returns Error message or empty string if valid
 */
export const validateName = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return 'Name is required';
  }
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (name.trim().length > 100) {
    return 'Name must be less than 100 characters';
  }
  return '';
};

/**
 * Validate quantity
 * @param quantity Quantity value
 * @returns Error message or empty string if valid
 */
export const validateQuantity = (quantity: number | string): string => {
  const num = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
  if (isNaN(num)) {
    return 'Quantity must be a valid number';
  }
  if (num < 1) {
    return 'Quantity must be at least 1';
  }
  if (num > 999) {
    return 'Quantity cannot exceed 999';
  }
  return '';
};
