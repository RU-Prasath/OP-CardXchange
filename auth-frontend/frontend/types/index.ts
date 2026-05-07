export interface JWTPayload {
  userId: string;
  email: string;
  role: 'superadmin' | 'user';
  username: string;
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'array' | 'image' | 'boolean' | 'select' | 'color';
  placeholder?: string;
  options?: string[];
  section: string;
}

export interface TemplateConfig {
  slug: string;
  name: string;
  sections: {
    key: string;
    label: string;
    fields: TemplateField[];
  }[];
  defaultContent: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
