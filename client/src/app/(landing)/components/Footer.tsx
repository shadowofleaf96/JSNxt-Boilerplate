const Footer: React.FC = () => {
  const footerNavigation = {
    solutions: [
      { name: "Marketing", href: "#" },
      { name: "Analytics", href: "#" },
      { name: "Automation", href: "#" },
      { name: "Commerce", href: "#" },
      { name: "Insights", href: "#" },
    ],
    support: [
      { name: "Submit ticket", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "Guides", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Jobs", href: "#" },
      { name: "Press", href: "#" },
    ],
    legal: [
      { name: "Terms of service", href: "#" },
      { name: "Privacy policy", href: "#" },
      { name: "License", href: "#" },
    ],
  };

  return (
    <footer className="mt-32 bg-gray-900 sm:mt-56">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <img
            alt="Company name"
            src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="h-9"
          />
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-white">
                  Solutions
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.solutions.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-white">Support</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm/6 font-semibold text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm/6 font-semibold text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerNavigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm/6 text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
