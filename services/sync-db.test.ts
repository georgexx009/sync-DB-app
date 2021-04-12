import { InternalData, ExternalData } from '../types'
import { mapExternalToInternal, reduceSyncList, syncDb } from './sync-db'
import { generateID } from '../utils/generateID'
import fetch from 'node-fetch';

const deletedInteralPokemon: InternalData = {
	id: 5,
	externalId: 10,
	name: 'pikachu',
	abilities: [
		{
			name: 'thunder',
			isHidden: false
		}
	]
}

const newExternalPokemon: ExternalData = {
	id: 10,
	name: 'pikachu',
	abilities: [
		{
			is_hidden: false,
			ability: {
				name: 'thunder'
			}
		}
	]
}

const createTestData = async (): Promise<{ externalData: ExternalData[], internalData: InternalData[] }> => {
	const generatorID = generateID({ initialID: 1 });
	const promises = [1,2,3,4,5].map(async (i) => {
		const res = await fetch('https://pokeapi.co/api/v2/pokemon/' + i);
		const data = await res.json();
		const newID = generatorID()
		return {
			internal: mapExternalToInternal({ id: newID, externalData: data }),
			external: data
		}
	})

	const data = await Promise.all(promises);

	return data.reduce((result, data) => {
		return {
			internalData: [...result.internalData, data.internal],
			externalData: [...result.externalData, data.external]
		}
	}, {
		externalData: [],
		internalData: []
	})
}

describe('sync db', () => {
	describe('create external test data', () => {
		test('created data', async () => {
			const testData = await createTestData();
			expect(testData.externalData[0].name).toBe('bulbasaur');
		})
	})

	describe('reduce sync list', () => {
		let externalData: ExternalData[];
		let internalData: InternalData[];

		beforeAll(async () => {
			const testData = await createTestData();
			externalData = testData.externalData;
			internalData = testData.internalData;
		});

		test('there is one to be deleted', () => {
			const internalDataWithOneInactive = [
				...internalData,
				deletedInteralPokemon
			];

			const result = reduceSyncList({ internalData: internalDataWithOneInactive, externalData });
			const { toAdd, toDelete } = result;
			expect(toAdd.length).toBe(0);
			expect(toDelete.length).toBe(1);
		});

		test('there is one to be added', () => {
			const externalDataWithOneNew = [
				...externalData,
				newExternalPokemon
			];
			const result = reduceSyncList({ internalData, externalData: externalDataWithOneNew });
			const { toAdd, toDelete } = result;
			expect(toAdd.length).toBe(1);
			expect(toDelete.length).toBe(0);
		});

		test('there is no changes', () => {
			const result = reduceSyncList({ internalData, externalData });
			const { toAdd, toDelete } = result;
			expect(toAdd.length).toBe(0);
			expect(toDelete.length).toBe(0);
		})
	})

	describe('sync db', () => {
		let externalData: ExternalData[];
		let internalData: InternalData[];

		beforeAll(async () => {
			const testData = await createTestData();
			externalData = testData.externalData;
			internalData = testData.internalData;
		});

		test('there is one to be deleted', async () => {
			const internalDataWithOneInactive = [
				...internalData,
				deletedInteralPokemon
			];

			const result = await syncDb({ internalData: internalDataWithOneInactive, externalData });
			expect(result.deleteResults.length).toBe(1);
		});

		test('there is one to be added', async () => {
			const externalDataWithOneNew = [
				...externalData,
				newExternalPokemon
			];

			const result = await syncDb({ internalData, externalData: externalDataWithOneNew });
			expect(result.createResults.length).toBe(1);
		})
	})
})