import { Outlet, Link } from "react-router-dom";
function Home() {
  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link to="/media">media</Link> | <Link to="/">camera</Link>
      </nav>
      <Outlet />
    </>
  );
}
export default Home;
