export function timeValueToMinutes(time: string) {
	const [hours, minutes] = time.split(':').map((item) => Number(item))
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return -1
	return minutes + 60 * hours
}
