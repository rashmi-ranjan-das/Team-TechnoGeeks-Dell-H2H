import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <>
      <nav className="navbar navbar-light bg-light" style={{backgroundColor:"#e3f2fd"}}>
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1" style={{color:"#3894d1"}}>DELL H2H</span>
        </div>
      </nav>
      <div className="container my-3">
        <div className="card p-3" style={{backgroundColor:"#edfeff"}}>
          <form>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                URL
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter the URL"
              />
            </div>
            <div className="mb-3">
              <label for="exampleInputEmail1" className="form-label">
                UserName
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter your unique username"
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter your password"
              />
            </div>
            <div class="text-center">
            <button type="submit" className="btn btn-primary btn-lg" >
              Validate
            </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
