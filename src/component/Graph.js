import React from 'react'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts"
import { observer } from 'mobx-react'
import UIStore from '../store/UIStore'
import dataStore from '../store/dataStore'
import DataSet from "@antv/data-set"


const Graph = observer(() => {
  const selectedSession = UIStore.selectedSession
  const selectedParticipants = UIStore.selectedParticipants
  if (!selectedSession || selectedParticipants.length === 0) {
    return null
  }
  const _data = [{sessionTime: 0}]
  const _problemData = new Map()
  selectedParticipants.forEach((participant) => {
    const _records = dataStore.playbackFiles.get(selectedSession)
    let records = []
    if (_records) {
      records = _records.get(participant)
    }
    records.forEach(record => {
      const time = Math.round(record.sessionTime)
      if (_data[time]) {
        _data[time][participant] = Math.round(record.videoTime)
      } else {
        _data[time] = {sessionTime: time}
        _data[time][participant] = Math.round(record.videoTime)
      }
    })
    const _problems = dataStore.problemFiles.get(selectedSession)
    let problems = []
    if (_problems) {
      problems = _problems.get(participant)
    }
    const temp = problems.filter(val => !val.fakeInput).map(val => ({
      p_videoTime: val.start_index + 5,
      p_sessionTime: Math.round(val.sessionTime),
      p_title: val.title ? val.title : [],
      p_description: val.description,
      p_participants: participant
    }))
    _problemData.set(participant, temp)
  })
  const data = [_data, [..._problemData.values()]].flat(2)
  const ds = new DataSet()
  const dv = ds.createView().source(data)
  dv.transform({
    type: "fold",
    fields: [
      selectedParticipants, 
    ].flat(2),
    key: "participants",
    value: "videoTime",
    retains: [
      'sessionTime', 
      'p_sessionTime',
      'p_title',
      'p_description',
      'p_videoTime',
      'p_participants',
    ]
  })
  console.log(dv)
  const maxVideoTime = Math.max.apply(null, dv.rows.map(val => val.videoTime ? val.videoTime : val.p_videoTime)
  .filter(n => n))
  const maxSessionTime = Math.max.apply(null, dv.rows.map(val => val.sessionTime ? val.sessionTime : val.p_sessionTime).filter(n=>n))
  console.log(maxVideoTime)
  const col = {
    videoTime: {
      minLimit: 0,
      min: 0,
      maxLimit: maxVideoTime,
      max: maxVideoTime,
      formatter: val => (new Date(val * 1000).toISOString().substr(14, 5))
    },
    p_videoTime: {
      min: 0,
      minLimit: 0,
      maxLimit: maxVideoTime,
      max: maxVideoTime,
      formatter: val => (new Date(val * 1000).toISOString().substr(14, 5))
    },
    p_sessionTime: {
      min: 0,
      minLimit: 0,
      maxLimit: maxSessionTime,
      max: maxSessionTime,
      formatter: val => (new Date(val * 1000).toISOString().substr(14, 5))
    },
    sessionTime: {
      min: 0,
      minLimit: 0,
      maxLimit: maxSessionTime,
      max: maxSessionTime,
      formatter: val => (new Date(val * 1000).toISOString().substr(14, 5))
    }
  }
  return (
    <div>
      <Chart height={400} data={dv} scale={col} forceFit>
          <Legend 
            itemFormatter={function(val){return `participant ${val}`}}
          />
          
          <Axis 
            name="sessionTime" 
            title
          />
          <Axis
            name="videoTime"
            title
          />
          <Axis
            name="p_videoTime"
            title
            visible={false}
          />
          <Axis
            name="p_sessionTime"
            title
            visible={false}
          />
          <Tooltip
            crosshairs={{
              type: "cross"
            }}
          />
          <Geom
            type="line"
            position="sessionTime*videoTime"
            size={2}
            color={"participants"}
            tooltip={
              [
                'participants*videoTime*sessionTime', 
                (p, v, s)=>{
                  console.log(v)
                  return {
                    name: 'Participant ' + p + ": ",
                    title: 'Session Time: ' + (new Date(s * 1000).toISOString().substr(14, 5)),
                    value: v !== undefined ? (new Date(v * 1000).toISOString().substr(14, 5)) : 'Finished'
                  }
                }
              ]
            }
          />
          <Geom
            type="point"
            position="p_sessionTime*p_videoTime"
            size={4}
            shape={"circle"}
            color={"p_participants"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
            tooltip={
              [
                'p_participants*p_title*p_sessionTime*p_description', 
                (p, pt, s, pd)=>{

                  return {
                    name: 'Title: ' + pt.join(','),
                    title: 'Participant ' + p + ' at ' + (new Date(s * 1000).toISOString().substr(14, 5)),
                    value: 'Description: ' + pd
                  }
                }
              ]
            }
          />
        </Chart>
    </div>
  )
})

export default Graph