
import React, { JSX } from 'react';
import Image from 'next/image'
import '../styles/article.css';



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
      <p>{articleContent}</p>
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