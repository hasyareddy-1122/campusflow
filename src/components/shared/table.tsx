export function Table({ headers, data }: { headers: string[]; data: any[][] }) {
  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {headers.map((h) => <th key={h} className="p-2 text-left text-muted-foreground">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b">
              {row.map((cell, j) => <td key={j} className="p-2">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
