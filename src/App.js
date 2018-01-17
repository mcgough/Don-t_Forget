import React, { Component } from "react";
import "./App.css";

import { Note } from "./Components/Note";

class NoteClass {
  constructor(note) {
    this.text = note.text || "";
    this.dateAdded = new Date();
    this.topics = [];
  }
}

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
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
  }
  componentDidMount() {
    this.chrome.storage.sync.get("notes", data =>
      this.setState({
        notes: data.notes !== undefined ? data.notes : [],
        appLoaded: true
      })
    );
  }
  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    if (this.state.input === "") return;
    const notes = [
      new NoteClass({ text: this.state.input }),
      ...this.state.notes
    ];
    this.setState({ notes: notes, input: "" });
    this.chrome.storage.sync.set({ notes: notes });
  }
  handleDeleteAll() {
    this.setState({ notes: [] });
    this.chrome.storage.sync.clear();
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
          <div>
            <button className="btn delete-all" onClick={this.handleDeleteAll}>Delete All</button>
          </div>
        </div>
      );
    }
    return null;
  }
}

export default App;
