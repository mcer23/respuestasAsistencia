export interface SearchOption {
    label: string;
    value: string;
}
export interface Notification { 
    text: string, 
    icon: string, 
    type: string, 
    title: string,
    date: Date
};
export interface AditionalUserData {
    displayName: string | null,
    givenName: string | null,
    surname: string | null,
    employeeId: string | null,
    mail: string | null,
    jobTitle: string | null,
    department: string | null,
    companyName: string | null,
    email: string | null
}
export interface SidebarMenuItem {
    title: string;
    icon?: string;
    items?: SidebarMenuItem[];
    to?: string;
}