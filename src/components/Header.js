import React, { Component } from 'react';
import { Header, Button, Breadcrumb } from 'semantic-ui-react';


export default class InfoHeader extends Component {
  onClick = () => {
    const code = this.props.jmaCode;
    const page = code === 'index' ? '' : code + '_';
    const url = `https://www.jma.go.jp/jp/kishojoho/${page}index.html`;
    window.open(url, '_blank', 'noopener');
  }

  render() {
    return (
      <div className="info-header">
        <Header as='h3'>
          {this.props.children}
          <Button className="info-header-link" icon='linkify' inverted size='mini' onClick={this.onClick} />
        {this.renderBreadcrumb()}
        </Header>

      </div>
    );
  }
  
  renderBreadcrumb() {
    if (this.props.bread) {
      return (
        <Breadcrumb className="info-breadcrumb">
          {this.props.bread.map((item, i) => {
            return (
              <React.Fragment key={i}>
                {i > 0 ? <Breadcrumb.Divider /> : null}
                <Breadcrumb.Section link onClick={item.onClick}>
                  {item.title}
                </Breadcrumb.Section>
              </React.Fragment>
            );
          })}
        </Breadcrumb>
      );
    } else {
      return null;
    }
  }
}

