
import React, { JSX, useEffect } from 'react';
import Image from 'next/image';
import { Interweave, Node as InterweaveNode } from 'interweave';
import type { Article } from '@/types';

// Legacy type for backward compatibility
export type articleType = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
}

// Export the full Article type for new code
export type { Article };

/**
 * Generates a URL-friendly slug from heading text
 * Similar to Wikipedia's anchor generation
 */
function generateHeadingId(text: string): string {
    return text
        .toLowerCase()
        .trim()
        // Replace spaces with hyphens
        .replace(/\s+/g, '-')
        // Remove special characters except hyphens
        .replace(/[^a-z0-9\-]/g, '')
        // Remove consecutive hyphens
        .replace(/-+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-|-$/g, '');
}

export default function Article({ children }: {
    children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="ArticleContainer">
        {children}
    </div>
  );
}

//
// Article Header component
//
export const ArticleHeader = ({ title, subtitle }: { title: string, subtitle: string }): JSX.Element => {
  return (
    <header className='ArticleHeader'>
        <hgroup>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </hgroup>
    </header>
  );
}

// Track heading IDs to handle duplicates (like Wikipedia does)
let headingIdCounts: Record<string, number> = {};

/**
 * Transform function for Interweave to add anchor IDs and links to headings
 */
function transformHeadings(node: HTMLElement, children: InterweaveNode[]): React.ReactNode {
    const tagName = node.tagName.toLowerCase();

    // Only process heading elements
    if (!['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        return undefined; // Let Interweave handle it normally
    }

    // Get the text content for generating the ID
    const textContent = node.textContent || '';
    let headingId = generateHeadingId(textContent);

    // Handle duplicate IDs (append number like Wikipedia)
    if (headingIdCounts[headingId]) {
        headingIdCounts[headingId]++;
        headingId = `${headingId}-${headingIdCounts[headingId]}`;
    } else {
        headingIdCounts[headingId] = 1;
    }

    // Create the heading element with ID and anchor link
    const HeadingTag = tagName as keyof JSX.IntrinsicElements;

    // Filter out null values from children for proper React typing
    const validChildren = children.filter((child): child is Exclude<InterweaveNode, null> => child !== null);

    return (
        <HeadingTag id={headingId} className="heading-with-anchor">
            {validChildren}
            <a
                href={`#${headingId}`}
                className="heading-anchor-link"
                aria-label={`Link to section: ${textContent}`}
                title="Copy link to this section"
            >
                #
            </a>
        </HeadingTag>
    );
}

// todo: expand article body to accept more complex content
export const ArticleBody = ({ articleContent }: { articleContent: string }) => {
    // Reset heading ID counts when component renders (for new article)
    useEffect(() => {
        headingIdCounts = {};
    }, [articleContent]);

    // Reset counts at start of render
    headingIdCounts = {};

    return (
        <article className='ArticleBody'>
            <Interweave
                content={articleContent}
                transform={transformHeadings}
            />
        </article>
    );
}


export const ArticleFigure = ({figureContent, altText} : {figureContent: string, altText: string}) => {
  return (
    <figure className='ArticleFigure'>
        <Image src={figureContent} alt={altText} width={600} height={400} />
    </figure>
  );
}
