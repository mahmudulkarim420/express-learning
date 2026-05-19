export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    age: number;
    isActive: boolean;
    create_at: string;
    updated_at?: string;
}