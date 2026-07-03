import type { PageBlock, PageBlockCaption, PageBlockListItem, PageBlockOrderedListItem, PageBlockTableRow, RichTextComponent } from "@mtkruto/mtkruto";

type RichTextComponentInput = RichTextComponent | RichTextComponent[] | string;
type PageBlockCaptionInput = PageBlockCaption | RichTextComponentInput | { text?: RichTextComponentInput; credit?: RichTextComponentInput };
type RichTextComponentOf<T extends RichTextComponent["type"]> = Extract<RichTextComponent, { type: T }>;
type PageBlockOf<T extends PageBlock["type"]> = Extract<PageBlock, { type: T }>;

function richTextComponent(input: RichTextComponentInput): RichTextComponent {
  if (typeof input === "string") {
    return { type: "plain", text: input };
  } else if (Array.isArray(input)) {
    return { type: "concatenate", components: input };
  } else {
    return input;
  }
}

function pageBlockCaption(input: PageBlockCaptionInput = ""): PageBlockCaption {
  if (typeof input === "string" || Array.isArray(input) || "type" in input) {
    return { text: richTextComponent(input), credit: richTextComponent("") };
  }

  return {
    text: richTextComponent(input.text ?? ""),
    credit: richTextComponent(input.credit ?? ""),
  };
}

function isRichTextComponent(value: PageBlock | RichTextComponent): value is RichTextComponent {
  switch (value.type) {
    case "empty":
    case "plain":
    case "bold":
    case "italic":
    case "underline":
    case "strikethrough":
    case "fixed":
    case "link":
    case "emailLink":
    case "concatenate":
    case "subscript":
    case "superscript":
    case "marked":
    case "phoneNumberLink":
    case "customEmoji":
    case "spoiler":
    case "mention":
    case "hashtag":
    case "botCommand":
    case "cashtag":
    case "url":
    case "email":
    case "phoneNumber":
    case "textMention":
    case "dateTime":
      return true;
    case "photo":
      return "width" in value;
    case "anchor":
      return "text" in value;
    default:
      return false;
  }
}

/** A chainable builder for arrays of rich text components. */
export class RichTextComponentBuilder extends Array<RichTextComponent> {
  constructor(...components: RichTextComponent[]) {
    super(...components);
  }

  /** Adds a rich text component to the builder. */
  add(component: RichTextComponent): this {
    this.push(component);
    return this;
  }

  /** Adds rich text components to the builder. */
  addMany(components: Iterable<RichTextComponent>): this {
    for (const component of components) {
      this.push(component);
    }
    return this;
  }

  /** An empty rich text component. */
  empty(): this {
    return this.add({ type: "empty" });
  }

  /** A plain rich text component. */
  plain(text: string): this {
    return this.add({ type: "plain", text });
  }

  /** A rich text component that has its child bold. */
  bold(text: RichTextComponentInput): this {
    return this.add({ type: "bold", text: richTextComponent(text) });
  }

  /** A rich text component that has its child italic. */
  italic(text: RichTextComponentInput): this {
    return this.add({ type: "italic", text: richTextComponent(text) });
  }

  /** A rich text component that has its child underlined. */
  underline(text: RichTextComponentInput): this {
    return this.add({ type: "underline", text: richTextComponent(text) });
  }

  /** A rich text component that has its child struck through. */
  strikethrough(text: RichTextComponentInput): this {
    return this.add({ type: "strikethrough", text: richTextComponent(text) });
  }

  /** A fixed rich text component. */
  fixed(text: RichTextComponentInput): this {
    return this.add({ type: "fixed", text: richTextComponent(text) });
  }

  /** A rich text component that opens a URL when clicked. */
  link(text: RichTextComponentInput, url: string, linkPreviewId: string): this {
    return this.add({ type: "link", text: richTextComponent(text), url, linkPreviewId });
  }

  /** A rich text component that links to an email address. */
  email(text: RichTextComponentInput, email: string): this {
    return this.add({ type: "emailLink", text: richTextComponent(text), email });
  }

  /** A rich text component for concatenating other rich text components. */
  concatenate(components: RichTextComponent[]): this {
    return this.add({ type: "concatenate", components });
  }

  /** A rich text component that has its child in the subscript. */
  subscript(text: RichTextComponentInput): this {
    return this.add({ type: "subscript", text: richTextComponent(text) });
  }

  /** A rich text component that has its child in the superscript. */
  superscript(text: RichTextComponentInput): this {
    return this.add({ type: "superscript", text: richTextComponent(text) });
  }

  /** A rich text component that has its child marked. */
  marked(text: RichTextComponentInput): this {
    return this.add({ type: "marked", text: richTextComponent(text) });
  }

  /** A rich text component that links to a phone number. */
  phoneNumber(text: RichTextComponentInput, phoneNumber: string): this {
    return this.add({ type: "phoneNumberLink", text: richTextComponent(text), phoneNumber });
  }

  /** A rich text component that displays an inline photo. */
  photo(fileId: string, width: number, height: number): this {
    return this.add({ type: "photo", fileId, width, height });
  }

  /** An anchor rich text component. */
  anchor(text: RichTextComponentInput, name: string): this {
    return this.add({ type: "anchor", text: richTextComponent(text), name });
  }

  /** A rich text component that displays a mathematical expression. */
  math(code: string): this {
    return this.add({ type: "math", code });
  }

  /** A rich text component that displays a custom emoji. */
  customEmoji(customEmojiId: string, alt: string): this {
    return this.add({ type: "customEmoji", customEmojiId, alt });
  }

  /** A rich text component that displays a spoiler. */
  spoiler(text: RichTextComponentInput): this {
    return this.add({ type: "spoiler", text: richTextComponent(text) });
  }

  /** A rich text component that mentions a username. */
  mention(text: RichTextComponentInput): this {
    return this.add({ type: "mention", text: richTextComponent(text) });
  }

  /** A hashtag rich text component. */
  hashtag(text: RichTextComponentInput): this {
    return this.add({ type: "hashtag", text: richTextComponent(text) });
  }

  /** A bot command rich text component. */
  botCommand(text: RichTextComponentInput): this {
    return this.add({ type: "botCommand", text: richTextComponent(text) });
  }

  /** A cashtag rich text component. */
  cashtag(text: RichTextComponentInput): this {
    return this.add({ type: "cashtag", text: richTextComponent(text) });
  }

  /** A rich text component that opens the URL represented by its child when clicked. */
  url(text: RichTextComponentInput): this {
    return this.add({ type: "url", text: richTextComponent(text) });
  }

  /** A rich text component that mentions a user with a custom text. */
  textMention(text: RichTextComponentInput, userId: number): this {
    return this.add({ type: "textMention", text: richTextComponent(text), userId });
  }

  /** A datetime text component. */
  dateTime(date: number, text: RichTextComponentInput, options: Partial<Omit<RichTextComponentOf<"dateTime">, "type" | "date" | "text">> = {}): this {
    return this.add({ type: "dateTime", date, text: richTextComponent(text), format: options.format });
  }

  /** Returns the builder's contents as a single rich text component. */
  toComponent(): RichTextComponent {
    if (!this.length) {
      return { type: "empty" };
    } else if (this.length === 1) {
      return this[0];
    } else {
      return { type: "concatenate", components: Array.from(this) };
    }
  }

  /** Returns the builder's contents as an array. */
  toArray(): RichTextComponent[] {
    return Array.from(this);
  }
}

/** A chainable builder for arrays of page blocks. */
export class PageBlockBuilder extends Array<PageBlock> {
  constructor(...blocks: PageBlock[]) {
    super(...blocks);
  }

  /** Adds a page block to the builder. */
  add(block: PageBlock): this {
    this.push(block);
    return this;
  }

  /** Adds page blocks to the builder. */
  addMany(blocks: Iterable<PageBlock>): this {
    for (const block of blocks) {
      this.push(block);
    }
    return this;
  }

  /** A paragraph page block. */
  paragraph(text: RichTextComponentInput): this {
    return this.add({ type: "paragraph", text: richTextComponent(text) });
  }

  /** A pre-formatted page block. */
  pre(text: RichTextComponentInput, language?: string): this {
    return this.add({ type: "pre", text: richTextComponent(text), language });
  }

  /** A footer page block. */
  footer(text: RichTextComponentInput): this {
    return this.add({ type: "footer", text: richTextComponent(text) });
  }

  /** A divider page block. */
  divider(): this {
    return this.add({ type: "divider" });
  }

  /** An anchor page block. */
  anchor(name: string): this {
    return this.add({ type: "anchor", name });
  }

  /** A list page block. */
  list(items: PageBlockListItem[]): this {
    return this.add({ type: "list", items });
  }

  /** A block quote page block. */
  blockQuote(text: RichTextComponentInput, caption: RichTextComponentInput = ""): this {
    return this.add({ type: "blockQuote", text: richTextComponent(text), caption: richTextComponent(caption) });
  }

  /** A pull quote page block. */
  pullQuote(text: RichTextComponentInput, caption: RichTextComponentInput = ""): this {
    return this.add({ type: "pullQuote", text: richTextComponent(text), caption: richTextComponent(caption) });
  }

  /** A photo page block. */
  photo(fileId: string, caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"photo">, "type" | "fileId" | "caption">> = {}): this {
    return this.add({ type: "photo", fileId, caption: pageBlockCaption(caption), isSpoiler: options.isSpoiler ?? false, url: options.url, linkPreviewId: options.linkPreviewId });
  }

  /** A video page block. */
  video(fileId: string, caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"video">, "type" | "fileId" | "caption">> = {}): this {
    return this.add({ type: "video", fileId, caption: pageBlockCaption(caption), isSpoiler: options.isSpoiler ?? false, isLoop: options.isLoop ?? false, isAutoplay: options.isAutoplay ?? false, linkPreviewId: options.linkPreviewId });
  }

  /** An animation page block. */
  animation(fileId: string, caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"animation">, "type" | "fileId" | "caption">> = {}): this {
    return this.add({ type: "animation", fileId, caption: pageBlockCaption(caption), isSpoiler: options.isSpoiler ?? false, isLoop: options.isLoop ?? false, isAutoplay: options.isAutoplay ?? false, linkPreviewId: options.linkPreviewId });
  }

  /** A cover page block. */
  cover(cover: PageBlock): this {
    return this.add({ type: "cover", cover });
  }

  /** An embed page block. */
  embed(options: Partial<Omit<PageBlockOf<"embed">, "type" | "caption">> & { caption?: PageBlockCaptionInput } = {}): this {
    return this.add({ type: "embed", caption: pageBlockCaption(options.caption), isFullWidth: options.isFullWidth ?? false, isScrollingAllowed: options.isScrollingAllowed ?? false, url: options.url, html: options.html, posterPhotoId: options.posterPhotoId, width: options.width, height: options.height });
  }

  /** An embed post page block. */
  embedPost(options: Omit<PageBlockOf<"embedPost">, "type" | "caption"> & { caption?: PageBlockCaptionInput }): this {
    return this.add({ ...options, type: "embedPost", caption: pageBlockCaption(options.caption) });
  }

  /** A collage page block. */
  collage(items: PageBlock[], caption?: PageBlockCaptionInput): this {
    return this.add({ type: "collage", items, caption: pageBlockCaption(caption) });
  }

  /** A slideshow page block. */
  slideshow(items: PageBlock[], caption?: PageBlockCaptionInput): this {
    return this.add({ type: "slideshow", items, caption: pageBlockCaption(caption) });
  }

  /** A channel page block. */
  channel(chat: PageBlockOf<"channel">["chat"]): this {
    return this.add({ type: "channel", chat });
  }

  /** An audio page block. */
  audio(fileId: string, caption?: PageBlockCaptionInput): this {
    return this.add({ type: "audio", fileId, caption: pageBlockCaption(caption) });
  }

  /** A voice page block. */
  voice(fileId: string, caption?: PageBlockCaptionInput): this {
    return this.add({ type: "voice", fileId, caption: pageBlockCaption(caption) });
  }

  /** A kicker page block. */
  kicker(text: RichTextComponentInput): this {
    return this.add({ type: "kicker", text: richTextComponent(text) });
  }

  /** A table page block. */
  table(title: RichTextComponentInput, rows: PageBlockTableRow[], options: Partial<Omit<PageBlockOf<"table">, "type" | "title" | "rows">> = {}): this {
    return this.add({ type: "table", title: richTextComponent(title), rows, isBordered: options.isBordered ?? false, isStriped: options.isStriped ?? false });
  }

  /** An order list page block. */
  orderedList(items: PageBlockOrderedListItem[], options: Partial<Omit<PageBlockOf<"orderedList">, "type" | "items">> = {}): this {
    return this.add({ type: "orderedList", items, isReversed: options.isReversed ?? false, start: options.start, itemsType: options.itemsType });
  }

  /** A details page block. */
  details(title: RichTextComponentInput, blocks: PageBlock[], options: Partial<Omit<PageBlockOf<"details">, "type" | "title" | "blocks">> = {}): this {
    return this.add({ type: "details", title: richTextComponent(title), blocks, isOpen: options.isOpen ?? false });
  }

  /** A map page block. */
  mapBlock(location: PageBlockOf<"map">["location"], caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"map">, "type" | "location" | "caption">> = {}): this {
    return this.add({ type: "map", location, caption: pageBlockCaption(caption), zoom: options.zoom ?? 0, width: options.width ?? 0, height: options.height ?? 0 });
  }

  /** A heading 1 page block. */
  heading1(text: RichTextComponentInput): this {
    return this.add({ type: "heading1", text: richTextComponent(text) });
  }

  /** A heading 2 page block. */
  heading2(text: RichTextComponentInput): this {
    return this.add({ type: "heading2", text: richTextComponent(text) });
  }

  /** A heading 3 page block. */
  heading3(text: RichTextComponentInput): this {
    return this.add({ type: "heading3", text: richTextComponent(text) });
  }

  /** A heading 4 page block. */
  heading4(text: RichTextComponentInput): this {
    return this.add({ type: "heading4", text: richTextComponent(text) });
  }

  /** A heading 5 page block. */
  heading5(text: RichTextComponentInput): this {
    return this.add({ type: "heading5", text: richTextComponent(text) });
  }

  /** A heading 6 page block. */
  heading6(text: RichTextComponentInput): this {
    return this.add({ type: "heading6", text: richTextComponent(text) });
  }

  /** A math page block. */
  math(code: string): this {
    return this.add({ type: "math", code });
  }

  /** A thinking block. */
  thinking(text: RichTextComponentInput): this {
    return this.add({ type: "thinking", text: richTextComponent(text) });
  }

  /** A block quote blocks block. */
  blockQuoteBlocks(blocks: PageBlock[], caption: RichTextComponentInput = ""): this {
    return this.add({ type: "blockQuoteBlocks", blocks, caption: richTextComponent(caption) });
  }

  /** Returns the builder's contents as an array. */
  toArray(): PageBlock[] {
    return Array.from(this);
  }
}

function pageBlockBuilder(): PageBlockBuilder {
  return new PageBlockBuilder();
}

function richTextComponentBuilder(): RichTextComponentBuilder {
  return new RichTextComponentBuilder();
}

/** Adds a page block to a new builder. */
export function add(block: PageBlock): PageBlockBuilder;
/** Adds a rich text component to a new builder. */
export function add(component: RichTextComponent): RichTextComponentBuilder;
export function add(value: PageBlock | RichTextComponent): PageBlockBuilder | RichTextComponentBuilder {
  if (isRichTextComponent(value)) {
    return richTextComponentBuilder().add(value);
  } else {
    return pageBlockBuilder().add(value);
  }
}

/** Adds page blocks to a new builder. */
export function addMany(blocks: Iterable<PageBlock>): PageBlockBuilder;
/** Adds rich text components to a new builder. */
export function addMany(components: Iterable<RichTextComponent>): RichTextComponentBuilder;
export function addMany(values: Iterable<PageBlock | RichTextComponent>): PageBlockBuilder | RichTextComponentBuilder {
  const values_ = Array.from(values);
  if (values_.length && isRichTextComponent(values_[0])) {
    return richTextComponentBuilder().addMany(values_ as RichTextComponent[]);
  } else {
    return pageBlockBuilder().addMany(values_ as PageBlock[]);
  }
}

/** A paragraph page block. */
export function paragraph(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().paragraph(text);
}

/** A pre-formatted page block. */
export function pre(text: RichTextComponentInput, language?: string): PageBlockBuilder {
  return pageBlockBuilder().pre(text, language);
}

/** A footer page block. */
export function footer(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().footer(text);
}

/** A divider page block. */
export function divider(): PageBlockBuilder {
  return pageBlockBuilder().divider();
}

/** An anchor page block. */
export function anchor(name: string): PageBlockBuilder;
/** An anchor rich text component. */
export function anchor(text: RichTextComponentInput, name: string): RichTextComponentBuilder;
export function anchor(textOrName: RichTextComponentInput | string, name?: string): PageBlockBuilder | RichTextComponentBuilder {
  if (name === undefined) {
    return pageBlockBuilder().anchor(textOrName as string);
  } else {
    return richTextComponentBuilder().anchor(textOrName, name);
  }
}

/** A list page block. */
export function list(items: PageBlockListItem[]): PageBlockBuilder {
  return pageBlockBuilder().list(items);
}

/** A block quote page block. */
export function blockQuote(text: RichTextComponentInput, caption: RichTextComponentInput = ""): PageBlockBuilder {
  return pageBlockBuilder().blockQuote(text, caption);
}

/** A pull quote page block. */
export function pullQuote(text: RichTextComponentInput, caption: RichTextComponentInput = ""): PageBlockBuilder {
  return pageBlockBuilder().pullQuote(text, caption);
}

/** A rich text component that displays an inline photo. */
export function photo(fileId: string, width: number, height: number): RichTextComponentBuilder;
/** A photo page block. */
export function photo(fileId: string, caption?: PageBlockCaptionInput, options?: Partial<Omit<PageBlockOf<"photo">, "type" | "fileId" | "caption">>): PageBlockBuilder;
export function photo(fileId: string, captionOrWidth?: PageBlockCaptionInput | number, optionsOrHeight?: Partial<Omit<PageBlockOf<"photo">, "type" | "fileId" | "caption">> | number): PageBlockBuilder | RichTextComponentBuilder {
  if (typeof captionOrWidth === "number" && typeof optionsOrHeight === "number") {
    return richTextComponentBuilder().photo(fileId, captionOrWidth, optionsOrHeight);
  } else {
    return pageBlockBuilder().photo(fileId, captionOrWidth as PageBlockCaptionInput | undefined, optionsOrHeight as Partial<Omit<PageBlockOf<"photo">, "type" | "fileId" | "caption">> | undefined);
  }
}

/** A video page block. */
export function video(fileId: string, caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"video">, "type" | "fileId" | "caption">> = {}): PageBlockBuilder {
  return pageBlockBuilder().video(fileId, caption, options);
}

/** An animation page block. */
export function animation(fileId: string, caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"animation">, "type" | "fileId" | "caption">> = {}): PageBlockBuilder {
  return pageBlockBuilder().animation(fileId, caption, options);
}

/** A cover page block. */
export function cover(cover: PageBlock): PageBlockBuilder {
  return pageBlockBuilder().cover(cover);
}

/** An embed page block. */
export function embed(options: Partial<Omit<PageBlockOf<"embed">, "type" | "caption">> & { caption?: PageBlockCaptionInput } = {}): PageBlockBuilder {
  return pageBlockBuilder().embed(options);
}

/** An embed post page block. */
export function embedPost(options: Omit<PageBlockOf<"embedPost">, "type" | "caption"> & { caption?: PageBlockCaptionInput }): PageBlockBuilder {
  return pageBlockBuilder().embedPost(options);
}

/** A collage page block. */
export function collage(items: PageBlock[], caption?: PageBlockCaptionInput): PageBlockBuilder {
  return pageBlockBuilder().collage(items, caption);
}

/** A slideshow page block. */
export function slideshow(items: PageBlock[], caption?: PageBlockCaptionInput): PageBlockBuilder {
  return pageBlockBuilder().slideshow(items, caption);
}

/** A channel page block. */
export function channel(chat: PageBlockOf<"channel">["chat"]): PageBlockBuilder {
  return pageBlockBuilder().channel(chat);
}

/** An audio page block. */
export function audio(fileId: string, caption?: PageBlockCaptionInput): PageBlockBuilder {
  return pageBlockBuilder().audio(fileId, caption);
}

/** A voice page block. */
export function voice(fileId: string, caption?: PageBlockCaptionInput): PageBlockBuilder {
  return pageBlockBuilder().voice(fileId, caption);
}

/** A kicker page block. */
export function kicker(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().kicker(text);
}

/** A table page block. */
export function table(title: RichTextComponentInput, rows: PageBlockTableRow[], options: Partial<Omit<PageBlockOf<"table">, "type" | "title" | "rows">> = {}): PageBlockBuilder {
  return pageBlockBuilder().table(title, rows, options);
}

/** An order list page block. */
export function orderedList(items: PageBlockOrderedListItem[], options: Partial<Omit<PageBlockOf<"orderedList">, "type" | "items">> = {}): PageBlockBuilder {
  return pageBlockBuilder().orderedList(items, options);
}

/** A details page block. */
export function details(title: RichTextComponentInput, blocks: PageBlock[], options: Partial<Omit<PageBlockOf<"details">, "type" | "title" | "blocks">> = {}): PageBlockBuilder {
  return pageBlockBuilder().details(title, blocks, options);
}

/** A map page block. */
export function mapBlock(location: PageBlockOf<"map">["location"], caption?: PageBlockCaptionInput, options: Partial<Omit<PageBlockOf<"map">, "type" | "location" | "caption">> = {}): PageBlockBuilder {
  return pageBlockBuilder().mapBlock(location, caption, options);
}

/** A heading 1 page block. */
export function heading1(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().heading1(text);
}

/** A heading 2 page block. */
export function heading2(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().heading2(text);
}

/** A heading 3 page block. */
export function heading3(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().heading3(text);
}

/** A heading 4 page block. */
export function heading4(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().heading4(text);
}

/** A heading 5 page block. */
export function heading5(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().heading5(text);
}

/** A heading 6 page block. */
export function heading6(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().heading6(text);
}

/** A math page block. */
export function math(code: string): PageBlockBuilder {
  return pageBlockBuilder().math(code);
}

/** A thinking block. */
export function thinking(text: RichTextComponentInput): PageBlockBuilder {
  return pageBlockBuilder().thinking(text);
}

/** A block quote blocks block. */
export function blockQuoteBlocks(blocks: PageBlock[], caption: RichTextComponentInput = ""): PageBlockBuilder {
  return pageBlockBuilder().blockQuoteBlocks(blocks, caption);
}

/** An empty rich text component. */
export function empty(): RichTextComponentBuilder {
  return richTextComponentBuilder().empty();
}

/** A plain rich text component. */
export function plain(text: string): RichTextComponentBuilder {
  return richTextComponentBuilder().plain(text);
}

/** A rich text component that has its child bold. */
export function bold(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().bold(text);
}

/** A rich text component that has its child italic. */
export function italic(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().italic(text);
}

/** A rich text component that has its child underlined. */
export function underline(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().underline(text);
}

/** A rich text component that has its child struck through. */
export function strikethrough(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().strikethrough(text);
}

/** A fixed rich text component. */
export function fixed(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().fixed(text);
}

/** A rich text component that opens a URL when clicked. */
export function link(text: RichTextComponentInput, url: string, linkPreviewId: string): RichTextComponentBuilder {
  return richTextComponentBuilder().link(text, url, linkPreviewId);
}

/** A rich text component that links to an email address. */
export function email(text: RichTextComponentInput, email: string): RichTextComponentBuilder {
  return richTextComponentBuilder().email(text, email);
}

/** A rich text component for concatenating other rich text components. */
export function concatenate(components: RichTextComponent[]): RichTextComponentBuilder {
  return richTextComponentBuilder().concatenate(components);
}

/** A rich text component that has its child in the subscript. */
export function subscript(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().subscript(text);
}

/** A rich text component that has its child in the superscript. */
export function superscript(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().superscript(text);
}

/** A rich text component that has its child marked. */
export function marked(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().marked(text);
}

/** A rich text component that links to a phone number. */
export function phoneNumber(text: RichTextComponentInput, phoneNumber: string): RichTextComponentBuilder {
  return richTextComponentBuilder().phoneNumber(text, phoneNumber);
}

/** An anchor rich text component. */
export function textAnchor(text: RichTextComponentInput, name: string): RichTextComponentBuilder {
  return richTextComponentBuilder().anchor(text, name);
}

/** A rich text component that displays a mathematical expression. */
export function textMath(code: string): RichTextComponentBuilder {
  return richTextComponentBuilder().math(code);
}

/** A rich text component that displays a mathematical expression. */
export function richMath(code: string): RichTextComponentBuilder {
  return richTextComponentBuilder().math(code);
}

/** A rich text component that displays a custom emoji. */
export function customEmoji(customEmojiId: string, alt: string): RichTextComponentBuilder {
  return richTextComponentBuilder().customEmoji(customEmojiId, alt);
}

/** A rich text component that displays a spoiler. */
export function spoiler(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().spoiler(text);
}

/** A rich text component that mentions a username. */
export function mention(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().mention(text);
}

/** A hashtag rich text component. */
export function hashtag(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().hashtag(text);
}

/** A bot command rich text component. */
export function botCommand(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().botCommand(text);
}

/** A cashtag rich text component. */
export function cashtag(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().cashtag(text);
}

/** A rich text component that opens the URL represented by its child when clicked. */
export function url(text: RichTextComponentInput): RichTextComponentBuilder {
  return richTextComponentBuilder().url(text);
}

/** A rich text component that mentions a user with a custom text. */
export function textMention(text: RichTextComponentInput, userId: number): RichTextComponentBuilder {
  return richTextComponentBuilder().textMention(text, userId);
}

/** A datetime text component. */
export function dateTime(date: number, text: RichTextComponentInput, options: Partial<Omit<RichTextComponentOf<"dateTime">, "type" | "date" | "text">> = {}): RichTextComponentBuilder {
  return richTextComponentBuilder().dateTime(date, text, options);
}
