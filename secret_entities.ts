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

import type { SecretMessageEntity } from "@mtkruto/mtkruto";

type SecretMessageEntityOf<T extends SecretMessageEntity["type"]> = Extract<SecretMessageEntity, { type: T }>;
export type SecretMessageEntityText = string | SecretMessageEntityBuilder | SecretMessageEntityText[];

function getSecretMessageEntityText(text: SecretMessageEntityText): string {
  if (typeof text === "string") {
    return text;
  } else if (text instanceof SecretMessageEntityBuilder) {
    return text.toString();
  } else {
    return text.map(getSecretMessageEntityText).join("");
  }
}

function getEntityText(entity: SecretMessageEntity): string {
  const text = (entity as { text?: unknown }).text;
  return typeof text === "string" ? text : "";
}

function secretMessageEntity<T extends SecretMessageEntity>(text: SecretMessageEntityText, offset: number, entity: Omit<T, "offset" | "length">): T {
  const text_ = getSecretMessageEntityText(text);
  return { ...entity, offset, length: text_.length, text: text_ } as unknown as T;
}

/** A chainable builder for arrays of secret message entities. */
export class SecretMessageEntityBuilder extends Array<SecretMessageEntity> {
  #text = "";

  constructor(...entities: SecretMessageEntity[]) {
    super(...entities);
    this.#text = entities.map(getEntityText).join("");
  }

  #add(entity: SecretMessageEntity): this {
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

  /** A bold secret message entity. */
  bold(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"bold">>(text, this.#text.length, { type: "bold" }));
  }

  /** An italic secret message entity. */
  italic(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"italic">>(text, this.#text.length, { type: "italic" }));
  }

  /** A preformatted secret message entity. */
  pre(text: SecretMessageEntityText, language = ""): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"pre">>(text, this.#text.length, { type: "pre", language }));
  }

  /** A code secret message entity. */
  code(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"code">>(text, this.#text.length, { type: "code" }));
  }

  /** A text link secret message entity. */
  link(text: SecretMessageEntityText, url: string): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"textLink">>(text, this.#text.length, { type: "textLink", url }));
  }

  /** A text mention secret message entity. */
  mention(text: SecretMessageEntityText, userId: number): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"textMention">>(text, this.#text.length, { type: "textMention", userId }));
  }

  /** An underline secret message entity. */
  underline(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"underline">>(text, this.#text.length, { type: "underline" }));
  }

  /** A strikethrough secret message entity. */
  strikethrough(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"strikethrough">>(text, this.#text.length, { type: "strikethrough" }));
  }

  /** A blockquote secret message entity. */
  blockquote(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"blockquote">>(text, this.#text.length, { type: "blockquote" }));
  }

  /** A spoiler secret message entity. */
  spoiler(text: SecretMessageEntityText): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"spoiler">>(text, this.#text.length, { type: "spoiler" }));
  }

  /** A custom emoji secret message entity. */
  customEmoji(text: SecretMessageEntityText, customEmojiId: string): this {
    return this.#add(secretMessageEntity<SecretMessageEntityOf<"customEmoji">>(text, this.#text.length, { type: "customEmoji", customEmojiId }));
  }

  /** Returns the raw text represented by this builder. */
  override toString(): string {
    return this.#text;
  }

  /** Returns the builder's contents as an array. */
  toArray(): SecretMessageEntity[] {
    return Array.from(this);
  }
}

function secretMessageEntityBuilder(): SecretMessageEntityBuilder {
  return new SecretMessageEntityBuilder();
}

/** Adds plain text. */
export function text(text: string): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().text(text);
}

/** A bold secret message entity. */
export function bold(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().bold(text);
}

/** An italic secret message entity. */
export function italic(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().italic(text);
}

/** A preformatted secret message entity. */
export function pre(text: SecretMessageEntityText, language = ""): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().pre(text, language);
}

/** A code secret message entity. */
export function code(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().code(text);
}

/** A text link secret message entity. */
export function link(text: SecretMessageEntityText, url: string): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().link(text, url);
}

/** A text mention secret message entity. */
export function mention(text: SecretMessageEntityText, userId: number): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().mention(text, userId);
}

/** An underline secret message entity. */
export function underline(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().underline(text);
}

/** A strikethrough secret message entity. */
export function strikethrough(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().strikethrough(text);
}

/** A blockquote secret message entity. */
export function blockquote(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().blockquote(text);
}

/** A spoiler secret message entity. */
export function spoiler(text: SecretMessageEntityText): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().spoiler(text);
}

/** A custom emoji secret message entity. */
export function customEmoji(text: SecretMessageEntityText, customEmojiId: string): SecretMessageEntityBuilder {
  return secretMessageEntityBuilder().customEmoji(text, customEmojiId);
}
