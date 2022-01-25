import React from 'react';

function App() {
  return (
    <>
      <div className="container my-3">
        <div className="card p-3">
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
