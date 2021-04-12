export const generateID = ({ initialID = 1 }: { initialID?: number } = {}) => {
	let ID = initialID;
	return () => {
		ID = ID + 1;
		return ID;
	}
}