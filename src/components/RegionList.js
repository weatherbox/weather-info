import React, { Component } from 'react';
import { Header, Accordion, Icon } from 'semantic-ui-react';

import { reportTime } from '../util'


export default class RegionList extends Component {
  render() {
    const keys = Object.keys(this.props.regions).sort();
    const now = Date.now();
    const regions = keys.map(code => {
      const region = this.props.regions[code][0];
      const time = new Date(region.datetime);

      if ((now - time) <= this.props.period * 3600 * 1000){
        region.code = code;
        return region;
      }
    }).filter(d => d);

    return (
      <div>
        <Header as='h3'>地方</Header>
        <AccordionListHeadline info={regions} onClick={this.props.onClick} />
      </div>
    );
  }
}


class AccordionListHeadline extends Component {
  state = { activeIndex: null }

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
    const time_str = reportTime(new Date(info.datetime)) + " 第" + parseInt(info.id.slice(-3)) + "号";

    return <div key={i} className="accordion-item">
      <Accordion.Title
        active={activeIndex === i}
        index={i}
        onClick={this.handleClick}
      >
        <Icon name='dropdown' />
        <span className="info-title">{info.title}</span>
        <p className="info-time">{time_str}</p>
      </Accordion.Title>
      <Accordion.Content
        active={activeIndex === i}
        onClick={() => this.props.onClick(info.code)}
      >
        <p className="info-region-headline">{info.headline}</p>
      </Accordion.Content>
    </div>;
  }
}
