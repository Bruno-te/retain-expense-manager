interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
  valueClassName?: string;
}

const StatCard = ({ label, value, detail, valueClassName = "" }: StatCardProps) => (
  <div className="card shadow-sm h-100">
    <div className="card-body">
      <div className="text-muted small text-uppercase">{label}</div>
      <div className={`fs-3 fw-bold ${valueClassName}`}>{value}</div>
      {detail && <div className="small text-muted text-truncate">{detail}</div>}
    </div>
  </div>
);

export default StatCard;
