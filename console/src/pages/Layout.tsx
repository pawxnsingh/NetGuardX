import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}
export function Layout({ children }: Readonly<LayoutProps>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <header className="p-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <p className="text-black">NetGuardX</p>
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-gray-600 hover:text-blue-600"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="text-blue-600"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
