import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { InternalData, ApiResponse } from '../types';

const fetchPokemons = async ({ untilID = 5 }: { untilID?: number } = {}) => {
  const pokemonList: ApiResponse = await (await fetch('http://localhost:3000/api/pokemons/' + untilID)).json();
  return pokemonList;
}

export default function Home({ pokemonList }: { pokemonList: InternalData[] }) {
  const [untilPokeID, setUntilPokeID] = useState(5);
  const [pokemons, setPokemons] = useState(pokemonList);
  const [syncResults, setSyncResults] = useState<ApiResponse['syncResults']>(null);

  const handleSync = async () => {
    const { pokemonList, syncResults: actualsyncResults } = await fetchPokemons({ untilID: untilPokeID });
    setPokemons(pokemonList);
    setSyncResults(actualsyncResults);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Sync DB</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
				<div className={styles.descriptionContainer}>
					<h1 className={styles.title}>
						Sync DB app 
					</h1>

        
          <p className={styles.description}>
          Service example to sync the database with data from a third party API
          </p>

          <p className={styles.situation}>
            Imaging you have an app which creates data in your database base on a third party API (this doesn’t mean that you replicate the data from the third party in your database, is more like if something changes in the third party app, then you create something in your DB base on that). This means that when the data changes in the third party, probably you will need to delete or create data in your database (model).
          </p>

          <p className={styles.description}>
            Here we see the list that we have internally saved (in our database) and the results from sync service
          </p>
				</div>

        <div className={styles.serviceExampleContainer}>
          <div className={styles.pokemonList}>

            <div>
              <input type="number" value={untilPokeID} onChange={e => {
                setUntilPokeID(parseInt(e.target.value))
              }} style={{ marginBottom: '16px', marginRight: '16px'}} />
              <button style={{ marginBottom: '16px'}} onClick={handleSync}>Sync</button>
            </div>

            <div style={{ overflowY: 'auto' }}>
              <h4>Database mock list:</h4>
              {pokemons.map(pokemon => (
                <div className={styles.pokeElement} key={pokemon.id}>
                  <span>{pokemon.externalId}-{pokemon.name}</span>
                </div>
              ))}
            </div>
            
          </div>

          <div className={styles.syncResultsContainer}>
            <div style={{ marginRight: '32px'}}>
              <h4 style={{ marginBottom: '16px'}}>Created from sync:</h4>
              <div>
                {syncResults?.createResults.length > 0 ? syncResults.createResults.map(result => (
                  <div key={result.id}>
                    <span>name - {result.name}</span>
                  </div>
                )): (
                  <span>nothing changed</span>
                )}
              </div>
            </div>

            <div className={styles.pokeColumnResult}>
              <h4 style={{ marginBottom: '16px'}}>Deleted from sync:</h4>
              <div>
                {syncResults?.deleteResults.length > 0 ? syncResults.deleteResults.map(result => (
                  <div key={result.id}>
                    <span>name - {result.name}</span>
                  </div>
                )): (
                  <span>nothing changed</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/georgexx009"
          target="_blank"
          rel="noopener noreferrer"
        >
          Example By Georgexx009
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  // mocking saved data in our DB
  const { pokemonList } = await fetchPokemons();

  return {
    props: {
      pokemonList
    }
  }
}
