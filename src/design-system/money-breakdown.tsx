type MoneyBreakdownRole = "talent" | "business" | "admin";

type MoneyBreakdownProps = {
  serviceValue: number;
  role?: MoneyBreakdownRole;
  platformFeePercent?: number; // default 10%
  warrantyRetentionPercent?: number; // default 10%
};

export function MoneyBreakdown({
  serviceValue,
  role = "talent",
  platformFeePercent = 10,
  warrantyRetentionPercent = 10,
}: MoneyBreakdownProps) {
  const platformFee = Math.round((serviceValue * platformFeePercent) / 100);
  const totalFundingDue = serviceValue + platformFee;
  const warrantyRetention = Math.round((serviceValue * warrantyRetentionPercent) / 100);
  const immediatePayout = serviceValue - warrantyRetention;

  const formatCurrency = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  return (
    <div className="money-breakdown" data-role={role}>
      <h3 className="money-breakdown__title">Rincian Finansial Transparan</h3>

      {role === "business" && (
        <dl className="money-breakdown__list">
          <div className="money-breakdown__row">
            <dt>Nilai Kompensasi Talent (Service Value)</dt>
            <dd>{formatCurrency(serviceValue)}</dd>
          </div>
          <div className="money-breakdown__row">
            <dt>Biaya Platform CocokIn ({platformFeePercent}%)</dt>
            <dd>{formatCurrency(platformFee)}</dd>
          </div>
          <div className="money-breakdown__row money-breakdown__row--total">
            <dt>Total Pendanaan Masuk (Funding Due)</dt>
            <dd>{formatCurrency(totalFundingDue)}</dd>
          </div>
        </dl>
      )}

      {role === "talent" && (
        <dl className="money-breakdown__list">
          <div className="money-breakdown__row">
            <dt>Nilai Pekerjaan (Service Value)</dt>
            <dd>{formatCurrency(serviceValue)}</dd>
          </div>
          <div className="money-breakdown__row">
            <dt>Payout Langsung Tiap Milestone ({100 - warrantyRetentionPercent}%)</dt>
            <dd className="text-success">{formatCurrency(immediatePayout)}</dd>
          </div>
          <div className="money-breakdown__row">
            <dt>Retensi Garansi Kualitas 30 Hari ({warrantyRetentionPercent}%)</dt>
            <dd className="text-muted">{formatCurrency(warrantyRetention)}</dd>
          </div>
          <div className="money-breakdown__row money-breakdown__row--total">
            <dt>Total Hak Penerimaan Talent</dt>
            <dd>{formatCurrency(serviceValue)}</dd>
          </div>
        </dl>
      )}

      {role === "admin" && (
        <dl className="money-breakdown__list">
          <div className="money-breakdown__row">
            <dt>Service Value</dt>
            <dd>{formatCurrency(serviceValue)}</dd>
          </div>
          <div className="money-breakdown__row">
            <dt>Total Funding Received</dt>
            <dd>{formatCurrency(totalFundingDue)}</dd>
          </div>
          <div className="money-breakdown__row">
            <dt>Talent Payable (90% Direct + 10% Reserve)</dt>
            <dd>{formatCurrency(serviceValue)}</dd>
          </div>
          <div className="money-breakdown__row">
            <dt>Platform Fee Earned (5% Act + 5% Succ)</dt>
            <dd>{formatCurrency(platformFee)}</dd>
          </div>
        </dl>
      )}

      <p className="money-breakdown__notice">
        {role === "talent"
          ? "Talent menerima 100% Service Value tanpa potongan biaya platform. Retensi garansi dicairkan setelah masa garansi 30 hari usai."
          : "Dana aman disimpan pada rekening penampungan terisolasi dengan rasio coverage 100%."}
      </p>
    </div>
  );
}
