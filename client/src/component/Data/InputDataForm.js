import React, { Component } from "react";
import { Message, Button, Form, Select } from "semantic-ui-react";
// import axios from 'axios';

// const genderOptions = [
//   { key: 'm', text: 'Male', value: 'm' },
//   { key: 'f', text: 'Female', value: 'f' },
//   { key: 'o', text: 'Do Not Disclose', value: 'o' }
// ]
const planeClass = [
  { text: "A", value: "A" },
  { text: "B", value: "B" },
  { text: "C", value: "C" },
  { text: "D", value: "D" },
  { text: "E", value: "E" }
];
const planeModel = [
  { text: "A330-203", value: "A330-203" },
  { text: "A320-232", value: "A320-232" },
  { text: "A320-242", value: "A320-242" },
  { text: "A737-3B7", value: "A737-3B7" },
  { text: "B737-3B7", value: "B737-3B7" },
  { text: "B737-476", value: "B737-476" },
  { text: "B717-200", value: "B717-200" }
];
const city = [
  { text: "Adelaide", value: "Adelaide" },
  { text: "Alice Springs", value: "Alice Springs" },
  { text: "Albany", value: "Albany" },
  { text: "Broken Hill", value: "Broken Hill" },
  { text: "Broome", value: "Broome" },
  { text: "Brisbane", value: "Brisbane" },
  { text: "Bendigo", value: "Bendigo" },
  { text: "Canberra", value: "Canberra" },
  { text: "Cairns", value: "Cairns" },
  { text: "Darwin", value: "Darwin" },
  { text: "Hobart", value: "Hobart" },
  { text: "Kalgoorlie", value: "Kalgoorlie" },
  { text: "Launceston", value: "Launceston" },
  { text: "Melbourne", value: "Melbourne" },
  { text: "Mt Isa", value: "Mt Isa" },
  { text: "Newcastle", value: "Newcastle" },
  { text: "Perth", value: "Perth" },
  { text: "Pt Augusta", value: "Pt Augusta" },
  { text: "Rockhampton", value: "Rockhampton" },
  { text: "Sydney", value: "Sydney" },
  { text: "London", value: "London" }
];
const engine = [
  { text: "CF6-80E142", value: "CF6-80E142" },
  { text: "CFM56-3B1", value: "CFM56-3B1" },
  { text: "CFM-56-3", value: "CFM-56-3" },
  { text: "V2527-5A", value: "V2527-5A" },
  { text: "772B-60", value: "772B-60" }
];

class InputDataForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      AirSpaceClass: "",
      From_City: "",
      To_City: "",
      Price: "",
      AircraftModel: "",
      EngineModel: "",
      formClassName: "",
      formSuccessMessage: "",
      formErrorMessage: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    //  this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleInputPrice = this.handleInputPrice.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // Fill in the form with the appropriate data if data id is provided
    if (this.props.dataID) {
      fetch(`${this.props.server}/api/datas/${this.props.dataID}`)
        .then(response => response.json())
        .then(json => {
          this.setState({
            AirSpaceClass: json.AirSpaceClass,
            From_City: json.From_City,
            To_City: json.To_City,
            Price: json.Price,
            AircraftModel: json.AircraftModel,
            EngineModel: json.EngineModel
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleInputPrice(e) {
    const target = e.target;
    const value = target.value;
    this.setState({ Price: value });
  }

  // handleSelectChange(e, data) {
  //     const target = e.target;
  //     const name=target.name;
  //   this.setState({[name]: data.value });
  // }

  handleSelectAirSpaceClass = (e, data) => {
    this.setState({ AirSpaceClass: data.value });
  };

  handleSelectFromCity = (e, data) => {
    this.setState({ From_City: data.value });
  };

  handleSelectToCity = (e, data) => {
    this.setState({ To_City: data.value });
  };

  handleSelectAircraftModel = (e, data) => {
    this.setState({ AircraftModel: data.value });
  };
  handleSelectEngine = (e, data) => {
    this.setState({ EngineModel: data.value });
  };

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    // Acknowledge that if the data id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.dataID ? "put" : "post";
    const params = this.props.dataID ? this.props.dataID : "";
    let resStatus = null;
    fetch(`${this.props.server}/api/datas/${params}`, {
      method: method,
      responseType: "json",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
        // "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        AirSpaceClass: this.state.AirSpaceClass,
        From_City: this.state.From_City,
        To_City: this.state.To_City,
        Price: this.state.Price,
        AircraftModel: this.state.AircraftModel,
        EngineModel: this.state.EngineModel
      })
    })
      .then(response => {
        // console.log(response);
        resStatus = response.status;
        return response.json();
      })
      .then(response => {
        if (resStatus === 200) {
          console.log(response);
          this.setState({
            formClassName: "success",
            formSuccessMessage: response.msg
          });

          if (!this.props.dataID) {
            this.setState({
              AirSpaceClass: "",
              From_City: "",
              To_City: "",
              Price: "",
              AircraftModel: "",
              EngineModel: ""
            });
            this.props.onDataAdded(response.result);
            this.props.socket.emit("add", response.result);
          } else {
            this.props.onDataUpdated(response.result);
            this.props.socket.emit("update", response.result);
          }
        } else {
          this.setState({
            formClassName: "warning",
            formErrorMessage: response.msg
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          control={Select}
          label="AirSpaceClass"
          type="text"
          options={planeClass}
          placeholder="A"
          name="AirSpaceClass"
          maxLength="40"
          value={this.state.AirSpaceClass}
          onChange={this.handleSelectAirSpaceClass}
        />
        <Form.Input
          control={Select}
          label="From_City"
          type="text"
          options={city}
          placeholder="Sydney"
          name="From_City"
          maxLength="40"
          value={this.state.From_City}
          onChange={this.handleSelectFromCity}
        />
        <Form.Group widths="equal">
          <Form.Input
            control={Select}
            label="To_City"
            type="text"
            options={city}
            placeholder="London"
            name="To_City"
            value={this.state.To_City}
            onChange={this.handleSelectToCity}
          />
          {/*<Form.Field*/}
          <Form.Input
            // control={Select}
            label="Price"
            // options={genderOptions}
            placeholder="Price"
            type="number"
            value={this.state.Price}
            // onChange={this.handleSelectChange}
            onChange={this.handleInputPrice}
          />
        </Form.Group>
        <Form.Input
          control={Select}
          label="AircraftModel"
          type="text"
          options={planeModel}
          placeholder="B717-200"
          name="AircraftModel"
          maxLength="40"
          value={this.state.AircraftModel}
          onChange={this.handleSelectAircraftModel}
        />
        <Form.Input
          control={Select}
          label="EngineModel"
          type="text"
          options={engine}
          placeholder="CFM56-3B1"
          name="EngineModel"
          value={this.state.EngineModel}
          onChange={this.handleSelectEngine}
        />
        <Message
          success
          color="green"
          header="Nice one!"
          content={formSuccessMessage}
        />
        <Message
          warning
          color="yellow"
          header="Woah!"
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated="right">
          {this.props.buttonSubmitTitle}
        </Button>
        <br />
        <br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default InputDataForm;
