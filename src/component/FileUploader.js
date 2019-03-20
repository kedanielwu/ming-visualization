import React from 'react'
import { Upload, Button, Icon } from 'antd'
import dataStore from '../store/dataStore'
import { observer } from 'mobx-react'


const handleChange = ({file, fileList}) => {
  if (file.status === "done") {
    dataStore.fileList = fileList
    const fileNameToken = file.name.split('.')[0].split('-')
    if (!dataStore.sessionList.includes(fileNameToken[2])) {
      dataStore.sessionList.push(fileNameToken[2])
    }
    const reader = new FileReader()
    reader.onload = function(event) {
      const contents = JSON.parse(event.target.result)
      if (fileNameToken[1] === 'playback') {
        let sessionData = dataStore.playbackFiles.get(fileNameToken[2])
        if (sessionData) {
          sessionData.set(fileNameToken[0], contents)
        } else {
          dataStore.playbackFiles.set(fileNameToken[2], new Map())
          sessionData = dataStore.playbackFiles.get(fileNameToken[2])
          sessionData.set(fileNameToken[0], contents)
        }
      } else if (fileNameToken[1] === 'problem') {
        let sessionData = dataStore.problemFiles.get(fileNameToken[2])
        if (sessionData) {
          sessionData.set(fileNameToken[0], contents)
        } else {
          dataStore.problemFiles.set(fileNameToken[2], new Map())
          sessionData = dataStore.problemFiles.get(fileNameToken[2])
          sessionData.set(fileNameToken[0], contents)
        }
      }

      
    }
    reader.readAsText(file.originFileObj)
    console.log(dataStore.fileList)
  }
}

const FileUploader = observer(() => (
  <Upload 
      action="http://127.0.0.1:8080/study"
      onChange={handleChange}
      multiple
      showUploadList={false}
    >
        <Button>
          <Icon type="upload" /> Upload Study Recording Files
        </Button>
  </Upload>
))

export default FileUploader