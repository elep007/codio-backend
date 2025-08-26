const dateValidator = async (value: any) => {
  // Return true if the value is null, undefined, or an empty string, allowing the field to be optional.
  if (value === null || value === undefined || value === '') {
    return true;
  }
  
  // Use the Date constructor to parse the string.
  const date = new Date(value);

  // Check if the parsed date is not NaN, which indicates a valid date.
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  return true;
}
export { dateValidator };