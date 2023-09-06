import type { Root } from 'hast';
import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';

export const htmlImgToFigure: Plugin<[], Root> = () => {
  return (tree) => {
    visit(
      tree,
      node => {
        if (node.type === 'element' && node.tagName === 'p') {
          if (node.children.length === 1) {
            const child = node.children[0];
            if (child.type === 'element' && child.tagName === 'img') {
              node.tagName = 'figure';
              if (child.properties) {
                const alt = child.properties['alt'] ?? null;
                delete child.properties['alt'];

                if (alt) {
                  const caption = alt.toString();
                  node.children.push({
                    type: 'element',
                    tagName: 'figcaption',
                    children: [{ type: 'text', value: caption }]
                  });
                }
              }
            }
          }
        }
      });
  };
};
