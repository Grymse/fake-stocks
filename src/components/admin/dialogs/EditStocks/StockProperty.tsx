type StockPropertyProps = { value: string; name: string; unit: string };

export default function StockProperty({
  value,
  name,
  unit,
}: StockPropertyProps) {
  return (
    <div className="grid flex-1 auto-rows-min gap-0.5">
      <div className="text-xs text-muted-foreground">{name}</div>
      <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
        {value}
        <span className="text-sm font-normal text-muted-foreground">
          {unit}
        </span>
      </div>
    </div>
  );
}
