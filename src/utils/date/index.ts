import dayjs from 'dayjs'

export function timeValueToMinutes(time: string) {
	const [hours, minutes] = time.split(':').map((item) => Number(item))
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return -1
	return minutes + 60 * hours
}

export function generateTimeValuesArray(timeIntervalInMinutes: number) {
	const startOfDay = dayjs().startOf('day')

	return Array(24 * (60 / timeIntervalInMinutes))
		.fill(null)
		.map((_, index) => {
			const value = dayjs(startOfDay)
				.add(index * timeIntervalInMinutes, 'minute')
				.format('HH:mm')
			return { label: value, value }
		})
}
