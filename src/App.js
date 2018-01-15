import React, { Component } from "react";
import "./App.css";

import { Note } from './Components/Note/Note';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      notes: [],
      appLoaded: false
    };
    this.chrome = window.chrome || window.browser;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.chrome.storage.sync.get("notes", data =>
      this.setState({ notes: data.notes, appLoaded: true })
    );
  }

  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.input === "") return;
    const notes = [this.state.input, ...this.state.notes];
    this.setState({ notes: notes, input: "" });
    this.chrome.storage.sync.set({ notes: notes });
  }
  render() {
    if (this.state.appLoaded) {
      let notes = this.state.notes.map(note => <Note note={note} />);
      return (
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Don't Forget</h1>
            <div>
              <form onSubmit={this.handleSubmit}>
                <input
                  type="text"
                  value={this.state.input}
                  onChange={this.handleInputChange}
                />
              </form>
            </div>
          </header>
          <div>
            <ul>{notes}</ul>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default App;
