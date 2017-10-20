import React from 'react'
import style from './index.css'

import { connect } from 'dva';
import { Layout, Icon } from 'antd'

import Menu from './components/menu'
import HorizotalMenu from './components/horizontalMenu'
import Header from '../Header/HeaderLight'
import ContentRow from './components/contentRow'



const {
  Sider,
  Content,
} = Layout

class Profile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const data = this.props.data
    return (
      <div className={style.profile_container} >
        <div className={style.profile}>
          <div>
            <div className={style.ai_logo}>
              <img alt={data.title} src={data.logoSrc} />
            </div>
            <div className={style.head_data}>
              <div className={style.title_container}>
                <h1>{data.title}</h1>
                <span><Icon type="star-o" /></span>
              </div>
              <div className={style.meta_data}>
                <div>
                  <span><Icon type="user" /></span>
                  <a href="www.google.com">{data.creator}</a>
                </div>
                <div>
                  <span><Icon type="global" /></span>
                  <a href="www.google.com">{data.host}</a>
                </div>
                <div>
                  <span><Icon type="tag" /></span>
                  <a href="www.google.com">{data.tag}</a>
                </div>
                <div>
                  <span><Icon type="clock-circle-o" /></span>
                  <a href="www.google.com">{data.createAt}</a>
                </div>
              </div>
            </div>
          </div>
          <p className={style.description}>{data.describe}</p>
        </div>
      </div>
    )
  }
}

class Details extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Layout>
        <Header />
        <Profile data={this.props.profile} />
        <HorizotalMenu />
        <Layout>
          <Sider width={200}>
            <Menu apis={this.props.apis} />
          </Sider>
          <Content>
            <ContentRow
              request={this.props.request}
              response={this.props.response}
            />
            <ContentRow
              request={this.props.request}
              response={this.props.response}
            />
            <ContentRow
              request={this.props.request}
              response={this.props.response}
            />
          </Content>
        </Layout>
      </Layout>
    )
  }
}

const mapStateToProps = state => state.ai

export default connect(mapStateToProps)(Details)
