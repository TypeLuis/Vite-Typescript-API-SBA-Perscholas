import './style.css'
import axios from "axios"


// T is a placeholder type chosen when calling the function.
// `extends Element` ensures only DOM elements can be used.
const $ = <T extends Element>(selector: string) => document.querySelector(selector) as T | null;

const form = $<HTMLFormElement>("form")
const github = $<HTMLInputElement>("#github")
const usersContainer = $<HTMLDivElement>("#users")




usersContainer?.addEventListener("click", (e) => {
  // .closest walks up the DOM tree to find the closest button
  const btn = (e.target as HTMLElement).closest("button")
  if (!btn) return

  const id = Number(btn.dataset.id)

  if (btn.classList.contains("deleteBtn")) {
    handleDelete(id)
  }

  if (btn.classList.contains("editBtn")) {
    const currentGithub = btn.dataset.github
    handleEdit(id, currentGithub)
  }
})

form?.addEventListener("submit", async (e) => {
  e.preventDefault()
  await createUser()
  await displayUsers()
})

;(async () => {
  await displayUsers()
})()


async function handleDelete (id:number) {
  await axios.delete(`/api/users/${id}`)
  await displayUsers()
}

async function handleEdit(id: number, currentGithub?: string) {
  console.log('here')
  const newGithub = prompt(
    "Enter new GitHub username:",
    currentGithub
  )
  if (!newGithub) return

  try {
    await axios.get(`https://api.github.com/users/${newGithub}`)

    await axios.put(`/api/users/${id}`, {
      github: newGithub
    })

    await displayUsers()
  } catch (error) {
    alert("GitHub user not found")
  }
}

async function createUser () {
  if(!github) return
  // const res = await axios.get(`https://api.github.com/users/${github.value}`)
  // console.log(res.data)
  
  try {
    const username = github.value.trim()
    if (!username) return
    await axios.get(`https://api.github.com/users/${username}`)
    await axios.post("/api/users", {
      github: username
    })
    return username
  } catch (error) {
    console.error("failed to create user", error)
  }
}

async function displayUsers() {
  if (!usersContainer) return

  try {
    const { data: users } = await axios.get("/api/users")
    usersContainer.innerHTML = ""

    let html = ""

    for (const user of users) {
      try {
        const { data: userData } = await axios.get(
          `https://api.github.com/users/${user.github}`
        )

        html += `
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
                ${userData.followers != null ? `<p class="followers">Followers: ${userData.followers}</p>` : ""}
                ${userData.following != null ? `<p class="following">Following: ${userData.following}</p>` : ""}
                ${userData.type ? `<p class="type">Type: ${userData.type}</p>` : ""}
                ${userData.user_view_type ? `<p class="user_type">User type: ${userData.user_view_type}</p>` : ""}
                ${userData.created_at ? `<p class="created_at">Created: ${new Date(userData.created_at).toLocaleDateString()}</p>` : ""}
                <button class="deleteBtn" data-id="${user.id}">Delete</button>
                <button class="editBtn" data-id="${user.id}" data-github="${user.github}">Edit</button>
              </section>
            </div>
          </article>
        `
      } catch (error) {
        console.error(error)
        continue
      }
    }

    usersContainer.innerHTML = html || `<p>No users yet.</p>`
  } catch (error:any) {
    console.error(error)
    usersContainer.innerHTML = `<h2>${error.message}</h2>`
  }
}