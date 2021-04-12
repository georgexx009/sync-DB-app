import { useState } from 'react'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import pokeStyles from '../styles/Pokemon.module.css'
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
        <h1 className={styles.title}>
          Sync DB app 
        </h1>

        
          <p className={styles.description}>
          Service example to sync the database with data from a third party API
          </p>

          <p style ={{ textAlign: 'center', width: '80%'}}>
            Imaging you have an app which creates data in your database base on a third party API (this doesn’t mean that you replicate the data from the third party in your database, is more like if something changes in the third party app, then you create something in your DB base on that). This means that when the data changes in the third party, probably you will need to delete or create data in your database (model).
          </p>

          <p className={styles.description}>
            Here we see the list that we have internally saved (in our database) and the results from sync service
          </p>
        

        <div className={pokeStyles.pokemonContainer}>
          <div className={pokeStyles.pokeColumn}>
            <div className={pokeStyles.pokeList} style={{ overflowX: 'auto'}}>
              <span style={{ marginBottom: '16px'}}>Database mock list:</span>
              {pokemons.map(pokemon => (
                <div className={pokeStyles.pokeElement} key={pokemon.id}>
                  <span>{pokemon.externalId}-{pokemon.name}</span>
                </div>
              ))}
            </div>
            <input type="number" value={untilPokeID} onChange={e => {
              setUntilPokeID(parseInt(e.target.value))
            }} style={{ marginBottom: '16px'}} />
            <button onClick={handleSync}>Sync</button>
          </div>

          <div className={pokeStyles.syncResultsContainer}>
            <div className={pokeStyles.pokeColumnResult} style={{ marginRight: '32px'}}>
              <span style={{ marginBottom: '16px'}}>Created from sync:</span>
              <div className={pokeStyles.pokeResults}>
                {syncResults?.createResults.length > 0 ? syncResults.createResults.map(result => (
                  <div className={pokeStyles.pokeElement} key={result.id}>
                    <span>name - {result.name}</span>
                  </div>
                )): (
                  <span>nothing</span>
                )}
              </div>
            </div>

            <div className={pokeStyles.pokeColumnResult}>
              <span style={{ marginBottom: '16px'}}>Deleted from sync:</span>
              <div className={pokeStyles.pokeResults}>
                {syncResults?.deleteResults.length > 0 ? syncResults.deleteResults.map(result => (
                  <div className={pokeStyles.pokeElement} key={result.id}>
                    <span>name - {result.name}</span>
                  </div>
                )): (
                  <span>nothing</span>
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
