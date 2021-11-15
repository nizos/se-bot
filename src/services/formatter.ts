import { singleton } from '@aurelia/kernel'

@singleton
export class Formatter {

  formatEmails(body: Readonly<string>): string {
    const htmlTag = 'href="mailto';
    let formatted = body;
    while (formatted.search(htmlTag) != -1) {
      const openTagStart = formatted.indexOf('<a href="mailto');
      const emailStart = formatted.indexOf(":", openTagStart);
      const emailEnd = formatted.indexOf('"', emailStart);
      const openTagEnd = formatted.indexOf(">", emailEnd);
      const closeTagStart = formatted.indexOf("</a>", openTagEnd);
      const closeTagEnd = formatted.indexOf(">", closeTagStart);

      const emailAddress = formatted.substring(emailStart + 1, emailEnd);
      const emailText = formatted.substring(openTagEnd + 1, closeTagStart);

      let formattedMessage = formatted.substring(0, openTagStart);
      formattedMessage += "[" + emailText + "](mailto:" + emailAddress + ")";
      formattedMessage += formatted.substring(closeTagEnd + 1);
      formatted = formattedMessage;
    }
    return formatted;
  }

  formatLinks(body: Readonly<string>): string {
    const htmlTag = "href=";
    let formatted = body;
    while (formatted.search(htmlTag) != -1) {
      const openTagStart = formatted.indexOf("<a ");
      const hrefStart = formatted.indexOf("href=", openTagStart);
      const linkStart = formatted.indexOf('"', hrefStart);
      const linkEnd = formatted.indexOf('"', linkStart + 1);
      const openTagEnd = formatted.indexOf(">", linkEnd);
      const closeTagStart = formatted.indexOf("</a>", openTagEnd);
      const closeTagEnd = formatted.indexOf(">", closeTagStart);

      const linkAddress = formatted.substring(linkStart + 1, linkEnd);
      const linkText = formatted.substring(openTagEnd + 1, closeTagStart);

      let formattedMessage = formatted.substring(0, openTagStart);
      formattedMessage += "[" + linkText + "](" + linkAddress + ")";
      formattedMessage += formatted.substring(closeTagEnd + 1);
      formatted = formattedMessage;
    }
    return formatted;
  }

  formatIFrames(body: Readonly<string>): string {
    const htmlTag = "<iframe";
    let formatted = body;
    while (formatted.search(htmlTag) != -1) {
      const openTagStart = formatted.indexOf("<iframe ");
      const srcPropStart = formatted.indexOf("src=", openTagStart);
      const srcStart = formatted.indexOf('"', srcPropStart);
      const srcEnd = formatted.indexOf('"', srcStart + 1);
      const openTagEnd = formatted.indexOf(">", srcEnd);
      const closeTagStart = formatted.indexOf("</iframe>", openTagEnd);
      const closeTagEnd = formatted.indexOf(">", closeTagStart);

      const iframeSrc = formatted.substring(srcStart + 1, srcEnd);

      let formattedMessage = formatted.substring(0, openTagStart);
      formattedMessage += "[link](" + iframeSrc + ")";
      formattedMessage += formatted.substring(closeTagEnd + 1);
      formatted = formattedMessage;
    }
    return formatted;
  }

  removeScripts(body: Readonly<string>): string {
    const htmlTag = "<script";
    let formatted = body;
    while (formatted.search(htmlTag) != -1) {
      const openTagStart = formatted.indexOf("<script");
      const closeTagStart = formatted.indexOf("</script>", openTagStart);
      const closeTagEnd = formatted.indexOf(">", closeTagStart);

      let formattedMessage = formatted.substring(0, openTagStart);
      formattedMessage += formatted.substring(closeTagEnd + 1);
      formatted = formattedMessage;
    }
    return formatted;
  }

  formatUnderline(body: Readonly<string>): string {
    const htmlTag = "text-decoration: underline";
    let formatted = body;
    while (formatted.search(htmlTag) != -1) {
      const openTagStart = formatted.indexOf(
        '<span style="text-decoration: underline;">'
      );
      const openTagEnd = formatted.indexOf(">", openTagStart);
      const closeTagStart = formatted.indexOf("</span>", openTagEnd);
      const closeTagEnd = formatted.indexOf(">", closeTagStart);

      const underlinedText = formatted.substring(openTagEnd + 1, closeTagStart);

      let formattedMessage = formatted.substring(0, openTagStart);
      formattedMessage += "__" + underlinedText + "__";
      formattedMessage += formatted.substring(closeTagEnd + 1);
      formatted = formattedMessage;
    }
    return formatted;
  }

  formatMarkdown(body: Readonly<string>): string {
    let formatted = body;
    formatted = formatted
      .replace(/\n' \+\n'/g, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/<span>/g, "")
      .replace(/<\/span>/g, "")
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .replace(/<br>/g, "\n")
      .replace(/<li>/g, "  • ")
      .replace(/<\/li>/g, "")
      .replace(/<ul>/g, "")
      .replace(/<\/ul>/g, "")
      .replace(/<ol>/g, "")
      .replace(/<\/ol>/g, "")
      .replace(/<em>/g, "")
      .replace(/<\/em>/g, "")
      .replace(/<strong>/g, "**")
      .replace(/<\/strong>/g, "**")
      .replace(/^\'/, "")
      .replace(/\(Länkar till en externa sida.\)/g, "")
      .replace(/<span class="screenreader-only">/g, "");
    return formatted;
  }

  strip(body: Readonly<string>): string {
    let formatted = body;
    formatted = this.formatUnderline(formatted);
    formatted = this.formatMarkdown(formatted);
    formatted = this.formatEmails(formatted);
    formatted = this.formatLinks(formatted);
    formatted = this.formatIFrames(formatted);
    formatted = this.removeScripts(formatted);
    return formatted;
  }
}
