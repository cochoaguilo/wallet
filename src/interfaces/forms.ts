export interface Forms {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'email' | 'password';
    required: boolean;
    options?: { label: string; value: string }[];
    default?: any;
}
