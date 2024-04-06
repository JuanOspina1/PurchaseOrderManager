interface fieldsType {
	name: string;
	field: any;
}

/**
 * Checks if the required fields in an array of fields are present.
 * @param fields - An array of fields to be checked.
 * @returns An array of field names that are missing, or null if all fields are present.
 */

export const checkFields = (fields: fieldsType[]) => {
	let errors = <String[]>[];

	fields.forEach((field) => {
		if (!field.field) {
			errors.push(field.name);
		}
	});

	return errors.length === 0 ? null : errors;
};
