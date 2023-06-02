
export const resetPasswordEmailTemplate = (baseUrl, token) => {
	return `<p>Please Click the following link to reset your password:</p>
    <a href="${baseUrl()}/reset-password/${token}">Reset Password</a>
    <p>E-CommerceV2 team.</p>
    `;
};
