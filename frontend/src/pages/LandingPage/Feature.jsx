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
        <section className="relative overflow-hidden mb-4">
            
            {/* CONTENT */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-0 max-w-2xl text-left">
                    <p className="text-sm font-semibold text-primary">
                        We Provide
                    </p>
                    <h2 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-5xl">
                        Everything to Ship
                    </h2>
                </div>

                {/* Cards */}
                <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2">
                    {features.map((feature) => (
                        <div
                            key={feature.name}
                            className="relative rounded-2xl border border-gray-600:shadow-lg/6 bg-background p-8 shadow-sm"
                        >
                            <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                                <feature.icon className="h-6 w-6 text-accent" />
                            </div>

                            <h3 className="text-lg font-semibold text-black">
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