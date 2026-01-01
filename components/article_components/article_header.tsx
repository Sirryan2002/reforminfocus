
import { JSX } from "react";
import '@styles/article_header.css';

export default function ArticleHeader(title: string, subtitle: string): JSX.Element {
  return (
    <header>
        <hgroup>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </hgroup>
    </header>
  );
}