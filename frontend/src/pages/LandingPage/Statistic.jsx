const stats = [
    { id: 1, name: 'Transactions every 24 hours', value: '44 million' },
    { id: 2, name: 'Assets under holding', value: '$119 trillion' },
    { id: 3, name: 'New users annually', value: '46,000' },
]

export function Statistic() {
    return (
        <div className="bg-background  py-16 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <h1 className="text-text text-3xl mx-auto max-w-7xl">Flexibility, Reliability and Scale</h1>
                <h4 className="text-text text-2xl pb-2 font-bold mx-auto max-w-7xl">The Answer is V1 Logistics</h4>
                <hr className="w-52 bg-primary mb-14 h-2 sm:h-2 " />
                <dl className="grid grid-cols-1 gap-x-8 gap-y-10 text-center lg:grid-cols-3">
                    {stats.map((stat) => (
                        <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                            <dt className="text-base/7 text-gray-600">{stat.name}</dt>
                            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </div>
    )
}
