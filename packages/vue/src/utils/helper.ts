export const Helper = {
	generateUUID(): string {
		const alphabet = 'abcdefghijklmnopqrstuvwxyz';
		const randomCharacter = alphabet[Math.floor(Math.random() * alphabet.length)];
		const newDate = new Date().getTime();
		return `${randomCharacter}${Math.random().toString(32).substring(2)}${newDate}`;
	},
};
