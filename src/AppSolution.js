import React from "react";
import "./assets/style/App.css";
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

class AppSolution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {},
      context: {},
      name: "",
    };
  }

  componentDidMount() {

    monday.listen("settings", (res) => {
      this.setState({ settings: res.data });
    });

    monday.api(`query { me { name } }`).then((res) => {
      this.setState({ name: res.data.me.name });
    });
    
  }

  render() {
    return (
      <div
        className="App"
        style={{ background: this.state.settings.background }}
      >
        Hello, {this.state.name}!
      </div>
    );
  }
}

export default AppSolution;
