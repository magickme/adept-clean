export interface SocialLink {
    name: string;
    href: string;
    icon: string;
    newTab?: boolean;
}

export interface FooterItem {
    name: string;
    href: string;
    newTab?: boolean;
}

export interface FooterColumn {
    title: string;
    items: FooterItem[];
}

export interface FooterData {
    socialLinks: SocialLink[];
    footerColumns: FooterColumn[];
} 