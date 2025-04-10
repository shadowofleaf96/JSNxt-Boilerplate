import {
  FaNodeJs,
  FaReact,
  FaDatabase,
  FaCss3Alt,
  FaGithub,
} from "react-icons/fa";

const Hero: React.FC = () => {
  return (
    <main>
      <div className="relative isolate overflow-hidden bg-gray-900 pt-14 pb-16 sm:pb-20">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2830&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                New: Now with MongoDB + Auth integration.{" "}
                <a href="/changelog" className="font-semibold text-white">
                  See what’s new <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-7xl">
                Kickstart your next project with JSNxt
              </h1>
              <p className="mt-8 text-lg font-medium text-gray-400 sm:text-xl">
                A modern and scalable boilerplate using Next.js, Express.js,
                TypeScript, and Tailwind CSS — built for developers who value
                structure and speed.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/docs"
                  className="rounded-md bg-gray-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                >
                  Read the Docs
                </a>
                <a
                  href="https://github.com/shadowofleaf96/JSNxt-Boilerplate"
                  className="text-sm font-semibold text-white"
                >
                  View on GitHub <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
            <div className="flex items-center justify-center">
              <FaReact size={64} className="text-white" />
            </div>
            <div className="flex items-center justify-center">
              <FaNodeJs size={64} className="text-white" />
            </div>
            <div className="flex items-center justify-center">
              <FaDatabase size={64} className="text-white" />
            </div>
            <div className="flex items-center justify-center">
              <FaCss3Alt size={64} className="text-white" />
            </div>
            <div className="flex items-center justify-center">
              <FaGithub size={64} className="text-white" />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </main>
  );
};
export default Hero;
