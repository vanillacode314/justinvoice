export const DELETE = makeResultHandler(
	'DELETE',
	z.null(),
	z.object({}),
	async ({ send, data, locals }) => {
		const user = locals.user!
		const result = await handleTransaction(() =>
			db
				.$transaction([
					db.entity.deleteMany({
						where: {
							userId: user
						}
					}),
					db.invoice.deleteMany({
						where: {
							userId: user
						}
					}),
					db.log.deleteMany({
						where: {
							invoice: {
								userId: user
							}
						}
					})
				])
				.then(() => ({}))
		)
		return send(result, { statusCode: result.success ? 200 : 500 })
	}
)
