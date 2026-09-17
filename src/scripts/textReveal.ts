/**
 * Reusable Heading Text-Reveal Animation System
 *
 * Visual & Motion Direction:
 * - Restrained editorial reveal: starts slightly below final position (translateY: 24px)
 *   and transitions upward into place with opacity 0 -> 1 over 800ms.
 * - Line-based masking with subtle stagger between lines (80ms per line).
 * - H1 on homepage & case studies reveals automatically on page arrival.
 * - H2 & H3 headings reveal on scroll via IntersectionObserver (once only).
 * - Accessible: original text kept in aria-label, animation spans are aria-hidden.
 * - Reduced motion: immediately visible without animation if prefers-reduced-motion is enabled.
 * - Responsive: dynamically measures actual word wrap positions in the current viewport.
 */

interface Token {
	type: 'word' | 'br';
	text?: string;
	className?: string;
}

function getChildTokens(node: Node): Token[] {
	const tokens: Token[] = [];
	node.childNodes.forEach((child) => {
		if (child.nodeType === Node.TEXT_NODE) {
			const text = child.textContent || '';
			const words = text.split(/\s+/).filter(Boolean);
			words.forEach((w) => tokens.push({ type: 'word', text: w }));
		} else if (child.nodeType === Node.ELEMENT_NODE) {
			const el = child as HTMLElement;
			if (el.tagName === 'BR') {
				tokens.push({ type: 'br', className: el.className });
			} else {
				tokens.push(...getChildTokens(el));
			}
		}
	});
	return tokens;
}

export function splitHeadingIntoLines(heading: HTMLElement): boolean {
	if (heading.dataset.headingSplit === 'true') return true;

	const originalText = heading.textContent?.replace(/\s+/g, ' ').trim() || '';
	if (!originalText) return false;

	// Set accessible label for screen readers
	heading.setAttribute('aria-label', originalText);

	const tokens = getChildTokens(heading);
	if (tokens.length === 0) return false;

	// Temporary measurement container to evaluate line wrapping in the current viewport
	const spanTokens: { el: HTMLElement; type: 'word' | 'br'; text?: string }[] = [];
	const measureFrag = document.createDocumentFragment();

	tokens.forEach((token) => {
		if (token.type === 'word') {
			const span = document.createElement('span');
			span.className = 'text-reveal-word';
			span.textContent = token.text || '';
			measureFrag.appendChild(span);
			measureFrag.appendChild(document.createTextNode(' '));
			spanTokens.push({ el: span, type: 'word', text: token.text });
		} else if (token.type === 'br') {
			const br = document.createElement('br');
			if (token.className) br.className = token.className;
			measureFrag.appendChild(br);
			spanTokens.push({ el: br, type: 'br' });
		}
	});

	heading.innerHTML = '';
	heading.appendChild(measureFrag);

	// Group words by their vertical position (getBoundingClientRect().top)
	const lineGroups: string[][] = [];
	let currentLine: string[] = [];
	let currentLineTop = -99999;

	spanTokens.forEach((t) => {
		if (t.type === 'br') return;
		const rect = t.el.getBoundingClientRect();
		const top = Math.round(rect.top);

		if (currentLineTop === -99999 || Math.abs(top - currentLineTop) <= 6) {
			currentLine.push(t.text!);
			currentLineTop = top;
		} else {
			if (currentLine.length > 0) {
				lineGroups.push(currentLine);
			}
			currentLine = [t.text!];
			currentLineTop = top;
		}
	});

	if (currentLine.length > 0) {
		lineGroups.push(currentLine);
	}

	// Build the line-masked DOM structure
	const linesWrapper = document.createElement('span');
	linesWrapper.className = 'heading-reveal-lines';
	linesWrapper.setAttribute('aria-hidden', 'true');

	lineGroups.forEach((words, lineIdx) => {
		const lineSpan = document.createElement('span');
		lineSpan.className = 'heading-reveal-line';

		const innerSpan = document.createElement('span');
		innerSpan.className = 'heading-reveal-line-inner';
		innerSpan.style.setProperty('--line-index', lineIdx.toString());
		innerSpan.textContent = words.join(' ');

		lineSpan.appendChild(innerSpan);
		linesWrapper.appendChild(lineSpan);
	});

	heading.innerHTML = '';
	heading.appendChild(linesWrapper);
	heading.dataset.headingSplit = 'true';
	return true;
}

let activeObserver: IntersectionObserver | null = null;
let resizeHandlerAttached = false;
let lastWindowWidth = 0;

export function initTextReveal() {
	if (typeof window === 'undefined') return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const headings = Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3'));

	if (headings.length === 0) return;

	if (prefersReducedMotion) {
		headings.forEach((heading) => {
			heading.classList.add('heading-revealed');
			heading.dataset.headingRevealed = 'true';
		});
		return;
	}

	// Disconnect existing observer on new page arrival
	if (activeObserver) {
		activeObserver.disconnect();
	}

	activeObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const target = entry.target as HTMLElement;
					target.classList.add('heading-revealed');
					target.dataset.headingRevealed = 'true';
					activeObserver?.unobserve(target);
				}
			});
		},
		{
			rootMargin: '0px 0px -30px 0px',
			threshold: 0.1,
		}
	);

	headings.forEach((heading) => {
		// Do not re-process already revealed headings
		if (heading.dataset.headingRevealed === 'true') return;

		const isH1 = heading.tagName.toLowerCase() === 'h1';
		splitHeadingIntoLines(heading);

		if (isH1) {
			// Arrival animation: reveal automatically when page arrives
			setTimeout(() => {
				heading.classList.add('heading-revealed');
				heading.dataset.headingRevealed = 'true';
			}, 150);
		} else {
			// Scroll animation: reveal when entering viewport
			activeObserver?.observe(heading);
		}
	});

	// Handle responsive resize reflow (debounced)
	if (!resizeHandlerAttached) {
		resizeHandlerAttached = true;
		lastWindowWidth = window.innerWidth;

		let resizeTimer: number;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimer);
			resizeTimer = window.setTimeout(() => {
				const currentWidth = window.innerWidth;
				if (Math.abs(currentWidth - lastWindowWidth) > 60) {
					lastWindowWidth = currentWidth;
					const currentHeadings = Array.from(document.querySelectorAll<HTMLElement>('h1, h2, h3'));
					currentHeadings.forEach((h) => {
						if (h.dataset.headingRevealed !== 'true') {
							delete h.dataset.headingSplit;
							splitHeadingIntoLines(h);
						}
					});
				}
			}, 250);
		});
	}
}
