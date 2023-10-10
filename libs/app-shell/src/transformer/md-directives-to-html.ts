import { h } from 'hastscript';
import type { Root } from 'mdast';
import type { } from 'mdast-util-directive';
import { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const mdDirectivesToHtml: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes || {});

        data['hName'] = hast.tagName;
        data['hProperties'] = hast.properties;
      }
    });
  };
};
