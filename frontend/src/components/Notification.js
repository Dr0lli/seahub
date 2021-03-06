import React from 'react';

const gettext = window.gettext;
class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNotice: false,
      notice_html: ''
    }
  }

  onClick = () => {
    this.setState({
      showNotice: !this.state.showNotice
    })
    if (!this.state.showNotice) {
      this.loadNotices()
    }
  }

  loadNotices = () => {
    this.props.seafileAPI.getPopupNotices().then(res => {
      this.setState({
        notice_html: res.data.notice_html
      })
    }) 
  }

  render() {
    return (
      <div id="notifications">
        <a href="#" onClick={this.onClick} className="no-deco" id="notice-icon" title="Notifications" aria-label="Notifications">
          <span className="sf2-icon-bell"></span>
          <span className="num hide">0</span>
        </a>
        <div id="notice-popover" className={`sf-popover ${this.state.showNotice ? '': 'hide'}`}>
          <div className="outer-caret up-outer-caret"><div className="inner-caret"></div></div>
          <div className="sf-popover-hd ovhd">
            <h3 className="sf-popover-title">{gettext('Notifications')}</h3>
            <a href="#" onClick={this.onClick} title={gettext('Close')} aria-label={gettext('Close')} className="sf-popover-close js-close sf2-icon-x1 op-icon float-right"></a>
          </div>
          <div className="sf-popover-con">
            <ul className="notice-list" dangerouslySetInnerHTML={{__html: this.state.notice_html}}></ul>
            <a href="/notification/list/" className="view-all">{gettext('See All Notifications')}</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Notification;
