export const GET = makeResultHandler('GET', z.null(), z.object({}), async ({ send, cookies }) => {
	const sessionId = cookies.get('session-id')
	if (!sessionId) {
		return send({
			success: false,
			error: { code: 'NO_SESSION', message: 'No session to log out from' }
		})
	}

	cookies.delete('session-id', { path: '/' })
	await db.session.delete({
		where: {
			id: sessionId
		}
	})
	return send({ success: true, data: {} })
})
