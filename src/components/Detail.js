import React, { Component } from 'react';

const bucket = 'https://storage.googleapis.com/weather-info/d/';

export default class Detail extends Component {
  state = { detail: null }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && !prevProps.show) this.fetch();
  }

  fetch() {
    if (!this.props.show) return;
    fetch(bucket + this.props.id + '.json')
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ detail: data });
      });
  }

  render() {
    if (!this.state.detail) return null;

    return (
      <div className="info-detail">
        {this.state.detail.comment}
      </div>
    );
  }
}


