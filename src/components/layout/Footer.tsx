export default function Footer() {
  return (
    <footer className="hidden lg:block bg-white border-t border-gray-100 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-6 text-sm text-gray-500">
          <span className="font-medium text-gray-700">Google Play</span>
          <a href="#" className="hover:text-[#01875F]">About Google Play</a>
          <a href="#" className="hover:text-[#01875F]">Privacy Policy</a>
          <a href="#" className="hover:text-[#01875F]">Terms of Service</a>
          <a href="#" className="hover:text-[#01875F]">Developers</a>
          <a href="#" className="hover:text-[#01875F]">Help Center</a>
        </div>
        <div className="mt-4 text-xs text-gray-400">
          © 2026 Google LLC — This is a demo clone for educational purposes.
        </div>
      </div>
    </footer>
  );
}
