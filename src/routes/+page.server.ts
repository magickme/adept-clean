import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import coursesData from '$lib/collections/courses/courses.json';

type RandomPost = {
    id: number;
    title: string;
    slug: string;
    image_url: string;
}

type Course = {
    id: number;
    name: string;
    slug: string;
    image_url: string;
    tags: string[];
    heading?: string;
    hero?: {
        announcement?: string;
        linkTwoText?: string;
        linkTwoUrl?: string;
    };
    upsell?: {
        text?: string;
        link?: string;
    };
    topThree?: {
        subtitle?: string;
        description?: string;
        features: Array<{
            name: string;
            description: string;
            icon: string;
            linkUrl?: string;
            linkText?: string;
        }>;
    };
    promoVideo?: {
        title?: string;
        subtitle?: string;
        videoUrl?: string;
    };
    cards?: {
        title?: string;
        description?: string;
        units?: any[];
    };
    testimonials?: any[];
    curriculum_head?: {
        prehead: string;
        title: string;
        description: string;
    };
    curriculum_features?: any[];
    demo?: {
        visible: boolean;
        src: string;
        alt?: string;
    };
    faq?: any[];
    among_greats?: boolean;
    moreFeatures?: {
        title?: string;
        subtitle?: string;
        description?: string;
        features: Array<{
            icon: string;
            title: string;
            description: string;
            linkUrl?: string;
            linkText?: string;
        }>;
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
    charity_donation?: {
        visible: boolean;
        title: string;
        link: string;
        image: string;
    };
    related_courses?: Course[];
    pricing_plans?: Array<{
        id: number;
        price: number;
    }>;
}

export const load: PageServerLoad = async ({ params }) => {
    try {
        const course = coursesData.courses.find(c => c.id === 705099);
        
        if (!course) {
            throw error(404, {
                message: 'Course not found'
            });
        }

        // Sort pricing plans by price if they exist
        if (course.pricing_plans) {
            course.pricing_plans.sort((a, b) => a.price - b.price);
        }

        // Get related courses (up to 3)
        const relatedCourses = coursesData.courses
            .filter(c => c.id !== 705099 && c.tags?.some(tag => course.tags?.includes(tag)))
            .slice(0, 3);

        course.related_courses = relatedCourses;

        // Initialize with proper type
        const randomPosts: RandomPost[] = [];

        return {
            course,
            randomPosts,
            meta: {
                title: course.name || 'The Adept Initiative',
                description: course.heading || 'Master Your World. Rule Your Reality. Unleash Your True Self.',
                image: course.image_url || '/adept2.png',
                author: course.featured_teacher?.name || 'Adept Initiative',
                keywords: course.tags?.join(', ') || 'magick, occult, adept initiative, spiritual training'
            }
        };
    } catch (e) {
        console.error('Error in load function:', e);
        throw error(500, 'An error occurred while loading the course data');
    }
}; 