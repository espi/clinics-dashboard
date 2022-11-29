import * as React from 'react';

import Layout from '@/components/layout/Layout';
import { useEffect, useState } from 'react';

export default function HomePage() {

  const [clinicsData, setClinicsData] = useState([])
  const [patientsDataID, setPatientsDataID] = useState(1)
  const [patientsData, setPatientsData] = useState([])
  const [isClinicsDataLoading, setClinicsDataLoading] = useState(true)
  const [isPatientsDataLoading, setPatientsDataLoading] = useState(true)
  const [sortColumn, setSortColumn] = useState(0)

  useEffect(() => {
    setClinicsDataLoading(true);
    fetch('/api/clinics')
      .then((res) => res.json())
      .then((data) => {
        // Remove header
        data.shift()
        setClinicsData(data)
        setClinicsDataLoading(false)
      });
  }, []);

  useEffect(() => {
    setPatientsDataLoading(true);
    fetch('/api/patients/' + patientsDataID)
      .then((res) => res.json())
      .then((data) => {
        setPatientsData(data)
        setPatientsDataLoading(false)
      });
  }, [patientsDataID]);

  useEffect(() => {
    if (isClinicsDataLoading || isPatientsDataLoading) return;
    if (!patientsData || patientsData.length < 1) throw ("Patient data not found, verify source");

    if (sortColumn !== null) {
      const _patientsData = Object.assign([], patientsData);
      const header = _patientsData.shift();
      const useLocaleCompare = isNaN(_patientsData[0][sortColumn]) // Check if data is string or number
      const patientsDataSorted = _patientsData.sort((a: { [x: string]: number | string; }, b: { [x: string]: number | string; }) => {

        // localeCompare will sort strings alphabetically otherwise we sort numerically
        return useLocaleCompare ? (a[sortColumn] as string).localeCompare((b[sortColumn] as string)) : (a[sortColumn] as number) - (b[sortColumn] as number)
      })

      if (header) {
        patientsDataSorted.unshift(header);
      } else {
        throw ("Header row missing") // Shouldn't ever happen
      }
      setPatientsData(patientsDataSorted);
    }

  }, [isClinicsDataLoading, isPatientsDataLoading, patientsDataID, sortColumn]);

  const formatColumnHeader = (arg: string): React.ReactNode => {
    return arg.replaceAll("_", " ")
  }

  if (isClinicsDataLoading) return <h1 className='loading'>Loading...</h1>
  if (!clinicsData) return <p>Clinic data not found</p>
  if (!patientsData || patientsData.length < 1) return <p>Patient data not found</p>

  let tablehead
  const tableContent = []
  for (const i in patientsData) {
    if (+i === 0) {
      tablehead =
        (<thead>
          <tr style={{ textTransform: "capitalize" }}>
            <th><p><a onClick={() => setSortColumn(0)}>{formatColumnHeader(patientsData[i][0])}</a></p></th>
            <th><p><a onClick={() => setSortColumn(1)}>{formatColumnHeader(patientsData[i][1])}</a></p></th>
            <th><p><a onClick={() => setSortColumn(2)}>{formatColumnHeader(patientsData[i][2])}</a></p></th>
            <th><p><a onClick={() => setSortColumn(3)}>{formatColumnHeader(patientsData[i][3])}</a></p></th>
            <th><p><a onClick={() => setSortColumn(4)}>{formatColumnHeader(patientsData[i][4])}</a></p></th>
          </tr>
        </thead >)
    } else {
      tableContent.push(
        <tr key={i}>
          <td>{patientsData[i][0]}</td>
          <td>{patientsData[i][1]}</td>
          <td>{patientsData[i][2]}</td>
          <td>{patientsData[i][3]}</td>
          <td>{patientsData[i][4]}</td>
        </tr>
      )
    }
  }

  return (
    <Layout>
      <main>
        <section className='bg-white'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <h1 className='mt-4'>
              Clinic Dashboard
            </h1>

            <div className="inline-block relative w-64">
              <select
                value={patientsDataID}
                onChange={(e) => setPatientsDataID(+e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {clinicsData.map(clinic =>
                  <option
                    value={clinic[0]}
                    key={clinic[1]}
                  >
                    {clinic[1]}
                  </option>)}
              </select>
            </div>

            <p>Sorted by: <span style={{ textTransform: "capitalize" }}>{formatColumnHeader(patientsData[0][sortColumn])}</span></p>

            {isPatientsDataLoading ? <p>Patient data is loading...</p> : null}

            <table>
              {tablehead}
              <tbody>
                {tableContent}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </Layout>
  );
}
