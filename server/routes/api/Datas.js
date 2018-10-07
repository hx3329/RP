const RateLimit = require("express-rate-limit");
const stringCapitalizeName = require("string-capitalize-name");

const Data = require("../../models/Data");
// const Test = require('../../models/Test');

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  delayMs: 0, // Disable delaying - full speed until the max limit is reached
  handler: (req, res) => {
    res
      .status(429)
      .json({
        success: false,
        msg: `You made too many requests. Please try again after ${minutes} minutes.`
      });
  }
});

module.exports = app => {
  // READ (ONE)
  app.get("/api/datas/:id", (req, res) => {
    Data.findById(req.params.id)
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(404).json({ success: false, msg: `No such data.` });
      });
  });

  // READ (ALL)
  app.get("/api/datas", (req, res) => {
    Data.find({})
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      });
  });

  // CREATE
  app.post("/api/datas", postLimiter, (req, res) => {
    if (req.body.From_City == req.body.To_City) {
      return res.status(400).send({
        success: false,
        msg: "Error: From_City cannot be the same as To_City"
      });
    }

    Data.find(
      {
        AirSpaceClass: req.body.AirSpaceClass,
        From_City: req.body.From_City,
        To_City: req.body.To_City,
        Price: req.body.Price,
        AircraftModel: req.body.AircraftModel,
        EngineModel: req.body.EngineModel
      },
      (err, previousAirlines) => {
        if (err) {
          return res.status(400).send({
            success: false,
            msg: "Error: Server error"
          });
        } else if (previousAirlines.length > 0) {
          return res.status(400).send({
            success: false,
            msg: "Error: Airline already exist."
          });
        } else {
          let newData = new Data({
            AirSpaceClass: sanitizeName(req.body.AirSpaceClass),
            From_City: req.body.From_City,
            To_City: req.body.To_City,
            Price: req.body.Price,
            AircraftModel: req.body.AircraftModel,
            EngineModel: req.body.EngineModel
          });

          newData
            .save()
            .then(result => {
              res.json({
                success: true,
                msg: `Successfully added!`,
                result: {
                  _id: result._id,
                  AirSpaceClass: result.AirSpaceClass,
                  From_City: result.From_City,
                  To_City: result.To_City,
                  Price: result.Price,
                  AircraftModel: result.AircraftModel,
                  EngineModel: result.EngineModel
                }
              });
            })
            .catch(err => {
              console.log(err);
              if (err.errors) {
                if (err.errors.AirSpaceClass) {
                  res
                    .status(400)
                    .json({
                      success: false,
                      msg: err.errors.AirSpaceClass.message
                    });
                  return;
                }
                if (err.errors.From_City) {
                  res
                    .status(400)
                    .json({
                      success: false,
                      msg: err.errors.From_City.message
                    });
                  return;
                }
                if (err.errors.To_City) {
                  res
                    .status(400)
                    .json({ success: false, msg: err.errors.To_City.message });
                  return;
                }
                if (err.errors.Price) {
                  res
                    .status(400)
                    .json({ success: false, msg: err.errors.Price.message });
                  return;
                }
                // Show failed if all else fails for some reasons
                res
                  .status(500)
                  .json({
                    success: false,
                    msg: `Something went wrong. ${err}`
                  });
              }
            });
        }
      }
    );
  });

  // UPDATE
  app.put("/api/datas/:id", (req, res) => {
    let updatedData = {
      AirSpaceClass: sanitizeName(req.body.AirSpaceClass),
      From_City: req.body.From_City,
      To_City: req.body.To_City,
      Price: req.body.Price,
      AircraftModel: req.body.AircraftModel,
      EngineModel: req.body.EngineModel
    };

    Data.findOneAndUpdate({ _id: req.params.id }, updatedData, {
      runValidators: true,
      context: "query"
    })
      .then(oldResult => {
        Data.findOne({ _id: req.params.id })
          .then(newResult => {
            res.json({
              success: true,
              msg: `Successfully updated!`,
              result: {
                _id: newResult._id,
                AirSpaceClass: newResult.AirSpaceClass,
                From_City: newResult.From_City,
                To_City: newResult.To_City,
                Price: newResult.Price,
                AircraftModel: newResult.AircraftModel,
                EngineModel: newResult.EngineModel
              }
            });
          })
          .catch(err => {
            res
              .status(500)
              .json({ success: false, msg: `Something went wrong. ${err}` });
            return;
          });
      })
      .catch(err => {
        if (err.errors) {
          if (err.errors.AirSpaceClass) {
            res
              .status(400)
              .json({ success: false, msg: err.errors.AirSpaceClass.message });
            return;
          }
          if (err.errors.From_City) {
            res
              .status(400)
              .json({ success: false, msg: err.errors.From_City.message });
            return;
          }
          if (err.errors.To_City) {
            res
              .status(400)
              .json({ success: false, msg: err.errors.To_City.message });
            return;
          }
          if (err.errors.Price) {
            res
              .status(400)
              .json({ success: false, msg: err.errors.Price.message });
            return;
          }
          if (err.errors.AircraftModel) {
            res
              .status(400)
              .json({ success: false, msg: err.errors.AircraftModel.message });
          }

          if (err.errors.EngineModel) {
            res
              .status(400)
              .json({ success: false, msg: err.errors.EngineModel.message });
          }
          // Show failed if all else fails for some reasons
          res
            .status(500)
            .json({ success: false, msg: `Something went wrong. ${err}` });
        }
      });
  });

  // DELETE
  app.delete("/api/datas/:id", (req, res) => {
    Data.findByIdAndRemove(req.params.id)
      .then(result => {
        res.json({
          success: true,
          msg: `It has been deleted.`,
          result: {
            _id: result._id,
            AirSpaceClass: result.AirSpaceClass,
            From_City: result.From_City,
            To_City: result.To_City,
            Price: result.Price,
            AircraftModel: result.AircraftModel,
            EngineModel: result.EngineModel
          }
        });
      })
      .catch(err => {
        res.status(404).json({ success: false, msg: "Nothing to delete." });
      });
  });
};

// Minor sanitizing to be invoked before reaching the database
sanitizeName = name => {
  return stringCapitalizeName(name);
};
// sanitizePrice = (price) => {
//   // Return empty if price is non-numeric
//   if (isNaN(price) && price != '') return '';
//   return (price === '') ? price : parseInt(price);
// }
