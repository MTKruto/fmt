/**
 * MTKruto - Cross-runtime JavaScript library for building Telegram clients
 * Copyright (C) 2023-2026 Roj <https://roj.im/>
 *
 * This file is part of MTKruto.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { MessageEntity } from "@mtkruto/mtkruto";

type MessageEntityOf<T extends MessageEntity["type"]> = Extract<MessageEntity, { type: T }>;
export type MessageEntityText = string | MessageEntityBuilder | MessageEntityText[];

function getMessageEntityText(text: MessageEntityText): string {
  if (typeof text === "string") {
    return text;
  } else if (text instanceof MessageEntityBuilder) {
    return text.toString();
  } else {
    return text.map(getMessageEntityText).join("");
  }
}

function getEntityText(entity: MessageEntity): string {
  const text = (entity as { text?: unknown }).text;
  return typeof text === "string" ? text : "";
}

function messageEntity<T extends MessageEntity>(text: MessageEntityText, offset: number, entity: Omit<T, "offset" | "length">): T {
  const text_ = getMessageEntityText(text);
  return { ...entity, offset, length: text_.length, text: text_ } as unknown as T;
}

/** A chainable builder for arrays of message entities. */
export class MessageEntityBuilder extends Array<MessageEntity> {
  #text = "";

  constructor(...entities: MessageEntity[]) {
    super(...entities);
    this.#text = entities.map(getEntityText).join("");
  }

  #add(entity: MessageEntity): this {
    this.push(entity);
    this.#text += getEntityText(entity);
    return this;
  }

  /** The raw text represented by the entities in this builder. */
  get rawText(): string {
    return this.#text;
  }

  /** Adds plain text. */
  text(text: string): this {
    this.#text += text;
    return this;
  }

  /** A bold message entity. */
  bold(text: MessageEntityText): this {
    return this.#add(messageEntity<MessageEntityOf<"bold">>(text, this.#text.length, { type: "bold" }));
  }

  /** An italic message entity. */
  italic(text: MessageEntityText): this {
    return this.#add(messageEntity<MessageEntityOf<"italic">>(text, this.#text.length, { type: "italic" }));
  }

  /** A preformatted message entity. */
  pre(text: MessageEntityText, language = ""): this {
    return this.#add(messageEntity<MessageEntityOf<"pre">>(text, this.#text.length, { type: "pre", language }));
  }

  /** A code message entity. */
  code(text: MessageEntityText): this {
    return this.#add(messageEntity<MessageEntityOf<"code">>(text, this.#text.length, { type: "code" }));
  }

  /** A text link message entity. */
  link(text: MessageEntityText, url: string): this {
    return this.#add(messageEntity<MessageEntityOf<"textLink">>(text, this.#text.length, { type: "textLink", url }));
  }

  /** A text mention message entity. */
  mention(text: MessageEntityText, userId: number): this {
    return this.#add(messageEntity<MessageEntityOf<"textMention">>(text, this.#text.length, { type: "textMention", userId }));
  }

  /** An underline message entity. */
  underline(text: MessageEntityText): this {
    return this.#add(messageEntity<MessageEntityOf<"underline">>(text, this.#text.length, { type: "underline" }));
  }

  /** A strikethrough message entity. */
  strikethrough(text: MessageEntityText): this {
    return this.#add(messageEntity<MessageEntityOf<"strikethrough">>(text, this.#text.length, { type: "strikethrough" }));
  }

  /** A blockquote message entity. */
  blockquote(text: MessageEntityText, options: Partial<Omit<MessageEntityOf<"blockquote">, "type" | "offset" | "length">> = {}): this {
    return this.#add(messageEntity<MessageEntityOf<"blockquote">>(text, this.#text.length, { type: "blockquote", collapsible: options.collapsible }));
  }

  /** A spoiler message entity. */
  spoiler(text: MessageEntityText): this {
    return this.#add(messageEntity<MessageEntityOf<"spoiler">>(text, this.#text.length, { type: "spoiler" }));
  }

  /** A custom emoji message entity. */
  customEmoji(text: MessageEntityText, customEmojiId: string): this {
    return this.#add(messageEntity<MessageEntityOf<"customEmoji">>(text, this.#text.length, { type: "customEmoji", customEmojiId }));
  }

  /** A datetime message entity. */
  dateTime(text: MessageEntityText, dateTime: number, options: Partial<Omit<MessageEntityOf<"dateTime">, "type" | "offset" | "length" | "dateTime">> = {}): this {
    return this.#add(messageEntity<MessageEntityOf<"dateTime">>(text, this.#text.length, { type: "dateTime", dateTime, format: options.format }));
  }

  /** Returns the raw text represented by this builder. */
  override toString(): string {
    return this.#text;
  }

  /** Returns the builder's contents as an array. */
  toArray(): MessageEntity[] {
    return Array.from(this);
  }
}

function messageEntityBuilder(): MessageEntityBuilder {
  return new MessageEntityBuilder();
}

/** Adds plain text. */
export function text(text: string): MessageEntityBuilder {
  return messageEntityBuilder().text(text);
}

/** A bold message entity. */
export function bold(text: MessageEntityText): MessageEntityBuilder {
  return messageEntityBuilder().bold(text);
}

/** An italic message entity. */
export function italic(text: MessageEntityText): MessageEntityBuilder {
  return messageEntityBuilder().italic(text);
}

/** A preformatted message entity. */
export function pre(text: MessageEntityText, language = ""): MessageEntityBuilder {
  return messageEntityBuilder().pre(text, language);
}

/** A code message entity. */
export function code(text: MessageEntityText): MessageEntityBuilder {
  return messageEntityBuilder().code(text);
}

/** A text link message entity. */
export function link(text: MessageEntityText, url: string): MessageEntityBuilder {
  return messageEntityBuilder().link(text, url);
}

/** A text mention message entity. */
export function mention(text: MessageEntityText, userId: number): MessageEntityBuilder {
  return messageEntityBuilder().mention(text, userId);
}

/** An underline message entity. */
export function underline(text: MessageEntityText): MessageEntityBuilder {
  return messageEntityBuilder().underline(text);
}

/** A strikethrough message entity. */
export function strikethrough(text: MessageEntityText): MessageEntityBuilder {
  return messageEntityBuilder().strikethrough(text);
}

/** A blockquote message entity. */
export function blockquote(text: MessageEntityText, options: Partial<Omit<MessageEntityOf<"blockquote">, "type" | "offset" | "length">> = {}): MessageEntityBuilder {
  return messageEntityBuilder().blockquote(text, options);
}

/** A spoiler message entity. */
export function spoiler(text: MessageEntityText): MessageEntityBuilder {
  return messageEntityBuilder().spoiler(text);
}

/** A custom emoji message entity. */
export function customEmoji(text: MessageEntityText, customEmojiId: string): MessageEntityBuilder {
  return messageEntityBuilder().customEmoji(text, customEmojiId);
}

/** A datetime message entity. */
export function dateTime(text: MessageEntityText, dateTime: number, options: Partial<Omit<MessageEntityOf<"dateTime">, "type" | "offset" | "length" | "dateTime">> = {}): MessageEntityBuilder {
  return messageEntityBuilder().dateTime(text, dateTime, options);
}
