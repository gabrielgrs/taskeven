export const getMonthsOfYear = (lang = 'en-US') =>
	Array(12)
		.fill(null)
		.map((_, index) => {
			const date = new Date(0, index)
			return date.toLocaleString(lang, { month: 'long' })
		})
