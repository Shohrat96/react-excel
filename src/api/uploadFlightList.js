
import axios from 'axios';

const uploadFlightList = async (flights) => {
    
    try {
        const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/flights/upload`, {
            flights
        })
        if (res.status !== 200 ) {
            throw new Error("error in post >/flights/upload ");
            
        }
        return res
    } catch (error) {
        console.log("Error in upload: ", error)
    }
}
export default uploadFlightList