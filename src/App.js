import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DropdownButton, Dropdown, Container, Row, Table, InputGroup, FormControl, Col, Button, ProgressBar, Alert } from "react-bootstrap";
import * as api from "./lib/api";

const STATE_READY = 0;
const STATE_LOADING = 1; 

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: STATE_LOADING,
      errMsg: undefined,
      users: [],
      metrics: [],
      metric: 0,
      limit: 3,
      user: 0,
      results: undefined
    };
  }

  getUser = () => {
    return this.state.users[this.state.user];
  }

  getMetric = () => {
    return this.state.metrics[this.state.metric];
  }

  componentDidMount = () => {
    // Load all things that we need at first.
    Promise.all([
      api.getUsers(),
      api.getMetrics()
    ])
      .then(res => {
        this.setState({ users: res[0], metrics: res[1], status: STATE_READY });
      });
  };

  render = () => {
    return (
      <div className="App">
        <header className="App-header mb-3">
          {this._renderHeader()}
        </header>
        <div className="App-content">
        <Container>
            {}
            <Row>
              {this.state.status === STATE_READY ? this._renderControls() : ""}
            </Row>
            <Row>
              {this.state.status === STATE_READY && this.state.results ? this._renderTable() : ""}
            </Row>
          </Container>
        </div>
      </div>
      );
  }

  _renderHeader = () => {
    return (<div>
      <h1 className="text-center">Assignment 1</h1>
      {this.state.status === STATE_LOADING ? this._renderLoading() : ""}
      {this.state.errMsg ? this._renderError() : ""}
    </div>);
  }

  _renderLoading = () => {
    return (<ProgressBar className="mt-2" animated now={100} />);
  }

  _renderError = () => {
    return (<Alert variant="danger">{this.state.errMsg}</Alert>);
  }

  _renderControls = () => {
    return (
      <Row>
        <InputGroup className="mb-3">
          {this._renderUserSelection()}
          {this._renderSimilaritySelection()}
          {this._renderResultCountSelection()}
        </InputGroup>
        <InputGroup>
          {this._renderActionMenu()}
        </InputGroup>
      </Row>
    );
  }

  _renderUserSelection = () => {
    return (
      <Col>
      
      <InputGroup>
      <InputGroup.Prepend className="mr-3">User: </InputGroup.Prepend>
      <DropdownButton id="userList" title={`${this.getUser().id}: ${this.getUser().name}`} as={InputGroup.FormControl}>
        {this.state.users.map((a, i) => (
          <Dropdown.Item as="button" key={i} onClick={e => this._userSelected(i)}>{ a.name }</Dropdown.Item> 
        ))}
      </DropdownButton>
      </InputGroup>
      </Col>
    );
  }

  _renderTable = () => {
    return (<Table striped bordered hover variant="dark">
    <thead>
      <tr>
        <th>Name</th>
        <th>Id</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      {this.state.results.map(a => this._renderTableRow(a))}
    </tbody>
  </Table>);
  }

  _renderTableRow = (resultItem) => {
    return (
      <tr key={resultItem.id}>
        <td>{resultItem.title || resultItem.name}</td>
        <td>{resultItem.id}</td>
        <td>{resultItem.score || resultItem.similarity}</td>
      </tr>
    );
  }

  _userSelected = (userIndex) => {
    this.setState({ user: userIndex });
  }

  _renderSimilaritySelection = () => {
    return (
      <Col>
      <InputGroup>
        <InputGroup.Prepend className="mr-3">Similarity: </InputGroup.Prepend>
        <DropdownButton id="userList" title={this.getMetric()} as={InputGroup.FormControl}>
          {this.state.metrics.map((a, i) => (
            <Dropdown.Item as="button" key={i} onClick={e => this._metricSelected(i)}>{ a }</Dropdown.Item> 
          ))}
        </DropdownButton>
      </InputGroup>
      </Col>
      );
  }

  _metricSelected = (metricIndex) => {
    this.setState({ metric: metricIndex });
  }

  _renderResultCountSelection = () => {
    return (
      <Col>
      <InputGroup>
        <InputGroup.Prepend className="mr-3">Results: </InputGroup.Prepend>
          <FormControl value={this.state.limit} onChange={this._limitSelected} />
        </InputGroup>
      </Col>
      );
  }

  _limitSelected = e => {
    this.setState({ limit: e.target.value });
  }

  _renderActionMenu = () => {
    return (
      <InputGroup className="mb-3">
          <Col><Button onClick={this._doFindUsersFor}>Find top matching users</Button></Col>
          <Col><Button onClick={this._doFindMoviesFor}>Find recommended movies</Button></Col>
          <Col><Button onClick={this._doFindMoviesForItemBased}>Find recommendations, item-based</Button></Col>
      </InputGroup>
    );
  }

  _doFindUsersFor = () => {
    this.setState({ status: STATE_LOADING, results: undefined });
    api.getUsersFor(this.getUser().id, this.getMetric(), this.state.limit)
      .then(res => this.setState({ results: res, status: STATE_READY }))
      .catch(err => this._onError(err));
  }

  _doFindMoviesFor = () => {
    this.setState({ status: STATE_LOADING, results: undefined });
    api.getMoviesFor(this.getUser().id, this.getMetric(), this.state.limit)
      .then(res => this.setState({ results: res, status: STATE_READY }))
      .catch(err => this._onError(err));
  }

  _doFindMoviesForItemBased = () => {
    this.setState({ status: STATE_LOADING, results: undefined });
    api.getItemBasedMoviesFor(this.getUser().id, this.state.limit)
      .then(res => this.setState({ results: res, status: STATE_READY }))
      .catch(err => this._onError(err));
  }

  _onError = err => {
    this.setState({ results: undefined, status: STATE_READY, errMsg: "Something got messed up. Try again." });
  }
}

export default App;
