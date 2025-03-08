<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/assets/logos/magickme_logo_cerulean.svg';
	import glitch from '$lib/assets/images/glitch.png';
	import CenteredModified from '$lib/components/CenteredModified.svelte';
	import ThreeColumnSmallIcons from '$lib/components/ThreeColumnSmallIcons.svelte';
	import ThreeColumnSmallIcons2 from '$lib/components/ThreeColumnSmallIcons2.svelte';
	import WithCards from '$lib/components/WithCards.svelte';
	import SimpleCenteredBackground from '$lib/components/SimpleCenteredBackground.svelte';
	import CenteredAccordionDark from '$lib/components/CenteredAccordionDark.svelte';
	import SimpleCenteredBrand from '$lib/components/SimpleCenteredBrand.svelte';
	import TwoColumnsPhoto from '$lib/components/TwoColumnsPhoto.svelte';
	import ThreeColumnIllustrationsSplitHeader from '$lib/components/ThreeColumnIllustrationsSplitHeader.svelte';
	import FourColumnCompanyMission from '$lib/components/FourColumnCompanyMission.svelte';
	import MembershipPitch from '$lib/components/MembershipPitch.svelte';
	import TestimonialsGrid from '$lib/components/TestimonialsGrid.svelte';
	import FeaturedTeacher from '$lib/components/FeaturedTeacher.svelte';
	import FamousMages from '$lib/components/FamousMages.svelte';
	import CourseGrid from '$lib/components/CourseGrid.svelte';
	import CoursePricingPlans from '$lib/components/CoursePricingPlans.svelte';
	import RelatedPosts from '$lib/components/RelatedPosts2.svelte';
	import CurriculumOverview from '$lib/components/CurriculumOverview.svelte';
	import PricingSection from '$lib/components/PricingSection.svelte';
	import { courses, bundles } from '$lib/data/pricing.json';
	import type { Course } from '$lib/types/course';
	import type { RandomPost } from '$lib/types/course';
	import CurriculumSection from '$lib/components/CurriculumSection.svelte';
	import faqs from '$lib/collections/faqs/faq.json';
	import EnhancedPricingSection from '$lib/components/EnhancedPricingSection.svelte';
	import { onMount } from 'svelte';
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';

	interface BaseCourse {
		id: number;
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
		features?: any[];
		curriculum_sections?: Array<{
			title: string;
			description: string;
			cards: any;
		}>;
		testimonials?: Array<any>;
		curriculum_head?: {
			prehead: string;
			title: string;
			description: string;
		};
		curriculum_features?: Array<any>;
		featured_teacher?: {
			title: string;
			description: string;
			name: string;
			role: string;
			bio: string;
			image: string;
			x_link: string;
			linkedin_link?: string;
		};
	}

	interface PromoVideo {
		title: string;
		subtitle: string;
		videoUrl: string;
	}

	interface MoreFeature {
		icon: string;
		title: string;
		description: string;
		linkUrl?: string;
		linkText?: string;
	}

	interface MoreFeatures {
		title: string;
		subtitle: string;
		description: string;
		features: MoreFeature[];
	}

	interface Demo {
		visible: boolean;
		src: string;
		alt: string;
	}

	interface ExtendedCourse extends Omit<BaseCourse, 'id'> {
		id: string;
		moreFeatures: {
			title: string;
			subtitle: string;
			description: string;
			features: Array<{
				icon: string;
				title: string;
				description: string;
				linkUrl?: string;
				linkText?: string;
			}>;
		};
		demo?: {
			visible: boolean;
			src: string;
			alt?: string;
		};
		faq?: Array<{
			question: string;
			answer: string;
		}>;
		promoVideo?: {
			title: string;
			subtitle: string;
			videoUrl: string;
		};
	}

	interface PageState {
		course: ExtendedCourse;
		randomPosts: any[];
		isLoading: boolean;
		selectedTab: string;
		pricingCourses: BaseCourse[];
	}

	let { data } = $props();

	let pageState = $state<PageState>({
		course: {
			...data.course,
			id: data.course?.id?.toString() || '',
			related_courses: data.course?.related_courses || [],
			testimonials: data.course?.testimonials || [],
			promoVideo: data.course?.promoVideo || {
				title: '',
				subtitle: '',
				videoUrl: ''
			},
			moreFeatures: {
				title: data.course?.moreFeatures?.title || '',
				subtitle: data.course?.moreFeatures?.subtitle || '',
				description: data.course?.moreFeatures?.description || '',
				features: data.course?.moreFeatures?.features || []
			},
			demo: data.course?.demo,
			faq: data.course?.faq || []
		} as ExtendedCourse,
		randomPosts: [],
		isLoading: false,
		selectedTab: 'Trending Now',
		pricingCourses: [data.course] as BaseCourse[]
	});

	const tagMap = {
		'Trending Now': 'trending',
		Magick: 'magick',
		Meditation: 'meditation',
		'Art and Creation': 'art',
		'Career and Finance': 'wealth'
	};

	function handleSectionClick(e: MouseEvent) {
		const target = e.target as HTMLAnchorElement;
		if (target?.href?.includes('#')) {
			e.preventDefault();
			const id = target.href.split('#')[1];
			const sectionNames = {
				pricing: 'Pricing Section',
				curriculum: 'Course Curriculum',
				hero: 'Course Introduction',
				benefits: 'Course Benefits',
				faq: 'Frequently Asked Questions'
			};
			target.setAttribute('aria-label', `Navigate to ${sectionNames[id as keyof typeof sectionNames] || id} section`);
			scrollToSection(id);
		}
	}

	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
			// Update URL without triggering scroll
			history.pushState(null, '', `#${id}`);
		}
	}

	let isNavVisible = $state(false);
	let isOverPricing = $state(false);

	function handleScroll() {
		const heroSection = document.querySelector('#hero');
		const pricingSection = document.querySelector('#pricing');
		
		if (heroSection && pricingSection) {
			const heroBottom = heroSection.getBoundingClientRect().bottom;
			const pricingTop = pricingSection.getBoundingClientRect().top;
			const pricingBottom = pricingSection.getBoundingClientRect().bottom;
			
			// Show nav after hero section
			const shouldShowNav = heroBottom <= 0;
			
			// Hide nav when pricing section is in view
			const isPricingInView = pricingTop <= 0 && pricingBottom > 0;
			
			isNavVisible = shouldShowNav && !isPricingInView;
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleScroll, { passive: true });
			return () => window.removeEventListener('scroll', handleScroll);
		}
	});

	let player: any;
	let videoRef = $state<HTMLVideoElement | null>(null);

	onMount(async () => {
		const Plyr = (await import('plyr')).default;
		await import('plyr/dist/plyr.css');
		player = new Plyr('#player', {
			controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
			iconUrl: '/plyr.svg',
			blankVideo: '/blank.mp4',
			loadSprite: false,
			hideControls: false,
			resetOnEnd: true,
			quality: { default: 1080, options: [4320, 2880, 2160, 1440, 1080, 720, 576, 480, 360, 240] }
		});
	});
</script>

<svelte:head>
	<title>{pageState.course.name?.replace(/<[^>]*>/g, '') || 'The Adept Initiative'}</title>
	<link rel="canonical" href={$page.url.href} title="Current page: {pageState.course.name?.replace(/<[^>]*>/g, '') || 'The Adept Initiative'}" aria-label="Canonical link for {pageState.course.name?.replace(/<[^>]*>/g, '') || 'The Adept Initiative'}" />
</svelte:head>

{#if $page.error}
	<div class="flex min-h-screen items-center justify-center bg-ivory">
		<div class="text-center">
			<h1 class="mb-4 font-montserrat text-4xl font-bold text-corsair">Error</h1>
			<p class="font-sourceSans text-lg text-flannel">{$page.error.message}</p>
		</div>
	</div>
{:else if pageState.course && Object.keys(pageState.course).length > 0}
	<SimpleCenteredBackground
		id="hero"
		title="The Adept Initiative I & II"
		description="Master Your World. Rule Your Reality. Unleash Your True Self."
		announcement="Next Cohort Starting Soon"
		backgroundVideo="https://pub-d1204a6a488440efbe4cd01dd5f68840.r2.dev/evolve1_small.mp4"
		linkOneText="Begin Your Journey"
		linkOneUrl="#pricing"
		linkTwoText="See Course Details"
		linkTwoUrl="#curriculum"
		startDate="Jan 6–Feb 14, 2025 & Mar 16–Apr 25, 2025"
		class="pt-16 pb-24"
		on:click={(e) => handleSectionClick(e)}
	/>

	<!-- Sticky Navigation -->
	<div 
		class="sticky top-0 z-50 transform-gpu transition-all duration-300 backdrop-blur-md"
		class:opacity-0={!isNavVisible}
		class:translate-y-[-100%]={!isNavVisible}
		class:opacity-100={isNavVisible}
		class:translate-y-0={isNavVisible}
	>
		<div class="bg-gradient-to-r from-cerulean via-cerulean/95 to-cerulean relative overflow-hidden">
			<!-- Animated background effect -->
			<div class="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
			
			<nav class="mx-auto max-w-7xl px-4 sm:px-6 py-2 sm:py-3">
				<div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
					<!-- Left side: Navigation -->
					<div class="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
						<a 
							href="#pricing" 
							class="text-ivory hover:text-kohl transition-all duration-200 text-sm font-medium tracking-wide hover:scale-105 transform whitespace-nowrap py-1"
						>
							View Pricing
						</a>
						<a 
							href="#curriculum" 
							class="text-ivory hover:text-kohl transition-all duration-200 text-sm font-medium tracking-wide hover:scale-105 transform whitespace-nowrap py-1"
						>
							See Curriculum
						</a>
					</div>

					<!-- Center: Announcement -->
					<div class="flex items-center w-full sm:w-auto justify-center">
						<div class="flex flex-col items-center sm:flex-row sm:items-center bg-kohl/10 py-1.5 px-3 rounded-lg">
							<div class="flex items-center gap-1 mb-0.5 sm:mb-0 sm:mr-2">
								<span class="text-ivory/90 text-sm">🔥</span>
								<span class="text-ivory/90 text-sm font-medium">Next Cohort Starting Soon</span>
							</div>
						</div>
					</div>

					<!-- Right: CTA -->
					<div class="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center sm:justify-end">
						<a 
							href="#pricing" 
							class="transform transition-all duration-200 rounded-lg bg-kohl/90 hover:bg-kohl px-4 sm:px-6 py-2 text-sm font-bold text-ivory shadow-lg hover:shadow-kohl/20 hover:-translate-y-0.5 active:translate-y-0 border border-ivory/10 whitespace-nowrap w-full sm:w-auto text-center"
						>
							Begin Your Journey
						</a>
					</div>
				</div>
			</nav>
		</div>
	</div>

	<!-- Key Benefits -->
	<div id="benefits" class="scroll-mt-20">
		<ThreeColumnSmallIcons
			title="The Adept Initiative is back.
And it's better than ever."
			subtitle="Join us online for the ultimate training in
Magick & the Occult—and Unleash Your True Self."
			description="Jan 6–Feb 14 and Mar 16–Apr 25, 2025."
			videoUrl={pageState.course.promoVideo?.videoUrl}
			postVideoDescription="Our greatest training ever—Adept Initiative I—is fully revamped, reimagined and ready for a brand new generation of students.

And Adept Initiative II—the long-awaited follow-up, in which you'll master ceremonial magick & astral voyages on the Tree of Life—is finally here.

Together, they're the most comprehensive training in Magick & the Occult ever created."
			features={[
				{
					title: "The Adept Initiative I—Jan 6–Feb 14, 2025",
					description: "Join over 10,000+ successful students",
					icon: "🎯"
				},
				{
					title: "The Adept Initiative II—Mar 16–Apr 25, 2025",
					description: "Learn at your own pace with unlimited access",
					icon: "🔑"
				},
				{
					title: "Expert Support",
					description: "Get guidance from experienced practitioners",
					icon: "👥"
				}
			]}
		/>
	</div>

	<!-- Social Proof -->
	<div data-testid="testimonial-section" class="bg-ivory">
		<TestimonialsGrid testimonials={pageState.course.testimonials || []} />
	</div>

	<!-- Pricing Section -->
	<div id="pricing">
		<EnhancedPricingSection course={pageState.pricingCourses[0]} />
	</div>

	<!-- Curriculum Overview -->
	<div id="curriculum" class="scroll-mt-20">
		<CurriculumOverview
			curriculumHead={pageState.course.curriculum_head ?? { prehead: '', title: '', description: '' }}
			features={pageState.course.curriculum_features || []}
		/>
	</div>

	<!-- Detailed Curriculum -->
	{#if pageState.course.curriculum_sections}
		<div class="bg-kohl">
			{#each pageState.course.curriculum_sections as section}
				<div>
					<CurriculumSection
						title={section.title}
						description={section.description}
						units={section.cards.units}
						isDarkMode={true}
					/>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Featured Teacher -->
	{#if pageState.course.featured_teacher}
		<div class="bg-ivory">
			<FeaturedTeacher
				title={pageState.course.featured_teacher.title}
				description={pageState.course.featured_teacher.description}
				memberName={pageState.course.featured_teacher.name}
				memberRole={pageState.course.featured_teacher.role}
				memberBio={pageState.course.featured_teacher.bio}
				memberImage={pageState.course.featured_teacher.image}
				memberXLink={pageState.course.featured_teacher.x_link}
				memberLinkedinLink={pageState.course.featured_teacher.linkedin_link}
			/>
		</div>
	{/if}

	<!-- Additional Features -->
	<ThreeColumnSmallIcons2
		title={pageState.course.moreFeatures?.title}
		subtitle={pageState.course.moreFeatures?.subtitle}
		description={pageState.course.moreFeatures?.description}
		features={pageState.course.moreFeatures?.features.map((feature) => ({
			icon: feature.icon,
			title: feature.title,
			description: feature.description,
			linkUrl: feature.linkUrl,
			linkText: feature.linkText
		})) || []}
	/>

	<!-- FAQs -->
	<div id="faq">
		<CenteredAccordionDark faqs={faqs} />
	</div>

	<!-- Final CTA -->
	<SimpleCenteredBrand
		title="Ready to transform your life?"
		description="Join our next cohort and begin your journey"
		ctaText="Enroll Now"
		ctaHref="#pricing"
	/>
{/if}

<style>
	:global(body) {
		@apply bg-kohl text-ivory;
	}

	:global(html) {
		scroll-behavior: smooth;
	}

	.scroll-mt-20 {
		scroll-margin-top: 5rem;
	}

	/* Mobile Optimizations */
	@media (max-width: 640px) {
		.sticky nav {
			@apply px-2 py-2;
		}
		
		.sticky nav a {
			@apply text-sm;
		}
	}
</style>
