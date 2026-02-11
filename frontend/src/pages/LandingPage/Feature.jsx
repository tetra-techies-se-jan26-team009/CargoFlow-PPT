import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
    {
        name: 'Push to deploy',
        description:
            'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'SSL certificates',
        description:
            'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
        icon: LockClosedIcon,
    },
    {
        name: 'Simple queues',
        description:
            'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
        icon: ArrowPathIcon,
    },
    {
        name: 'Advanced security',
        description:
            'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
        icon: FingerPrintIcon,
    },
]

export function Feature() {
    return (
        <section className="relative bg-white py-16 sm:py-20 lg:py-24 overflow-hidden">
            {/* GRID BACKGROUND */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
                    backgroundSize: "24px 24px",
                    WebkitMaskImage:
                                "radial-gradient(ellipse 60% 60% at 50% 0%, #000 60%, transparent 100%)",
                            maskImage:
                                "radial-gradient(ellipse 60% 60% at 50% 0%, #000 60%, transparent 100%)",
                }}
            />

            {/* CONTENT */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-0 max-w-2xl text-left">
                    <p className="text-sm font-semibold text-indigo-600">
                        We Provide
                    </p>
                    <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Everything to Ship
                    </h2>
                </div>

                {/* Cards */}
                <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
                    {features.map((feature) => (
                        <div
                            key={feature.name}
                            className="relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                        >
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900">
                                {feature.name}
                            </h3>
                            <p className="mt-3 text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}