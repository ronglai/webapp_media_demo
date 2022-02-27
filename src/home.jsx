import { Outlet } from "react-router-dom";
function Home() {
  return (
    <>
      {/* <h1>home</h1> */}
      {/* <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link to="/">Invoices</Link> | <Link to="/">Expenses</Link>
      </nav> */}
      <Outlet />
    </>
  );
}
export default Home;
