import { logOut } from "@/lib/firebase"

const Home = () => {
  return (
    <>
    <div>Home</div>
    <button onClick={logOut}>Sign Out</button>
    </>
  )
}

export default Home