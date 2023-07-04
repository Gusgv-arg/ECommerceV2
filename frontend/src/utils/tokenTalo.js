import Axios from "axios"
const user_id="518d2bbb-b930-4c21-8138-d9c6ab75fef3"
const secret="854302a9-0bd2-4f83-8d14-d452991160b7"

export const tokenTalo = async()=>{
    const token = await Axios.post("https://sandbox-api.talo.com.ar/users/:user_id/tokens", {
        client_id: "518d2bbb-b930-4c21-8138-d9c6ab75fef3",
        client_secret: "854302a9-0bd2-4f83-8d14-d452991160b7"
    })
    console.log("token de talo", token)
    //https://sandbox-api.talo.com.ar/users/9f51b1b2-b0cb-446d-88f7-84a78ae0e715/tokens

}