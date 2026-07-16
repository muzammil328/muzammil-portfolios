function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function ProjectBody({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\s*\n/);

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const trimmed = block.trim();

        if (trimmed.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-bold mt-8 mb-2 first:mt-0">
              {trimmed.slice(3)}
            </h2>
          );
        }

        const lines = trimmed
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        if (lines.length > 0 && lines.every((line) => line.startsWith('- '))) {
          return (
            <ul key={i} className="list-disc pl-5 space-y-2 text-muted-foreground">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.slice(2))}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-muted-foreground leading-relaxed">
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}
