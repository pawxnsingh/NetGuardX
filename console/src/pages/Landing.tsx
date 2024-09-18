import { Layout } from "./layout";

export function LandingPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
        <h1 className="text-4xl font-bold mb-4">
          NetGuardX - ML-Powered Application Firewall
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-5xl">
        AI-powered application firewall designed for security teams, enhancing endpoint security and preventing exploitation of critical OWASP vulnerabilities.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
          Get started
        </button>
      </div>
    </Layout>
  );
}
