"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/job-match", label: "Job Match", icon: "🎯" },
  { href: "/skill-gap", label: "Skill Gap", icon: "🗺️" },
  { href: "/resume", label: "Resume AI", icon: "📄" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo">
          <div className="logo-icon">🚀</div>
          <span>
            <span className="shimmer-text">NextGen</span>{" "}
            <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>CareerNav</span>
          </span>
        </Link>
        <ul className="navbar-nav">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href ? "active" : ""}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/job-match" className="btn btn-primary btn-sm">
          Get Started →
        </Link>
      </div>
    </nav>
  );
}
