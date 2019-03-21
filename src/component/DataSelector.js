import React from 'react'
import { Select, Checkbox, Col, Row } from 'antd'
import { observer } from 'mobx-react'
import dataStore from '../store/dataStore'
import UIStore from '../store/UIStore'

const Option = Select.Option
const CheckboxGroup = Checkbox.Group

const SessionSelector = observer(() => {
  return (
    <div>
      <Select 
        value={UIStore.selectedSession}
        onChange={(value) => {
          UIStore.selectedParticipants = []
          UIStore.selectedSession = value
        }}
        style={{width: '100%'}}
        placeholder="Select a session to begin"
      >
        {dataStore.sessionList.map((session) => (
          <Option key={session} value={session}>Session: {session}</Option>
        ))}
      </Select>
    </div>
  )
})

const UserSelector = observer(() => {
  if (!UIStore.selectedSession) {
    return null
  }
  let temp
  if (dataStore.playbackFiles.get(UIStore.selectedSession)) {
    temp = dataStore.playbackFiles.get(UIStore.selectedSession).keys()
  } else if (dataStore.problemFiles.get(UIStore.selectedSession)) {
    temp = dataStore.problemFiles.get(UIStore.selectedSession).keys()
  }
  const options = [...temp]
  return (
    <div>
      <div className="user-selector-header">Select Participants: </div>
      <CheckboxGroup 
        onChange={values => {UIStore.selectedParticipants = values}}
        value={UIStore.selectedParticipants}
      >
        <Row>
          {options.map(user => <Col key={user} span={24}><Checkbox value={user}>Participant {user}</Checkbox></Col>)}
        </Row>
      </CheckboxGroup>
    </div>
  )
})

const DataSelector = observer(() => {
  return (
    <div>
      <SessionSelector></SessionSelector>
      <UserSelector></UserSelector>
    </div>
  )
})

export default DataSelector