import {observable, computed} from 'mobx'

class dataStore {
  @observable fileList = []
  @observable playbackFiles = new Map()
  @observable problemFiles = new Map()
  @observable sessionList = []
}

export default new dataStore()