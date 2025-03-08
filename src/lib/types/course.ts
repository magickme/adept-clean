export interface Unit {
  name: string;
  description: string;
  icon: string;
  skills_unlocked?: string[];
}

export interface Course {
  id: string;
  name: string;
  slug: string;
  link: string;
  heading: string;
  description: string;
  image_url: string;
  author: string;
  author_image: string;
  skill_level: string;
  duration: string;
  tags: string[];
  curriculum_sections: {
    title: string;
    description: string;
    cards: {
      units: Unit[];
    };
  }[];
  hero?: {
    announcement?: string;
    linkTwoText?: string;
    linkTwoUrl?: string;
  };
  promoVideo?: {
    title: string;
    subtitle: string;
    videoUrl?: string;
  };
  topThree?: {
    subtitle: string;
    description: string;
    features: {
      name: string;
      description: string;
      icon: string;
      linkUrl?: string;
      linkText?: string;
    }[];
  };
  demo?: {
    visible: boolean;
    src: string;
    alt?: string;
  };
  faq?: {
    question: string;
    answer: string;
  }[];
  testimonials?: {
    quote: string;
    author: string;
    title: string;
    avatar: string;
    company?: {
      name: string;
      logo: string;
    };
  }[];
  curriculum_head?: {
    prehead: string;
    title: string;
    description: string;
  };
  curriculum_features?: {
    name: string;
    description?: string;
  }[];
  upsell?: {
    text: string;
    link: string;
  };
  moreFeatures?: {
    title: string;
    subtitle: string;
    description: string;
    features: {
      icon: string;
      title: string;
      description: string;
      linkUrl?: string;
      linkText?: string;
    }[];
  };
  featured_teacher?: {
    title: string;
    description: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    x_link?: string;
    linkedin_link?: string;
  };
}

export interface RandomPost {
  feature_image: string;
  published_at: string;
  excerpt: string;
  reading_time: number;
  title: string;
  slug: string;
  primary_tag: string;
} 