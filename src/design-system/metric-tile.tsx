type MetricTileProps = {
  detail?: string;
  label: string;
  value: string;
};

export function MetricTile({ detail, label, value }: MetricTileProps) {
  return (
    <article className="metric-tile">
      <p className="metric-tile__label">{label}</p>
      <p className="metric-tile__value">{value}</p>
      {detail ? <p className="metric-tile__detail">{detail}</p> : null}
    </article>
  );
}
