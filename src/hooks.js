const getUserInformation = () => {
  return { name: "Adam", email: "asoltys@gmail.com" }
} 

export async function handle({ request, resolve }) {
	request.locals.user = await getUserInformation(request.headers.cookie);

	const response = await resolve(request);

	return {
		...response,
		headers: {
			...response.headers,
			'x-custom-header': 'potato'
		}
	};
}

export function getSession(request) {
	return {
		user: {
			name: request.locals.user.name,
			email: request.locals.user.email,
		}
	};
}
