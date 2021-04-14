import { InternalData, ExternalData, ResultOperation } from '../types';
import { generateID } from '../utils/generateID';
import { mapExternalToInternal } from '../utils/mapPokemonData';
const generatorID = generateID();

interface ReducedSyncList {
  toDelete: InternalData[]
  toAdd: ExternalData[]
}

interface SyncDbParams {
	internalData: InternalData[];
	externalData: ExternalData[];
}

export const syncDb = async ({ internalData, externalData }: SyncDbParams) => {
	console.log(internalData);
  let deleteResults: ResultOperation[] = []
  let createResults: ResultOperation[] = []

	const syncList = reduceSyncList({ internalData, externalData });

	if (syncList.toAdd.length > 0) {
		const arrayPromises = syncList.toAdd.map(async (el) => {
			const elCreated = await createDbRecord({ externalElement: el })
			return {
				id: el.id,
				name: el.name,
				status: elCreated ? true : false
			}
		});

		createResults = await Promise.all(arrayPromises);
	}

	if (syncList.toDelete.length > 0) {
		const arrayPromises = syncList.toDelete.map(async (el) => {
			const elDeleted = await deleteDbRecord({ id: el.id })
			return {
				id: el.id,
				name: el.name,
				status: elDeleted
			}
		});

		deleteResults = await Promise.all(arrayPromises);
	}

	return {
		deleteResults,
		createResults
	}
}

export const reduceSyncList = ({ internalData, externalData }: SyncDbParams): ReducedSyncList => {
  // convert the internal data to an object
	// where the keys are the external id
	// like this the search will be O(1)
	const mappedInternalData = internalData.reduce((obj, el) => {
		return {
			...obj,
			[el.externalId]: el
		}
	},{})

  const toAddList: ReducedSyncList['toAdd'] = externalData.reduce((syncLists, el) => {
	if (mappedInternalData[el.id]) {
	  delete mappedInternalData[el.id]
	  
	  return syncLists
	}
	return [el ,...syncLists]
  }, [])

  const toDeleteList: InternalData[] = Object.values(mappedInternalData)

  return {
		toAdd: toAddList,
		toDelete: toDeleteList
  }
}

const createDbRecord = ({ externalElement }: { externalElement: ExternalData }): Promise<InternalData> => {
	// simulating being connected with a database
	// use any orm of your preference
	const newID = generatorID();
	const mapped = mapExternalToInternal({ id: newID, externalData: externalElement });
	// SAVE IN DB
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(mapped)
		}, 200)
	});
}

const deleteDbRecord = ({ id }: { id: number }): Promise<boolean> => {
	// use try/catch, sometimes ORMs like Sequlize only returns a confirmation
	// if there is an error, return false
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true)
		}, 200)
	})
}
