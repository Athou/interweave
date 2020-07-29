/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      INTERWEAVE_SSR_POLYFILL: () => Document | undefined;
    }
  }
}

export type Node = null | string | React.ReactElement<unknown>;

export type ChildrenNode = string | Node[];

export interface NodeConfig {
  // Only children
  children: string[];
  // Children content type
  content: number;
  // Invalid children
  invalid: string[];
  // Only parent
  parent: string[];
  // Can render self as a child
  self: boolean;
  // HTML tag name
  tagName: string;
  // Self content type
  type: number;
  // Self-closing tag
  void: boolean;
}

export interface ConfigMap {
  [key: string]: Partial<NodeConfig>;
}

export type AttributeValue = string | number | boolean | object;

export interface Attributes {
  [attr: string]: AttributeValue;
}

export type AfterParseCallback<T> = (content: Node[], props: T) => Node[];

export type BeforeParseCallback<T> = (content: string, props: T) => string;

export type TransformCallback = (
  node: HTMLElement,
  children: Node[],
  config: NodeConfig,
) => React.ReactNode;

// MATCHERS

export type MatchCallback<T> = (matches: string[]) => T;

export type MatchResponse<T> = T & {
  index: number;
  length: number;
  match: string;
  valid: boolean;
  void?: boolean;
};

export interface MatcherInterface<T = any> {
  greedy?: boolean;
  inverseName: string;
  propName: string;
  asTag() => string;
  createElement: (children: ChildrenNode, props: T) => Node;
  match: (value: string) => MatchResponse<Partial<T>> | null;
  onBeforeParse?: (content: string, props: T) => string;
  onAfterParse?: (content: Node[], props: T) => Node[];
}

// FILTERS

export type ElementAttributes = React.AllHTMLAttributes<unknown>;

export interface FilterInterface {
  attribute?: <K extends keyof ElementAttributes>(
    name: K,
    value: ElementAttributes[K],
  ) => ElementAttributes[K] | undefined | null;
  node?: (name: string, node: HTMLElement) => HTMLElement | null;
}

export interface FilterMap {
  [key: string]: number;
}

// PARSER

export interface MatcherElementsMap {
  [key: string]: {
    children: string;
    matcher: MatcherInterface<{}>;
    props: object;
  };
}

export interface ParserProps {
  /** Disable filtering and allow all non-banned HTML attributes. */
  allowAttributes?: boolean;
  /** Disable filtering and allow all non-banned/blocked HTML elements to be rendered. */
  allowElements?: boolean;
  /** List of HTML tag names to allow and render. Defaults to the `ALLOWED_TAG_LIST` constant. */
  allowList?: string[];
  /** List of HTML tag names to disallow and not render. Overrides allow list. */
  blockList?: string[];
  /** Disable the conversion of new lines to `<br />` elements. */
  disableLineBreaks?: boolean;
  /** The container element to parse content in. Applies browser semantic rules and overrides `tagName`. */
  containerTagName?: string;
  /** Escape all HTML before parsing. */
  escapeHtml?: boolean;
  /** Strip all HTML while rendering. */
  noHtml?: boolean;
  /** Strip all HTML, except HTML generated by matchers, while rendering. */
  noHtmlExceptMatchers?: boolean;
  /** Transformer ran on each HTML element. Return a new element, null to remove current element, or undefined to do nothing. */
  transform?: TransformCallback | null;
}

// INTERWEAVE

export interface MarkupProps extends ParserProps {
  /** HTML attributes to pass to the wrapping element. */
  attributes?: Attributes;
  /** Content that may contain HTML to safely render. */
  content?: string | null;
  /** Content to render when the `content` prop is empty. */
  emptyContent?: React.ReactNode;
  /** @ignore Pre-parsed content to render. */
  parsedContent?: React.ReactNode;
  /** HTML element to wrap the content. Also accepts 'fragment' (superseded by `noWrap`). */
  tagName?: string;
  /** Don't wrap the content in a new element specified by `tagName`. */
  noWrap?: boolean;
}

export interface InterweaveProps extends MarkupProps {
  /** Support all the props used by matchers. */
  [prop: string]: any;
  /** Disable all filters from running. */
  disableFilters?: boolean;
  /** Disable all matches from running. */
  disableMatchers?: boolean;
  /** List of filters to apply to the content. */
  filters?: FilterInterface[];
  /** List of matchers to apply to the content. */
  matchers?: MatcherInterface<any>[];
  /** Callback fired after parsing ends. Must return an array of React nodes. */
  onAfterParse?: AfterParseCallback<InterweaveProps> | null;
  /** Callback fired beore parsing begins. Must return a string. */
  onBeforeParse?: BeforeParseCallback<InterweaveProps> | null;
}

export interface ElementProps {
  [prop: string]: any;
  attributes?: Attributes;
  children?: React.ReactNode;
  selfClose?: boolean;
  tagName: string;
}
