import { Directive, ElementRef, HostBinding, Input, OnChanges, SecurityContext, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { Content } from 'hast';
import { TransformerService } from '../services/transformer';

interface ContentRecord {
  node: Content;
  html: string | null;
  element: Element | ChildNode | null | undefined;
  children: ContentRecord[];
}


@Directive({
  standalone: true,
  selector: 'div[markdown]',
})
export class MarkdownDirective implements OnChanges {

  private readonly el = inject(ElementRef).nativeElement as HTMLDivElement;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly transformer = inject(TransformerService);

  @HostBinding() private readonly class = proseClasses;

  @Input() markdown: string | null | undefined;

  @Input() debug = false;
  @Input() dynamic = false;

  private records: ContentRecord[] = [];

  async ngOnChanges(changes: SimpleChanges) {
    if ('markdown' in changes) {
      const curr = this.markdown ?? '';

      const transformed = await this.transformer.md.html.transform(curr);

      const newRecords = await Promise.all(transformed.children.map(n => this.getRecord(n)));

      if (this.dynamic) {
        processTrees(this.records, newRecords);
        removeNodesRecursively(this.records);
      }
      else {
        this.el.replaceChildren('');
      }

      this.renderHTML(newRecords, this.el);
      this.records = newRecords;
    }
  }

  private renderHTML(records: ContentRecord[], parent: Element) {
    let anchor: Element | ChildNode | null = null;

    for (const r of records) {
      if (r.element?.isConnected) {
        anchor = r.element as Element;
        if (this.debug) {
          getDebuggable(r.element, parent)
            .classList.remove('bg-green-300/30');
        }
      }
      else {
        const html = this.sanitizer.sanitize(SecurityContext.HTML, r.html) ?? '';
        if (anchor) {
          if (anchor instanceof Element) {
            anchor.insertAdjacentHTML('afterend', html);
            r.element = anchor.nextSibling;
          }
          else {
            const d = document.createElement('div');
            anchor.after(d);
            d.insertAdjacentHTML('beforebegin', html);
            d.remove();
            r.element = anchor.nextSibling;
          }
        }
        else {
          parent.insertAdjacentHTML('afterbegin', html);
          r.element = parent.firstChild;
        }
        anchor = r.element;

        if (this.debug && r.element) {
          getDebuggable(r.element, parent)
            .classList.add('bg-green-300/30');
        }
      }

      if (r.children.length > 0) {
        if (!r.element) throw new Error('node has children but no element');
        this.renderHTML(r.children, r.element as Element);
      }
    }

    while (anchor?.nextSibling) {
      anchor.nextSibling.remove();
    }
  }

  private async getRecord(node: Content) {

    const result: ContentRecord = {
      node,
      html: await this.stringifyNode(node),
      element: null,
      children: 'children' in node ?
        await Promise.all(node.children.map(n => this.getRecord(n))) :
        []
    };
    return result;
  }

  /** Takes a single node, constructs a temporary root to place the node in, 
   * then returns the stringified result.
   */
  private stringifyNode(node: Content) {
    node = Object.assign({}, node, { children: [] });

    return this.transformer.md.html.stringify({ type: 'root', children: [node] });
  }
}

interface ScanResult {
  same: boolean;
}


/** Takes two tree and compares them. 
 * If common nodes are found, it copies the references of the html elements to the new tree
 * 
 * @returns `same` whether the trees were the same. text nodes are always considered the same
 * @returns `toRemove` the parts of the old tree which can be removed
 * @default true */
function processTrees(
  prev: ContentRecord[],
  curr: ContentRecord[],
) {

  scanForward(prev, curr);
  scanBackward(prev, curr);
}

function scanForward(prev: ContentRecord[], curr: ContentRecord[]): ScanResult {
  let same = true;

  let i: number;

  for (i = 0; i < curr.length; i++) {
    const p = prev[0];
    const c = curr[i];

    if (p && c && p.html === c.html) {

      const subTree = p.children.length && c.children.length ?
        // spread the children array so that it is not mutated
        scanForward(p.children, c.children) :
        null;

      same = !subTree || subTree.same;

      // do not assign elements for subtree equality
      // during forward scan. wait for the backward scan to do it
      if (same)
        c.element = p.element;
    }
    else
      same = false;

    if (same)
      prev.shift();
    else
      break;
  }

  return { same };
}

function scanBackward(prev: ContentRecord[], curr: ContentRecord[]): ScanResult {
  let same = true;

  let i: number;

  for (i = 1; i <= curr.length; i++) {
    const p = prev[prev.length - 1];
    const c = curr[curr.length - i];

    if (p && c && p.html === c.html) {

      const subTree = p.children.length && c.children.length ?
        // spread the children array so that it is not mutated
        scanBackward(p.children, c.children) :
        null;

      same = !subTree || subTree.same;

      // do not assign elements for subtree equality
      // during forward scan. wait for the backward scan to do it
      if (same || subTree)
        c.element = p.element;

    }
    else
      same = false;

    if (same)
      prev.pop();
    else
      break;
  }

  return { same };
}

function removeNodesRecursively(records: ContentRecord[]) {
  for (const record of records) {
    if (record.children) {
      removeNodesRecursively(record.children);
      if (!record.element?.childNodes.length)
        record.element?.remove();
    }
    else {
      record.element?.remove();
    }
  }
}

function getDebuggable(el: Element | ChildNode, parent: Element) {
  if (el instanceof Element)
    return el;
  else
    return el.parentElement ?? parent;
}

export const proseClasses = [
  "max-w-none",
  "prose",
  "prose-img:object-cover",
  "prose-img:object-center",
  "prose-img:rounded",
  "prose-img:mx-auto",
  "prose-figcaption:italic",
  "prose-figcaption:text-slate-500",
  "prose-figcaption:text-center"
];
