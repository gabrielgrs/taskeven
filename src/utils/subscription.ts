type Subscription = {
	monlyTasks: number
	montlyInsights: number
}

export const subscription: Record<'free' | 'paid', Subscription> = {
	free: {
		monlyTasks: 50,
		montlyInsights: 10,
	},
	paid: {
		monlyTasks: 1000,
		montlyInsights: 60,
	},
}
