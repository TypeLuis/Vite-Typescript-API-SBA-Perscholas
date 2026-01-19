import './style.css'
import axios from "axios"

const $ = (selector: string) => document.querySelector(selector)

// const name = $("#name")
// const github = $("#github")
// const submit = $("input[type='submit']")
const form = $("form")

form?.addEventListener("submit", async (e) => {
  e.preventDefault()
  const name:any = $("#name")
  const github:any = $("#github")
  const res = await axios.get(`https://api.github.com/users/${github.value}`)
  
  console.log(res.data)
})
