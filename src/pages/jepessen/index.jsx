import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Jepessen.module.css'

const JeppesenDataPage = () => {
    const [airportData, setAirportData] = useState(null);
    const [chartsData, setChartsData] = useState(null);
    const [loading, setLoading] = useState(false)

    const [docId, setDocid] = useState("");  // Store the tile image data
    const [isTileLoading, setIsTileLoading] = useState(false);  // Tr

    useEffect(() => {
        // Extract IATA code from the URL
        const iataCode = window.location.pathname.split('/')[2];  // Assuming the URL is `/jeppesen/IATA`

        const fetchJeppesenData = async () => {
            try {
                // Fetch ICAO code based on IATA code
                setLoading(true)
                const airportDocs = await axios.get(`${process.env.REACT_APP_BASE_URL}/jeppesen/icao`, { params: { iata: iataCode } });

                if (airportDocs.status === 200) {
                    setChartsData(airportDocs?.data?.Charts.items);

                }

                // Fetch Airport data
                // const airportResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/jeppesen/charts`, { params: { icao: icaoCode } });
                // setAirportData(airportResponse.data.Airports.items[0]);

                // Fetch Charts data
            } catch (error) {
                console.error("Error fetching Jeppesen data:", error);
            } finally {
                setLoading(false)
            }
        };

        fetchJeppesenData();
    }, []);



    // Fetch tile data when a chart item is clicked
    const handleChartClick = (docid) => {
        setLoading(true)
        const url = `https://ww1.jeppesen.com/icharts/tile?docid=${docid}&x=0&y=0&vpwidth=692&vpheight=921&twidth=692&theight=921&wholechart=true&rotation=0&zoom=6`
        setDocid(url)
        setLoading(false)
    };



    return (
        <div className={styles.jeppesenDataPage}>

            {/* Charts Data (list of charts) */}
            {chartsData && (
                <div className={styles.chartContainer}>
                    <h3 className={styles.title}>Charts</h3>
                    <ul className={styles.docsContainer}>
                        {chartsData.map((chart) => (
                            <li
                                key={chart.docId}
                                onClick={() => handleChartClick(chart.docId)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '5px',
                                    marginBottom: '10px',
                                    backgroundColor: '#f0f0f0',
                                }}
                            >
                                <p>{chart.procId}</p> {/* Display chart name or ID */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Tile Image (right side of the screen) */}
            <div className={styles.tileImageContainer}>
                {isTileLoading ? (
                    <div>Loading tile...</div>
                ) : (
                    docId && <img src={docId} alt="Jeppesen Tile" className={styles.tileImage} />
                )}
            </div>

            {/* Loading Spinner */}
            {loading && <div className={styles.spinner}></div>}
        </div>
    );
};

export default JeppesenDataPage;
