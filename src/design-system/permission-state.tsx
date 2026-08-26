import Link from "next/link";
import { ShieldWarning } from "@phosphor-icons/react/dist/ssr";

type PermissionStateProps = {
  title?: string;
  message?: string;
};

export function PermissionState({
  title = "Akses Dibatasi",
  message = "Anda tidak memiliki izin yang diperlukan untuk melihat halaman ini.",
}: PermissionStateProps) {
  return (
    <div className="permission-state" role="region" aria-label="Pemberitahuan izin akses">
      <div className="permission-state__icon" aria-hidden="true">
        <ShieldWarning size={48} weight="duotone" />
      </div>
      <h2>{title}</h2>
      <p>{message}</p>
      <div className="permission-state__actions">
        <Link href="/" className="primary-action">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
