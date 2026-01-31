
import React, { JSX } from 'react';
import Image from 'next/image';
import { Interweave } from 'interweave';
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

// todo: expand article body to accept more complex content
export const ArticleBody = ({ articleContent }: { articleContent: string }) => {
  return (
    <article className='ArticleBody'>
      <Interweave content={articleContent} />
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