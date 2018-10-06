const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

module.exports = app => {
  /*
   * Sign up
   */
  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password, address, phone, errors } = body;

    let { email } = body;

    if (errors) {
      return res.send({
        success: false,
        message: "Error:invalid login."
      });
    }
    if (!firstName) {
      return res.send({
        success: false,
        message: "Error: firstName cannot be blank."
      });
    }

    if (!lastName) {
      return res.send({
        success: false,
        message: "Error: lastName cannot be blank."
      });
    }

    if (!email) {
      return res.send({
        success: false,
        message: "Error: Email cannot be blank."
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: Password cannot be blank."
      });
    }
    if (!address) {
      return res.send({
        success: false,
        message: "Error: Address cannot be blank."
      });
    }
    if (!phone) {
      return res.send({
        success: false,
        message: "Error: Phone cannot be blank."
      });
    }

    email = email.toLowerCase();
    email = email.trim();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find(
      {
        email: email
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: "Error: Account already exist."
          });
        }
        // Save the new user
        const newUser = new User();
        newUser.email = email;
        newUser.lastName = lastName;
        newUser.firstName = firstName;
        newUser.password = newUser.generateHash(password);
        newUser.address =  address;
        newUser.phone = phone;
        newUser.save((err, user) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: Server error"
            });
          }
          return res.send({
            success: true,
            message: "Signed up"
          });
        });
      }
    );
  }); // end of sign up endpoint

  /*
  * sign in
  * */
  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { password } = body;

    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: "Error: Email cannot be blank."
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "Error: Password cannot be blank."
      });
    }

    email = email.toLowerCase();
    email = email.trim();

    User.find(
      {
        email: email
      },
      (err, users) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        //find zero users
        if (users.length != 1) {
          return res.send({
            success: false,
            message: "Error Invalid"
          });
        }
        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: "Error Invalid"
          });
        }

        //all goods save the correct user
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            console.log(err);
            return res.send({
              success: false,
              message: "Error: server error"
            });
          }
          return res.send({
            success: true,
            message: "Valid sign in",
            token: doc._id //points back userID
          });
        });
      }
    );
  });

  /*
  * verify the users
  * validate the user’s session token every time they want to perform an action
  * */
  app.get("/api/account/verify", (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test

    // Verify the token is one of a kind and it's not deleted.
    UserSession.find(
      {
        _id: token,
        isDeleted: false
      },
      (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: "Error: Invalid"
          });
        } else {
          // DO ACTION
          return res.send({
            success: true,
            message: "Good"
          });
        }
      }
    );
  });

  /*
  * logout
  * set UserSession to deleted
  * */
  app.get("/api/account/logout", (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false
      },
      {
        $set: {
          isDeleted: true
        }
      },
      null,
      (err, sessions) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: "Error: Server error"
          });
        }
        return res.send({
          success: true,
          message: "Good"
        });
      }
    );
  });
};
