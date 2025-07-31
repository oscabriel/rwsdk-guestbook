interface SendEmailParams {
	from: string;
	to: string;
	subject: string;
	html: string;
}

interface ResendEmailResponse {
	id: string;
}

interface ResendErrorResponse {
	message: string;
	name: string;
}

export async function sendEmail(
	params: SendEmailParams,
	apiKey: string,
): Promise<ResendEmailResponse> {
	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify(params),
	});

	if (!response.ok) {
		let errorData: ResendErrorResponse;
		try {
			errorData = (await response.json()) as ResendErrorResponse;
		} catch {
			errorData = {
				message: "Unknown error",
				name: "ResendError",
			};
		}
		throw new Error(
			`Failed to send email: ${response.status} - ${errorData.message}`,
		);
	}

	const result = (await response.json()) as ResendEmailResponse;
	return result;
}
