import "dotenv/config";

interface Variables {
    PORT: number
}


const variables: Variables = {
    PORT : Number(process.env.PORT) || 3020
}


export default variables