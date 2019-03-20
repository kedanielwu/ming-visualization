import React, { Component } from 'react'
import './App.css'
import dataStore from './store/dataStore'
import { observer } from 'mobx-react'
import FileUploader from './component/FileUploader'
import DataSelector from './component/DataSelector'
import { Row, Col} from 'antd'

window.store = dataStore

const App = observer(() => (
  <div className="main-container">
    <Row type='flex' justify='center' align='middle'>
      <Col span={18}>
      </Col>
      <Col span={6}>
        <FileUploader></FileUploader>
        <DataSelector></DataSelector>
        <div></div>
      </Col>
    </Row>
  </div>
))

export default App
