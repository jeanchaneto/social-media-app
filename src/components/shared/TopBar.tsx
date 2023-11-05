import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { logOut } from "@/lib/firebase";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

const TopBar = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            onClick={handleLogOut}
            variant="ghost"
            className="shad-button_ghost"
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${userData?.id}`} className="flex-center gap-3">
            <img
              src={userData?.imageUrl || "public/profile-placeholder.svg"}
              alt="profile photo"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBar;
