import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { logOut } from "@/lib/firebase";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { sidebarLinks } from "@/constants";
import { type NavLink as NavLinkType } from "@/types";

const LeftSideBar = () => {
  const navigate = useNavigate();
  const { userData: user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user?.id}`} className="flex items-center gap-3">
          <img
            src={user?.imageUrl || "/profile-placeholder.svg"}
            alt="profile photo"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user?.name}</p>
            <p className="small-regular text-light-3">@{user?.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: NavLinkType) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        onClick={handleLogOut}
        variant="ghost"
        className="shad-button_ghost"
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium" >Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSideBar;
