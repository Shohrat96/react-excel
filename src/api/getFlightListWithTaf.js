import axios from 'axios';

const getFlightListWithTaf = async () => {
    
    try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/flights`)
        return res
    } catch (error) {
        console.log("Error in upload: ", error)
    }
}
export default getFlightListWithTaf