import './style.css'
import axios from "axios"


// T is a placeholder type chosen when calling the function.
// `extends Element` ensures only DOM elements can be used.
const $ = <T extends Element>(selector: string) => document.querySelector(selector) as T | null;

const form = $<HTMLFormElement>("form")
const github = $<HTMLInputElement>("#github")
const usersContainer = $<HTMLDivElement>("#users")

const createUser = async () => {
  if(!github) return
  // const res = await axios.get(`https://api.github.com/users/${github.value}`)
  // console.log(res.data)
  
  try {
    console.log( (await axios.get(`https://api.github.com/users/${github.value}`)).data)
    await axios.post("/api/users", {
      github: github.value
    })
    return github.value
  } catch (error) {
    console.error("failed to create user", error)
  }
}

const displayUsers = async () => {
  if (!usersContainer) return
  const {data: users} = await axios("/api/users")

  usersContainer.innerHTML = ""

  for (const user of users) {
    const {data: userData} = await axios(`https://api.github.com/users/${user.github}`)
    const element = `
      <article class="user">
        <img src="${userData.avatar_url}" alt="${userData.name ?? userData.login ?? "GitHub user"}" />

        <div class="userInfo">
          <section class="naming">
          ${userData.login
            ? `<a href="${userData.html_url}" target="_blank" rel="noreferrer" class="login">@${userData.login}</a>`
            : ""}
            ${userData.name ? `<p class="name">${userData.name}</p>` : ""}
          </section>
          
          <section class="userMeta">
            ${userData.followers !== undefined 
              ? `<p class="followers">Followers: ${userData.followers}</p>` 
              : ""}

            ${userData.following !== undefined 
              ? `<p class="following">Following: ${userData.following}</p>` 
              : ""}

            ${userData.type 
              ? `<p class="type">Type: ${userData.type}</p>` 
              : ""}

            ${userData.user_view_type 
              ? `<p class="user_type">User type: ${userData.user_view_type}</p>` 
              : ""}

            ${userData.created_at 
              ? `<p class="created_at">Created: ${new Date(
                  userData.created_at
                ).toLocaleDateString()}</p>` 
              : ""}
          </section>
        </div>


      </article>
    `
    usersContainer.innerHTML += element
    // usersContainer.appendChild(div)
  }
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault()
  await createUser()
  await displayUsers()
})

;(async () => {
  await displayUsers()
})()
