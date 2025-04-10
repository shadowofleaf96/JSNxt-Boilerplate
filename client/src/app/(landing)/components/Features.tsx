import React from "react";
import {
  HiCloudArrowUp,
  HiLockClosed,
  HiArrowPath,
  HiFingerPrint,
  HiCog6Tooth,
  HiServer,
} from "react-icons/hi2";

const Features: React.FC = () => {
  const features = [
    {
      name: "Push to deploy.",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
      icon: HiCloudArrowUp,
    },
    {
      name: "SSL certificates.",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
      icon: HiLockClosed,
    },
    {
      name: "Simple queues.",
      description:
        "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus.",
      icon: HiArrowPath,
    },
    {
      name: "Advanced security.",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit aute id magna.",
      icon: HiFingerPrint,
    },
    {
      name: "Powerful API.",
      description:
        "Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.",
      icon: HiCog6Tooth,
    },
    {
      name: "Database backups.",
      description:
        "Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. ",
      icon: HiServer,
    },
  ];

  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400">
            Deploy faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to deploy your app
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="font-semibold text-white">
                  <feature.icon
                    className="absolute left-1 top-1 h-5 w-5 text-indigo-400"
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
