import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

const AuthCard = ({ title, children, footer }: AuthCardProps) => (
  <div className="row justify-content-center">
    <div className="col-12 col-md-8 col-lg-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 mb-4 text-center">{title}</h1>
          {children}
        </div>
        <div className="card-footer text-center bg-white">{footer}</div>
      </div>
    </div>
  </div>
);

export default AuthCard;
