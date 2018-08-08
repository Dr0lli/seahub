import React, { Component } from 'react';
import Search from './search';
import MarkdownViewer from './markdown-viewer';
import Account from './account';
import { repoID, serviceUrl, slug, siteRoot } from './constance';
import { processorGetAST } from '@seafile/seafile-editor/src/lib/seafile-markdown2html';
import WikiOutline from './wiki-outline';



class MainPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      navItems: [],
      activeId: ''
    }
  }

  onMenuClick = () => {
    this.props.onMenuClick();
  }

  onEditClick = (e) => {
    // const w=window.open('about:blank')
    e.preventDefault();
    window.location.href= serviceUrl + '/lib/' + repoID + '/file' + this.props.filePath + '?mode=edit';
  }

  scrollHandler = (event) => {
    var target = event.target || event.srcElement;
    var markdownContainer = this.refs.markdownContainer;
    var headingList = markdownContainer.querySelectorAll('[id^="user-content"]');
    var top = target.scrollTop;
    var defaultOffset = markdownContainer.offsetTop;
    var currentId = '';
    for (let i = 0; i < headingList.length; i++) {
      let heading = headingList[i];
      if (heading.tagName === 'H1') {
        continue;
      }
      if (top > heading.offsetTop - defaultOffset) {
        currentId = '#' + heading.getAttribute('id');
      } else {
        break;
      }
    }

    if (currentId !== this.state.activeId) {
      this.setState({
        activeId: currentId
      })
    }
  }

  formatNodeTree(nodeTree) {
    var navItems = [];
    var headingList = nodeTree.children.filter(node => {
      return (node.type === 'heading' && (node.depth === 2 || node.depth === 3));
    });
    for (let i = 0; i < headingList.length; i++) {
      navItems[i] = {};
      navItems[i].id = '#user-content-' + headingList[i].data.id
      navItems[i].key = i;
      navItems[i].clazz = '';
      navItems[i].depth = headingList[i].depth;
      for (let child of headingList[i].children) {
        if (child.type === 'text') {
          navItems[i].text = child.value;
          break;
        }
      }
    }
    return navItems;
  }

  componentWillReceiveProps(nextProps) {
    var _this = this;
    var content = nextProps.content;
    processorGetAST.run(processorGetAST.parse(content)).then((nodeTree) => {
      if (nodeTree && nodeTree.children && nodeTree.children.length) {
        var navItems = _this.formatNodeTree(nodeTree);
        var currentId = navItems.length > 0 ? navItems[0].id : 0;
        _this.setState({
          navItems: navItems,
          activeId: currentId
        })
      }
    });
  }

  render() {
    var filePathList = this.props.filePath.split('/');
    var pathElem = filePathList.map((item, index) => {
      if (item == "") {
        return;
      } else {
        return (
          <span key={index}><span className="path-split">/</span>{item}</span>
        )
      }
    });

    return (
      <div className="main-panel o-hidden">
        <div className="main-panel-top panel-top">
          <span className="sf2-icon-menu side-nav-toggle hidden-md-up d-md-none" title="Side Nav Menu" onClick={this.onMenuClick}></span>
           <div className={`wiki-page-ops ${this.props.permission === 'rw' ? '' : 'hide'}`}>
              <a className="btn btn-secondary btn-topbar" onClick={this.onEditClick}>Edit Page</a>
           </div>
          <div className="common-toolbar">
            <Search />
            <Account seafileAPI={this.props.seafileAPI} />
          </div>
        </div>
        <div className="cur-view-main">
          <div className="cur-view-path">
            <div className="path-containter">
              <a href={siteRoot + 'wikis/'} className="normal">Wikis</a>
              <span className="path-split">/</span>
              <a href={siteRoot + 'wikis/' + slug} className="normal">{slug}</a>
              {pathElem}
            </div>
          </div>
          <div className="cur-view-content-container" onScroll={this.scrollHandler}>
            <div className="cur-view-content" ref="markdownContainer">
                <MarkdownViewer
                  markdownContent={this.props.content}
                  onLinkClick={this.props.onLinkClick}
                />
                <p id="wiki-page-last-modified">Last modified by {this.props.latestContributor}, <span>{this.props.lastModified}</span></p>
            </div>
            <div className="cur-view-content-outline">
                <WikiOutline 
                  navItems={this.state.navItems} 
                  handleNavItemClick={this.handleNavItemClick}
                  activeId={this.state.activeId}
                />
            </div>
          </div>
        </div>
    </div>
    )
  }
}

export default MainPanel;
