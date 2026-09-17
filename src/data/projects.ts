export interface Project {
	slug: string;
	title: string;
	meta: string;
	description: string;
	direction: string;
	image: string;
	alt: string;
	href: string;
}

export const projects: Project[] = [
	{
		slug: 'pottr',
		title: 'Pottr',
		meta: 'B2B · Developer tool · Personal project · Beta',
		description: 'A WordPress plugin that turns WordPress into the backend for web applications.',
		direction: 'Product direction · AI-assisted development',
		image: '/images/Pottr.webp',
		alt: 'Pottr — WordPress headless backend plugin interface',
		href: '/work/pottr',
	},
	{
		slug: 'philosophr',
		title: 'Philosophr',
		meta: 'No-code website builder · Personal product · In development',
		description: 'A visual website builder for creating and editing web pages without writing code.',
		direction: 'Product direction · AI-assisted development',
		image: '/images/Philosophr.webp',
		alt: 'Philosophr — Visual website builder interface',
		href: '/work/philosophr',
	},
	{
		slug: 'surecontact',
		title: 'SureContact',
		meta: 'B2B · SaaS · Email marketing · Lightweight CRM',
		description: 'An email marketing platform and lightweight CRM designed around simplicity, speed, and usability.',
		direction: 'Lead product designer · AI-assisted implementation',
		image: '/images/SureContact.webp',
		alt: 'SureContact — Email marketing and lightweight CRM dashboard',
		href: '/work/surecontact',
	},
	{
		slug: 'ottokit',
		title: 'Ottokit',
		meta: 'B2B · SaaS · Workflow automation · Integrations',
		description: 'A workflow automation platform for building multi-step flows across apps and integrations.',
		direction: 'Lead product designer',
		image: '/images/OttoKit.webp',
		alt: 'Ottokit — Workflow automation and integrations platform',
		href: '/work/ottokit',
	},
	{
		slug: 'staffing-platform',
		title: 'Staffing platform',
		meta: 'B2B · Staffing platform · Internal product · Early-stage commercialization',
		description: 'A staffing platform for sourcing and managing candidates across global markets.',
		direction: 'Lead product designer',
		image: '/images/Pottr.webp',
		alt: 'Staffing platform — Candidate sourcing and management interface',
		href: '#staffing-platform',
	},
];
