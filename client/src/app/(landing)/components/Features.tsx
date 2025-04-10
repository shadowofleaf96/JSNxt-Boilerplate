import React from "react";
import {
  HiCloudArrowUp,
  HiArrowPath,
  HiFingerPrint,
  HiCog6Tooth,
  HiChartBar,
  HiRss,
} from "react-icons/hi2";

const Features: React.FC = () => {
  const features = [
    {
      name: "Instant deployment.",
      description:
        "Deploy your Next.js apps quickly with automated workflows, ensuring a smooth deployment process.",
      icon: HiCloudArrowUp,
    },
    {
      name: "Efficient state management.",
      description:
        "Integrate state management with tools like Redux or Zustand for scalable and maintainable apps.",
      icon: HiArrowPath,
    },
    {
      name: "Authentication services.",
      description:
        "Ensure your application’s security with authentication services and fingerprint authentication.",
      icon: HiFingerPrint,
    },
    {
      name: "Customizable API.",
      description:
        "Build powerful and flexible APIs using Express.js to handle backend logic and data flow for your Next.js applications.",
      icon: HiCog6Tooth,
    },
    {
      name: "Performance optimization.",
      description:
        "Boost your app's performance with built-in features like server-side rendering and static site generation.",
      icon: HiChartBar,
    },
    {
      name: "Customizable routing.",
      description:
        "Take control of routing in your Next.js application with dynamic routes and an intuitive URL structure.",
      icon: HiRss,
    },
  ];

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-gray-400">
            Deploy faster with JSNxt
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Features to boost your Next.js apps
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="font-semibold text-white">
                  <feature.icon
                    className="absolute left-1 top-1 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-2">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Features;
