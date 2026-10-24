import { Fragment } from "react";

// Renders the small markup allowed inside he.json / en.json texts:
//   <b>bold</b>, <en>English words</en>, <he>Hebrew words</he>, and {placeholders}
// Placeholders are replaced by the matching entry in `values` (text or a link element).
const TOKEN = /(<b>[\s\S]*?<\/b>|<en>[\s\S]*?<\/en>|<he>[\s\S]*?<\/he>|\{\w+\})/g;

export default function Rich({ text, values = {} }: { text: string; values?: Record<string, React.ReactNode> }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("<b>")) return <strong key={i}><Rich text={part.slice(3, -4)} values={values} /></strong>;
        if (part.startsWith("<en>")) return <span key={i} lang="en" dir="ltr">{part.slice(4, -5)}</span>;
        if (part.startsWith("<he>")) return <span key={i} lang="he" dir="rtl">{part.slice(4, -5)}</span>;
        const placeholder = part.match(/^\{(\w+)\}$/);
        if (placeholder && placeholder[1] in values) return <Fragment key={i}>{values[placeholder[1]]}</Fragment>;
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
