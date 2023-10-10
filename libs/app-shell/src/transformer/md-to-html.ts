import rehypeHighlight from 'rehype-highlight';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkDirective from 'remark-directive';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { htmlImgToFigure } from './html-img-to-figure';
import { mdDirectivesToHtml } from './md-directives-to-html';


const allowedSchema = structuredClone(defaultSchema);
{
  allowedSchema.attributes ||= {};
  allowedSchema.attributes['*'].push('className');
}

export const mdToHtml = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(mdDirectivesToHtml)
  .use(remarkRehype)
  .use(htmlImgToFigure)
  .use(rehypeHighlight)
  .use(rehypeSanitize, allowedSchema)
  .use(rehypeStringify)
  .freeze();
