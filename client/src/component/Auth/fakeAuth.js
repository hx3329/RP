import {getFromStorage} from "../../utils/storage";

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    setTimeout(cb, 100);
  },

  out(){
      const object = getFromStorage("the_main_app");
      if (object && object.token) {
          const { token } = object;
          //verify token
          fetch("/api/account/logout?token=" + token)
              .then(res => res.json())
              .then(json => {
                  if (json.success) {
                      window.localStorage.removeItem("the_main_app");
                      this.signout();
                      window.location = "/";
                  }
              });
      }
  }
};

export default fakeAuth;
