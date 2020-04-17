import React, { Component } from 'react';
import { Accordion, Icon, Divider } from 'semantic-ui-react';

import { reportTime } from '../util';
import Detail from './Detail';

const bucket = 'https://storage.googleapis.com/weather-info/pdf/';


export default class AccordionList extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    return (
      <Accordion inverted>
        {this.props.info.map((info, i) => this.renderInfo(info, i))}
      </Accordion>
    );
  }

  renderInfo(info, i) {
    const { activeIndex } = this.state;
    const title = info.title.split('に関する')[0];
    const time_str = reportTime(new Date(info.datetime)) + " 第" + parseInt(info.id.slice(-3)) + "号";

    return <div key={i} className="accordion-item">
      <Accordion.Title
        active={activeIndex === i}
        index={i}
        onClick={this.handleClick}
      >
        <Icon name='dropdown' />
        <span className="info-title">{title} {info.pdf ? <Icon name="file pdf outline" size="tiny"/>: null}</span>
        <p className="info-time">{time_str}</p>
        <p>{info.headline}</p>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === i} >
        {this.renderDetail(info, activeIndex === i)}
      </Accordion.Content>
    </div>;
  }

  renderDetail(info, active) {
    if (info.pdf) {
      const url = bucket + info.pdf;
      return <div>
        <embed src={url} type="application/pdf" width="100%" height="400px" />
        <a href={url} target="_blank" rel="noopener">図形式</a>
      </div>;

    } else {
      return (
        <>
          <Divider />
          <Detail key={info.id} id={info.id} show={active} />
          <Divider />
        </>
      );
    }
  }
}
