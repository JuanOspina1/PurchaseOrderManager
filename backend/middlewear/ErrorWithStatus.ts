export class ErrorWithStatus extends Error {
	status: number;
	stringified: boolean;

	constructor(status: number, message: any, stringified: boolean = false) {
		super(message);
		this.status = status;
		this.stringified = stringified;
	}
}
