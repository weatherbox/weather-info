import React, { Component } from 'react';
import { Header, Accordion, Icon, Divider } from 'semantic-ui-react';

import { reportTime } from '../util';
import Detail from './Detail';


export default class Pref extends Component {
  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const prefTitle = this.props.info[0].title.split('に関する')[1];

    return (
      <div className="info-pref">
        <Header as='h3'>{prefTitle}</Header>
        <Accordion inverted>
          {this.props.info.map((info, i) => this.renderInfo(info, i))}
        </Accordion>
      </div>
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
        <span className="info-title">{title}</span>
        <p className="info-time">{time_str}</p>
        <p>{info.headline}</p>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === i} >
        <Divider />
        <Detail key={info.id} id={info.id} show={activeIndex === i} />
        <Divider />
      </Accordion.Content>
    </div>;
  }
}

