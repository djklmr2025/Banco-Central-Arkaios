import { useMemo } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    const lines = content.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h4 key={index} className="text-sm font-semibold font-mono tracking-wide text-[#F59E0B] mt-5 mb-2.5 flex items-center gap-1.5 uppercase">
            {line.replace("### ", "")}
          </h4>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={index} className="text-md font-bold font-mono text-[#38BDF8] mt-6 mb-3 border-b border-[#23262D] pb-1.5 uppercase tracking-wider">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h2 key={index} className="text-lg font-extrabold font-mono text-[#E2E8F0] mt-7 mb-4 tracking-widest border-b border-[#23262D] pb-2 uppercase">
            {line.replace("# ", "")}
          </h2>
        );
      }

      // Bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const text = line.trim().substring(2);
        return (
          <li key={index} className="text-[#94A3B8] text-xs ml-5 list-disc leading-relaxed my-1.5">
            {parseInlines(text)}
          </li>
        );
      }

      // Ordered list
      const numMatch = line.trim().match(/^(\d+)\.\s(.*)$/);
      if (numMatch) {
        const text = numMatch[2];
        return (
          <li key={index} className="text-[#94A3B8] text-xs ml-5 list-decimal leading-relaxed my-1.5">
            {parseInlines(text)}
          </li>
        );
      }

      // Blockquotes
      if (line.startsWith("> ")) {
        return (
          <blockquote key={index} className="border-l-2 border-[#F59E0B] pl-4 py-1.5 my-3 bg-[#14161B]/50 text-[#94A3B8] italic text-xs rounded-r">
            {parseInlines(line.replace("> ", ""))}
          </blockquote>
        );
      }

      // Empty spaces
      if (line.trim() === "") {
        return <div key={index} className="h-1.5" />;
      }

      // Standard paragraphs
      return (
        <p key={index} className="text-[#94A3B8] text-[11px] leading-relaxed my-2">
          {parseInlines(line)}
        </p>
      );
    });
  }, [content]);

  return <div className="space-y-1.5 font-sans">{renderedElements}</div>;
}

// Simple parser for **bold** and `code` inline styling
function parseInlines(text: string) {
  const parts = [];
  let currentIndex = 0;

  // Simple regex to match **bold** or `code`
  const inlineRegex = /(\*\*.*?\*\*|`.*?`)/g;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    
    // Add text preceding the match
    if (matchIndex > currentIndex) {
      parts.push(text.substring(currentIndex, matchIndex));
    }

    const matchedStr = match[0];
    if (matchedStr.startsWith("**") && matchedStr.endsWith("**")) {
      parts.push(
        <strong key={matchIndex} className="font-bold text-[#E2E8F0]">
          {matchedStr.substring(2, matchedStr.length - 2)}
        </strong>
      );
    } else if (matchedStr.startsWith("`") && matchedStr.endsWith("`")) {
      parts.push(
        <code key={matchIndex} className="bg-[#1B1E24] text-[#38BDF8] px-1.5 py-0.5 rounded font-mono text-[10px] border border-[#2D3139]">
          {matchedStr.substring(1, matchedStr.length - 1)}
        </code>
      );
    }

    currentIndex = inlineRegex.lastIndex;
  }

  // Add trailing text
  if (currentIndex < text.length) {
    parts.push(text.substring(currentIndex));
  }

  return parts.length > 0 ? parts : text;
}
